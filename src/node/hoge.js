const express = require('express');
const app = express();
const port = 5637;

app.get('/', (req, res) => {
  res.send('Hello, Mizuki!');
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});