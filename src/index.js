import { app, PORT } from './server.js';

app.listen(PORT, '0.0.0.0', () => { // 0.0.0.0 expose to all interfaces for testing outside connetion
  console.log(`Server is running on port ${PORT} and bound to all interfaces`);
});

export default app;
