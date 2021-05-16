const express = require('express');
const app = express();
const holidays = require('./components/holidays');
const PORT = process.env.PORT || 8000;

app.get('/api', (req, res) => {
  res.json(holidays);
});

app.get('/api/:month', (req, res) => {
  const month = req.params.month;
  const days = holidays[month];
  if (days) {
    res.status(200).json(days);
  } else {
    res.status(404).send({
      error: 'No days found.'
    });
  }
});

app.get('/api/:month/:day', (req, res) => {
  const month = req.params.month;
  const day = req.params.day;
  const days = holidays[month][day];
  if (days) {
    res.status(200).json(days);
  } else {
    res.status(404).send({
      error: 'No days found.'
    });
  }
});

app.listen({ PORT }, () => {
  console.log('Server started...');
});