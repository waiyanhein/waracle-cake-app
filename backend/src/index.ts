import { initApp } from './app';

const start = async () => {
  const app = await initApp();

  app.listen(3000, () => {
    console.log('Server running');
  });
};

start();
