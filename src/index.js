import { app, PORT } from './server.js';

app.listen(PORT, '0.0.0.0', () => { // 0.0.0.0 expose to all interfaces for outside testing. Bruno wont work when run from WSL
  console.log(`Server is running on port ${PORT} and bound to all interfaces`);
});

export { app };
