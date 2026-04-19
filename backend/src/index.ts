import { initApp } from './app';

const start = async () => {
  const app = await initApp();

  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
};

start();
