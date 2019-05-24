const routes = require('./routes/routes.js');

app.use('/api/v1', routes(router));