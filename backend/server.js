const app = require('./app');
const config = require('./config');

app.listen(config.port, () => {
    console.log(`\nServer running on http://localhost:${config.port}`);
    console.log(`Chat endpoint: POST http://localhost:${config.port}/api/chat`);
    console.log(`Process endpoint: POST http://localhost:${config.port}/api/process/:documentId`);
    console.log(`Health check: GET http://localhost:${config.port}/health\n`);
});