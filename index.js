require('dotenv').config();

var express = require('express');
var app = express();
app.enable('trust proxy');
app.set('view engine', 'pug');
var server = require('http').createServer(app);
var io = require('socket.io')(server);

if (process.env.SECURE == 'true') {
  app.use(require('helmet')());
  app.use((req, res, next) => {
    if (req.protocol != 'http') return next();
    res.status(301).redirect(`https://${req.get('host')}${req.originalUrl}`);
  });
}

var mongoConfig = {
  url: process.env.DB_URL || 'mongodb://localhost:27017',
  dbName: process.env.DB_NAME || 'malignant'
};

require('./database.js').connect(mongoConfig.url, mongoConfig.dbName).then(db => {
  app.use(express.static('public'));

  app.get('/', (req, res) => {
    res.render('index');
  });

  app.use((req, res) => {
    res.status(404).send('404');
  });

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('500');
  });

  io.on('connection', ws => {
    db.getMessages().then(msgs => {
      ws.emit('init', msgs);
    });
    ws.on('message', msg => {
      if (typeof msg != 'string') return;
      db.saveMessage(msg);
      io.emit('message', msg);
    });
  });

  var port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
  });
});
