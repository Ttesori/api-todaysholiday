const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
const mConnectionString = `mongodb+srv://${process.env.MONGO_DB}:${process.env.MONGO_PASS}@cluster0.0j8hc.mongodb.net/todaysholiday?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API access available at /holidays');
});

app.get('/holidays', (req, res) => {
  MongoClient.connect(mConnectionString, { useUnifiedTopology: true })
    .then(client => {
      const db = client.db('todaysholiday');
      db.collection('holidays').find().toArray().then(results => {
        res.json(results);
      }).catch(err => console.error(err));
    })
    .catch(err => console.log(err));
});

app.get('/holidays/:month', (req, res) => {
  MongoClient.connect(mConnectionString, { useUnifiedTopology: true })
    .then(client => {
      const db = client.db('todaysholiday');
      db.collection('holidays').find({ month: req.params.month }).toArray().then(results => {
        res.json(results);
      }).catch(err => console.error(err));
    })
    .catch(err => console.log(err));
});

app.get('/holidays/:month/:day', (req, res) => {
  MongoClient.connect(mConnectionString, { useUnifiedTopology: true })
    .then(client => {
      const db = client.db('todaysholiday');
      db.collection('holidays').find({
        month: req.params.month,
        day: req.params.day
      }).toArray().then(results => {
        res.json(results);
      }).catch(err => console.error(err));
    })
    .catch(err => console.log(err));
});

app.post('/holidays', (req, res) => {
  MongoClient.connect(mConnectionString, { useUnifiedTopology: true })
    .then(client => {
      const db = client.db('todaysholiday');
      const holidaysCollection = db.collection('holidays');
      if (req.body.name && req.body.month && req.body.day) {
        let holiday = {
          name: req.body.name,
          month: parseInt(req.body.month),
          day: parseInt(req.body.day)
        }
        holidaysCollection.insertOne(holiday);
        res.send('Added to DB');
      } else {
        res.send('Not added to DB - missing parameters');
      }
    })
    .catch(err => console.log(err));
});

app.put('/holidays', (req, res) => {
  MongoClient.connect(mConnectionString, { useUnifiedTopology: true })
    .then(client => {
      const db = client.db('todaysholiday');
      const holidaysCollection = db.collection('holidays');

      holidaysCollection.findOneAndUpdate(
        { _id: ObjectId(req.body.id) },
        {
          $set: {
            name: req.body.name,
            month: req.body.month,
            day: req.body.day
          }
        }).then(result => {
          res.send(result);
        }).catch(err => console.error(err));
    })
    .catch(err => console.log(err));
});

app.delete('/holidays', (req, res) => {
  MongoClient.connect(mConnectionString, { useUnifiedTopology: true })
    .then(client => {
      const db = client.db('todaysholiday');
      const holidaysCollection = db.collection('holidays');

      holidaysCollection.deleteOne(
        { _id: ObjectId(req.body.id) })
        .then(result => {
          res.send(`${result.result.n} object(s) deleted`);
        }).catch(err => console.error(err));
    })
    .catch(err => console.log(err));
});

app.listen(PORT, () => {
  console.log('Server started...');
});