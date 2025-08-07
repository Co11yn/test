import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Key, Clock, CheckCircle, XCircle } from 'lucide-react';
import { LicenseKey, Application } from '../types';
import { storage } from '../utils/storage';
import { generateLicenseKey, generateId } from '../utils/keyGenerator';

export function LicenseKeysTab() {
  const [keys, setKeys] = useState<LicenseKey[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingKey, setEditingKey] = useState<LicenseKey | null>(null);
  const [formData, setFormData] = useState({
    applicationId: '',
    durationDays: 30,
    expirationDate: ''
  });

  useEffect(() => {
    setKeys(storage.getLicenseKeys());
    setApplications(storage.getApplications());
    
    // Set default expiration date to 30 days from now
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    setFormData(prev => ({
      ...prev,
      expirationDate: defaultDate.toISOString().split('T')[0]
    }));
  }, []);

  const getApplicationName = (appId: string) => {
    const app = applications.find(a => a.id === appId);
    return app ? app.name : 'Неизвестно';
  };

  const getStatusBadge = (status: LicenseKey['status']) => {
    const statusConfig = {
      pending: { icon: Clock, color: 'bg-orange-100 text-orange-800', text: 'Ожидание' },
      active: { icon: CheckCircle, color: 'bg-green-100 text-green-800', text: 'Активен' },
      banned: { icon: XCircle, color: 'bg-red-100 text-red-800', text: 'Забанен' }
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newKey: LicenseKey = {
      id: generateId(),
      applicationId: formData.applicationId,
      key: generateLicenseKey(),
      status: 'pending',
      durationDays: formData.durationDays,
      expirationDate: formData.expirationDate,
      createdAt: new Date().toISOString()
    };
    
    storage.addLicenseKey(newKey);
    setKeys(storage.getLicenseKeys());
    setShowModal(false);
    setFormData({
      applicationId: '',
      durationDays: 30,
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKey) return;

    storage.updateLicenseKey(editingKey.id, {
      status: formData.applicationId as any, // Using applicationId field for status in edit mode
      durationDays: formData.durationDays,
      expirationDate: formData.expirationDate
    });
    
    setKeys(storage.getLicenseKeys());
    setShowEditModal(false);
    setEditingKey(null);
  };

  const handleEdit = (key: LicenseKey) => {
    setEditingKey(key);
    setFormData({
      applicationId: key.status, // Using for status
      durationDays: key.durationDays,
      expirationDate: key.expirationDate.split('T')[0]
    });
    setShowEditModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот ключ?')) {
      storage.deleteLicenseKey(id);
      setKeys(storage.getLicenseKeys());
    }
  };

  const openCreateModal = () => {
    setFormData({
      applicationId: applications[0]?.id || '',
      durationDays: 30,
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const getRemainingDays = (key: LicenseKey) => {
    if (key.status !== 'active') return null;
    
    const now = new Date();
    const expiration = new Date(key.expirationDate);
    const diffTime = expiration.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Лицензионные ключи</h2>
          <p className="text-gray-600 mt-1">Управление лицензионными ключами</p>
        </div>
        {applications.length > 0 && (
          <button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Создать ключ
          </button>
        )}
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Нет приложений</h3>
          <p className="text-gray-600">Сначала создайте приложение в соответствующем разделе</p>
        </div>
      ) : keys.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Нет лицензионных ключей</h3>
          <p className="text-gray-600 mb-4">Создайте первый лицензионный ключ</p>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Создать ключ
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ключ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Приложение
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Срок (дни)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Осталось дней
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Создан
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {keys.map((key) => {
                  const remainingDays = getRemainingDays(key);
                  return (
                    <tr key={key.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {key.key}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getApplicationName(key.applicationId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(key.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {key.durationDays}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {remainingDays !== null ? (
                          <span className={remainingDays > 7 ? 'text-green-600' : remainingDays > 0 ? 'text-orange-600' : 'text-red-600'}>
                            {remainingDays > 0 ? remainingDays : 'Истек'}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(key.createdAt).toLocaleString('ru-RU')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(key)}
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                            title="Редактировать"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(key.id)}
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                            title="Удалить"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Создать лицензионный ключ
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="applicationId" className="block text-sm font-medium text-gray-700 mb-2">
                  Приложение
                </label>
                <select
                  id="applicationId"
                  value={formData.applicationId}
                  onChange={(e) => setFormData(prev => ({ ...prev, applicationId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Выберите приложение</option>
                  {applications.map(app => (
                    <option key={app.id} value={app.id}>{app.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="durationDays" className="block text-sm font-medium text-gray-700 mb-2">
                  Срок действия (дни)
                </label>
                <input
                  id="durationDays"
                  type="number"
                  min="1"
                  value={formData.durationDays}
                  onChange={(e) => setFormData(prev => ({ ...prev, durationDays: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Дата окончания
                </label>
                <input
                  id="expirationDate"
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Создать ключ
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingKey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Редактировать ключ
            </h3>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Статус
                </label>
                <select
                  id="status"
                  value={formData.applicationId}
                  onChange={(e) => setFormData(prev => ({ ...prev, applicationId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="pending">Ожидание</option>
                  <option value="active">Активен</option>
                  <option value="banned">Забанен</option>
                </select>
              </div>

              <div>
                <label htmlFor="editDurationDays" className="block text-sm font-medium text-gray-700 mb-2">
                  Срок действия (дни)
                </label>
                <input
                  id="editDurationDays"
                  type="number"
                  min="1"
                  value={formData.durationDays}
                  onChange={(e) => setFormData(prev => ({ ...prev, durationDays: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="editExpirationDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Дата окончания
                </label>
                <input
                  id="editExpirationDate"
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Сохранить
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingKey(null);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}