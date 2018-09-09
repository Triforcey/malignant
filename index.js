require('dotenv').config();

var express = require('express');
var app = express();
app.set('view engine', 'pug');
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var mongoConfig = {
  url: process.env.DB_URL || 'mongodb://localhost:27017',
  dbName: process.env.DB_NAME || 'malignant'
};

require('./database.js').connect(mongoConfig.url, mongoConfig.dbName).then(db => {
  app.use(express.static('public'));

  app.get('/', (req, res) => {
    res.render('index');
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
