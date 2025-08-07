import React, { useState } from 'react';
import { LogOut, Package, Key, Code, Settings } from 'lucide-react';
import { storage } from '../utils/storage';
import { ApplicationsTab } from './ApplicationsTab';
import { LicenseKeysTab } from './LicenseKeysTab';
import { ApiDocsTab } from './ApiDocsTab';

interface AdminPanelProps {
  onLogout: () => void;
}

type Tab = 'applications' | 'keys' | 'api' | 'settings';

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('applications');

  const handleLogout = () => {
    storage.setIsLoggedIn(false);
    onLogout();
  };

  const tabs = [
    { id: 'applications' as Tab, label: 'Приложения', icon: Package },
    { id: 'keys' as Tab, label: 'Лицензионные ключи', icon: Key },
    { id: 'api' as Tab, label: 'API документация', icon: Code },
    { id: 'settings' as Tab, label: 'Настройки', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'applications':
        return <ApplicationsTab />;
      case 'keys':
        return <LicenseKeysTab />;
      case 'api':
        return <ApiDocsTab />;
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Настройки</h2>
              <p className="text-gray-600 mt-1">Управление системными настройками</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-600">Настройки будут добавлены в следующих версиях системы.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <div className="bg-blue-600 rounded-lg p-2 mr-3">
                    <Key className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">License Manager</h1>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Администратор</span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg border border-gray-200 p-4">
              <ul className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <li key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {tab.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}