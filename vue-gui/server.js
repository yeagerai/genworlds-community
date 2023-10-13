const express = require('express');
const path = require('path');
const app = express();
const port = 80;

app.use(express.static('nano-vue'));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening at http://0.0.0.0:${port}`);
});
