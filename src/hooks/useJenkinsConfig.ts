
import { useState, useEffect } from 'react';
import { jenkinsApi, JenkinsConfig } from '@/services/jenkinsApi';

export function useJenkinsConfig() {
  const [config, setConfig] = useState<JenkinsConfig | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const loadedConfig = jenkinsApi.getConfig();
    setConfig(loadedConfig);
    setIsConfigured(!!loadedConfig);
  }, []);

  const updateConfig = (newConfig: JenkinsConfig) => {
    jenkinsApi.setConfig(newConfig);
    setConfig(newConfig);
    setIsConfigured(true);
  };

  const clearConfig = () => {
    localStorage.removeItem('jenkins-config');
    setConfig(null);
    setIsConfigured(false);
  };

  return {
    config,
    isConfigured,
    updateConfig,
    clearConfig,
  };
}
