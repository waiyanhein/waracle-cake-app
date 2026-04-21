import { useState } from 'react';

type Config = {
  appName: string;
  apiUrl: string;
};

export const useConfig = () => {
  const [config, setConfig] = useState<Config | undefined>(undefined);
  const getAppConfig = () => {
    if (config) {
      return config;
    }
    const newConfig = {
      appName: import.meta.env.VITE_APP_NAME,
      apiUrl: import.meta.env.VITE_API_URL,
    };
    setConfig(newConfig);
    return newConfig;
  };

  return {
    getAppConfig,
  };
};
