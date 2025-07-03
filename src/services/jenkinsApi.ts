
export interface JenkinsConfig {
  serverUrl: string;
  apiToken: string;
  username: string;
}

export interface JenkinsJob {
  name: string;
  url: string;
  color: string;
  _class: string;
}

export interface JenkinsBuild {
  id: string;
  number: number;
  url: string;
  result: string | null;
  building: boolean;
  timestamp: number;
  duration: number;
  changeSet: {
    items: Array<{
      author: {
        fullName: string;
      };
      msg: string;
    }>;
  };
}

export interface JenkinsJobDetails {
  name: string;
  url: string;
  builds: Array<{
    number: number;
    url: string;
  }>;
}

class JenkinsApiService {
  private config: JenkinsConfig | null = null;

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    const stored = localStorage.getItem('jenkins-config');
    if (stored) {
      this.config = JSON.parse(stored);
    }
  }

  setConfig(config: JenkinsConfig) {
    this.config = config;
    localStorage.setItem('jenkins-config', JSON.stringify(config));
  }

  getConfig(): JenkinsConfig | null {
    return this.config;
  }

  private getAuthHeaders(): HeadersInit {
    if (!this.config) {
      throw new Error('Jenkins configuration not set');
    }

    const auth = btoa(`${this.config.username}:${this.config.apiToken}`);
    return {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    };
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    if (!this.config) {
      throw new Error('Jenkins configuration not set');
    }

    const url = `${this.config.serverUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`Jenkins API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Jenkins API request failed:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/api/json');
      return true;
    } catch {
      return false;
    }
  }

  async getJobs(): Promise<JenkinsJob[]> {
    const data = await this.makeRequest<{ jobs: JenkinsJob[] }>('/api/json');
    return data.jobs;
  }

  async getJobDetails(jobName: string): Promise<JenkinsJobDetails> {
    return await this.makeRequest<JenkinsJobDetails>(`/job/${encodeURIComponent(jobName)}/api/json`);
  }

  async getBuildDetails(jobName: string, buildNumber: number): Promise<JenkinsBuild> {
    return await this.makeRequest<JenkinsBuild>(
      `/job/${encodeURIComponent(jobName)}/${buildNumber}/api/json`
    );
  }

  async getRecentBuilds(jobName: string, count: number = 10): Promise<JenkinsBuild[]> {
    const jobDetails = await this.getJobDetails(jobName);
    const recentBuilds = jobDetails.builds.slice(0, count);
    
    const buildPromises = recentBuilds.map(build => 
      this.getBuildDetails(jobName, build.number)
    );
    
    return await Promise.all(buildPromises);
  }
}

export const jenkinsApi = new JenkinsApiService();
