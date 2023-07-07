const express = require('express');

const app = express();
const port = 80;

app.use(express.static('nano-vue'));

// Start the server
app.listen(port, '0.0.0.0',  () => {
  console.log(`Server listening at http://0.0.0.0:${port}`);
});
