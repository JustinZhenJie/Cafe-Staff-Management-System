const { MongoClient } = require("mongodb");
const db = process.env.MONGODB_URI || "mongodb://localhost:27017";

const client = new MongoClient(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var _db;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      // Verify we got a good "db" object
      if (db) {
        _db = db.db("myFirstDatabase");
        console.log("Successfully connected to MongoDB.");
      }
      return callback(err);
    });
  },
  getDb: function () {
    return _db;
  },
};
