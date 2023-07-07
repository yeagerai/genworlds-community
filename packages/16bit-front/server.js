const express = require('express');

const app = express();
const port = 8081;

app.use(express.static('16bit-front'));

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening at http://0.0.0.0:${port}`);
});
