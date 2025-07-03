
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useJenkinsConfig } from '@/hooks/useJenkinsConfig';
import { useJenkinsConnection } from '@/hooks/useJenkinsData';
import { JenkinsConfig } from '@/services/jenkinsApi';

export function JenkinsSettings() {
  const { config, updateConfig, clearConfig } = useJenkinsConfig();
  const { data: isConnected, refetch: testConnection, isLoading: isTestingConnection } = useJenkinsConnection();
  
  const [formData, setFormData] = useState<JenkinsConfig>({
    serverUrl: config?.serverUrl || '',
    username: config?.username || '',
    apiToken: config?.apiToken || '',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: keyof JenkinsConfig, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      updateConfig(formData);
      setTimeout(() => {
        testConnection();
        setIsSaving(false);
      }, 500);
    } catch (error) {
      console.error('Failed to save configuration:', error);
      setIsSaving(false);
    }
  };

  const handleTestConnection = () => {
    if (formData.serverUrl && formData.username && formData.apiToken) {
      updateConfig(formData);
      setTimeout(() => testConnection(), 500);
    }
  };

  const handleClearConfig = () => {
    clearConfig();
    setFormData({
      serverUrl: '',
      username: '',
      apiToken: '',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Jenkins-Konfiguration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="serverUrl">Jenkins Server URL</Label>
            <Input
              id="serverUrl"
              placeholder="https://jenkins.example.com"
              value={formData.serverUrl}
              onChange={(e) => handleInputChange('serverUrl', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Benutzername</Label>
            <Input
              id="username"
              placeholder="ihr-benutzername"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiToken">API Token</Label>
            <Input
              id="apiToken"
              type="password"
              placeholder="ihr-api-token"
              value={formData.apiToken}
              onChange={(e) => handleInputChange('apiToken', e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSave}
              disabled={isSaving || !formData.serverUrl || !formData.username || !formData.apiToken}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Konfiguration speichern
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={isTestingConnection || !formData.serverUrl || !formData.username || !formData.apiToken}
            >
              {isTestingConnection && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verbindung testen
            </Button>

            <Button 
              variant="destructive" 
              onClick={handleClearConfig}
              disabled={!config}
            >
              Konfiguration löschen
            </Button>
          </div>

          {isConnected !== undefined && (
            <Alert className={isConnected ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={isConnected ? "text-green-800" : "text-red-800"}>
                  {isConnected 
                    ? "Verbindung zu Jenkins erfolgreich!" 
                    : "Verbindung zu Jenkins fehlgeschlagen. Überprüfen Sie Ihre Konfiguration."
                  }
                </AlertDescription>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Anleitung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. Geben Sie die URL Ihres Jenkins-Servers ein (z.B. https://jenkins.example.com)</p>
          <p>2. Verwenden Sie Ihren Jenkins-Benutzernamen</p>
          <p>3. Erstellen Sie ein API-Token in Jenkins unter: Benutzerverwaltung → Konfiguration → API Token</p>
          <p>4. Speichern Sie die Konfiguration und testen Sie die Verbindung</p>
        </CardContent>
      </Card>
    </div>
  );
}
