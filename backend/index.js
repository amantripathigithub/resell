const express = require('express');
const app = express();

const port = 3000; // You can change the port to any available port you prefer

// Define a route that responds with "Hello, World!" for the root path
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
