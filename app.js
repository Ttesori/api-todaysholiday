const cors = require('cors');
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to DB
let holidaysCollection;
MongoClient.connect(`mongodb+srv://${process.env.MONGO_DB}:${process.env.MONGO_PASS}@cluster0.0j8hc.mongodb.net/todaysholiday?retryWrites=true&w=majority`, { useUnifiedTopology: true })
  .then(client => {
    const db = client.db('todaysholiday');
    holidaysCollection = db.collection('holidays');
  })
  .catch(err => err);


// GET Routes
app.get('/', (req, res) => {
  res.send('API access available at /holidays');
});

app.get('/holidays', async (req, res) => {
  try {
    let results = await holidaysCollection.find().toArray();
    res.json(results);
  } catch (err) {
    console.log(err);
  }
});

app.get('/holidays/:month', async (req, res) => {
  try {
    let results = await holidaysCollection.find({ month: req.params.month }).toArray();
    res.json(results);
  } catch (err) {
    console.log(err);
  }
});

app.get('/holidays/:month/:day', async (req, res) => {
  try {
    let results = await holidaysCollection.find({ month: req.params.month, day: req.params.day }).toArray();
    res.json(results);
  } catch (err) {
    console.log(err);
  }
});

// POST route
app.post('/holidays', async (req, res) => {
  try {
    if (req.body.name && req.body.month && req.body.day) {
      let holiday = {
        name: req.body.name,
        month: parseInt(req.body.month),
        day: parseInt(req.body.day)
      }
      let resp = await holidaysCollection.insertOne(holiday);
      res.json(resp);
    } else {
      res.send('Not added to DB - missing parameters');
    }
  } catch (err) {
    console.log(err)
  }
});

// PUT route
app.put('/holidays', async (req, res) => {
  try {
    let resp = await holidaysCollection.findOneAndUpdate(
      { _id: ObjectId(req.body.id) },
      {
        $set: {
          name: req.body.name,
          month: req.body.month,
          day: req.body.day
        }
      });
    res.status(200).json(resp.value);
  }
  catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

// DELETE route
app.delete('/holidays', async (req, res) => {
  try {
    let result = await holidaysCollection.deleteOne({ _id: ObjectId(req.body.id) });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// Start Server
app.listen(PORT, () => {
  console.log('Server started...');
});