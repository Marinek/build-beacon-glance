
import { JenkinsSettings } from '@/components/JenkinsSettings';

export default function Settings() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Einstellungen</h1>
        <p className="text-muted-foreground mt-2">
          Konfigurieren Sie Ihre Jenkins-Verbindung
        </p>
      </div>

      <JenkinsSettings />
    </div>
  );
}
