var MongoClient = require('mongodb').MongoClient;
class Database {
  static connect(url, dbName) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, {
        useNewUrlParser: true
      }).then(client => {
        resolve(new this(client.db(dbName)));
      });
    });
  }
  constructor(db) {
    this.db = db;
    this.messagesCollection = db.collection('messages');
    this.messagesCollection.createIndex({ date: -1 });
  }
  saveMessage(msg) {
    this.messagesCollection.insertOne({
      body: msg,
      date: new Date()
    });
  }
  getMessages() {
    return new Promise((resolve, reject) => {
      this.messagesCollection.find().sort({ date: -1 }).limit(100).toArray().then(msgs => {
        msgs.reverse();
        msgs = msgs.map(msg => {
          return msg.body;
        });
        resolve(msgs);
      });
    });
  }
}
module.exports = Database;
