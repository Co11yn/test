import React, { useState } from 'react';
import { Code, Copy, CheckCircle, AlertTriangle, Key, Activity } from 'lucide-react';

export function ApiDocsTab() {
  const [copiedCode, setCopiedCode] = useState('');

  const copyToClipboard = (text: string, codeId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(codeId);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const CodeBlock = ({ code, language, id }: { code: string; language: string; id: string }) => (
    <div className="relative">
      <div className="absolute top-2 right-2">
        <button
          onClick={() => copyToClipboard(code, id)}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
          title="Скопировать код"
        >
          {copiedCode === id ? (
            <CheckCircle className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4 text-gray-300" />
          )}
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">API Документация</h2>
        <p className="text-gray-600">Интеграция с системой лицензионных ключей</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <AlertTriangle className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="font-medium text-blue-900">Важная информация</h3>
        </div>
        <p className="text-blue-800 text-sm">
          Это демо-версия. В реальном проекте API endpoints должны быть реализованы на бэкенде с соответствующей аутентификацией и безопасностью.
        </p>
      </div>

      {/* Base URL */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Базовый URL</h3>
        <CodeBlock
          code="https://your-api-domain.com/api/v1"
          language="text"
          id="base-url"
        />
      </div>

      {/* Activate License */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center mb-3">
          <Key className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Активация лицензии</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Активирует лицензионный ключ и переводит его в статус "Активен"
        </p>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Запрос</h4>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-mono inline-block mb-2">
              POST /license/activate
            </div>
            <CodeBlock
              code={`{
  "key": "XXXX-XXXX-XXXX-XXXX"
}`}
              language="json"
              id="activate-request"
            />
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Успешный ответ (200)</h4>
            <CodeBlock
              code={`{
  "success": true,
  "message": "Key activated successfully",
  "data": {
    "key": "XXXX-XXXX-XXXX-XXXX",
    "status": "active",
    "expirationDate": "2024-02-15T12:00:00.000Z",
    "activatedAt": "2024-01-16T12:00:00.000Z"
  }
}`}
              language="json"
              id="activate-success"
            />
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Ошибка (400)</h4>
            <CodeBlock
              code={`{
  "success": false,
  "message": "Key not found or already activated"
}`}
              language="json"
              id="activate-error"
            />
          </div>
        </div>
      </div>

      {/* Validate License */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center mb-3">
          <Activity className="h-5 w-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Проверка лицензии</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Проверяет валидность лицензионного ключа
        </p>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Запрос</h4>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-mono inline-block mb-2">
              GET /license/validate?key=XXXX-XXXX-XXXX-XXXX
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Валидный ключ (200)</h4>
            <CodeBlock
              code={`{
  "valid": true,
  "message": "Key is valid",
  "data": {
    "key": "XXXX-XXXX-XXXX-XXXX",
    "status": "active",
    "expirationDate": "2024-02-15T12:00:00.000Z",
    "daysRemaining": 30
  }
}`}
              language="json"
              id="validate-valid"
            />
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Невалидный ключ (400)</h4>
            <CodeBlock
              code={`{
  "valid": false,
  "message": "Key has expired",
  "data": {
    "key": "XXXX-XXXX-XXXX-XXXX",
    "status": "active",
    "expirationDate": "2024-01-01T12:00:00.000Z"
  }
}`}
              language="json"
              id="validate-invalid"
            />
          </div>
        </div>
      </div>

      {/* Implementation Examples */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center mb-3">
          <Code className="h-5 w-5 text-purple-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Примеры интеграции</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">JavaScript/Node.js</h4>
            <CodeBlock
              code={`// Активация лицензии
async function activateLicense(licenseKey) {
  try {
    const response = await fetch('https://your-api-domain.com/api/v1/license/activate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: licenseKey })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('License activated:', result.data);
      return true;
    } else {
      console.error('Activation failed:', result.message);
      return false;
    }
  } catch (error) {
    console.error('Network error:', error);
    return false;
  }
}

// Проверка лицензии
async function validateLicense(licenseKey) {
  try {
    const response = await fetch(\`https://your-api-domain.com/api/v1/license/validate?key=\${licenseKey}\`);
    const result = await response.json();
    
    return result.valid;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
}

// Использование
const key = 'A1B2-C3D4-E5F6-G7H8';
const isActivated = await activateLicense(key);
if (isActivated) {
  const isValid = await validateLicense(key);
  console.log('Key is valid:', isValid);
}`}
              language="javascript"
              id="js-example"
            />
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Python</h4>
            <CodeBlock
              code={`import requests
import json

class LicenseClient:
    def __init__(self, base_url):
        self.base_url = base_url
    
    def activate_license(self, license_key):
        """Активировать лицензионный ключ"""
        try:
            response = requests.post(
                f"{self.base_url}/license/activate",
                json={"key": license_key},
                headers={"Content-Type": "application/json"}
            )
            
            result = response.json()
            return result.get("success", False), result.get("message", "")
            
        except Exception as e:
            return False, str(e)
    
    def validate_license(self, license_key):
        """Проверить валидность лицензии"""
        try:
            response = requests.get(
                f"{self.base_url}/license/validate",
                params={"key": license_key}
            )
            
            result = response.json()
            return result.get("valid", False)
            
        except Exception as e:
            return False

# Использование
client = LicenseClient("https://your-api-domain.com/api/v1")

key = "A1B2-C3D4-E5F6-G7H8"
success, message = client.activate_license(key)

if success:
    is_valid = client.validate_license(key)
    print(f"License is valid: {is_valid}")
else:
    print(f"Activation failed: {message}")`}
              language="python"
              id="python-example"
            />
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">C#</h4>
            <CodeBlock
              code={`using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

public class LicenseClient
{
    private readonly HttpClient _httpClient;
    private readonly string _baseUrl;

    public LicenseClient(string baseUrl)
    {
        _baseUrl = baseUrl;
        _httpClient = new HttpClient();
    }

    public async Task<bool> ActivateLicenseAsync(string licenseKey)
    {
        try
        {
            var payload = new { key = licenseKey };
            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync($"{_baseUrl}/license/activate", content);
            var responseContent = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<JsonElement>(responseContent);

            return result.GetProperty("success").GetBoolean();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> ValidateLicenseAsync(string licenseKey)
    {
        try
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/license/validate?key={licenseKey}");
            var responseContent = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<JsonElement>(responseContent);

            return result.GetProperty("valid").GetBoolean();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            return false;
        }
    }
}

// Использование
var client = new LicenseClient("https://your-api-domain.com/api/v1");
var key = "A1B2-C3D4-E5F6-G7H8";

var isActivated = await client.ActivateLicenseAsync(key);
if (isActivated)
{
    var isValid = await client.ValidateLicenseAsync(key);
    Console.WriteLine($"License is valid: {isValid}");
}`}
              language="csharp"
              id="csharp-example"
            />
          </div>
        </div>
      </div>

      {/* Error Codes */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Коды ошибок</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Код
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Описание
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сообщение
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">400</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Ключ не найден</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Key not found</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">400</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Ключ уже активирован</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Key already activated</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">400</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Ключ заблокирован</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Key is banned</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">400</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Ключ истек</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Key has expired</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">422</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Неверный формат ключа</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Invalid key format</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">500</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Внутренняя ошибка сервера</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Internal server error</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}