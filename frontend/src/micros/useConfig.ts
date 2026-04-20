type Config = {
  appName: string;
  apiUrl: string;
};

let config: Config | undefined;
export const useConfig = () => {
  const getAppConfig = () => {
    if (config) {
      return config;
    }
    config = {
      appName: import.meta.env.VITE_APP_NAME,
      apiUrl: import.meta.env.VITE_API_URL,
    };
  };

  return {
    getAppConfig,
  };
};
