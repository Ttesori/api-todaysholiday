const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello there');
});

app.listen(8000, () => {
  console.log('Server started...');
});