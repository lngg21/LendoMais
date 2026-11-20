const app = require('./app');
const { initDatabase } = require('./config/database');

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

initDatabase()
  .then(() => {
    app.listen(PORT, HOST, () => {
      console.log(`Servidor rodando em http://${HOST}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao inicializar o banco de dados:', err.message || err);
    process.exit(1);
  });


