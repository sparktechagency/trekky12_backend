// src/server.js
const app = require('./app');

const PORT = process.env.PORT || 5002;
// const HOST = process.env.HOST_URL || '0.0.0.0';


// app.listen(PORT, HOST, () => {
//   console.log(`🚐 RV SaaS backend is running on port http://${HOST}:${PORT}`);
// });



app.listen(PORT, () => {
  console.log(`🚐 RV SaaS backend is running on port ${PORT}`);
});
