const PORT = 3000;
const HOST = 'localhost';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { loadModel } = require('./models');
const db = require('./models').getDB();
const indexRouter = require('./routes');
const rf = require('./routing/routerFactory');
const sessionAuth = require('./middle-ware/session-auth');

loadModel('./models');

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());

indexRouter.loadRouter('./routes');

app.use('/', sessionAuth);
app.use('/', indexRouter);

Object.keys(db.sequelize.models).forEach((key) => {
  app.use('/api', rf.genCrud(db.sequelize.models[key]));
});

app.listen(PORT, () => console.log(`App is listening on http://${HOST}:${PORT}/`)); // eslint-disable-line no-console
