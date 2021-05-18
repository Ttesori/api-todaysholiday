const cors = require('cors');
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 8000;

// Settings and Middleware
app.set('view engine', 'ejs');
app.use(cors());
app.use(express.static('public'))
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

app.get('/admin/:month', async (req, res) => {
  try {
    let results = await holidaysCollection.find({ month: req.params.month }).toArray();
    let month = parseInt(req.params.month);
    res.render('index.ejs', {
      data: {
        results: results,
        months: ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        currMonth: month,
        prevMonth: month === 1 ? 12 : month - 1,
        nextMonth: month === 12 ? 1 : month + 1
      }
    });
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
        // you were here -- just updated the route to include whichever vars are passed in the update object. So youll needt o update postman for prod once you push the update. On view, you were working on deleting a holiday and being able to update name of holiday from UI
        $set: req.body.update
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