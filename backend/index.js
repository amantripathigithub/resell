const express = require('express');
const app = express();

const port = 3000; // You can change the port to any available port you prefer
app.set('view engine', 'ejs');
const path = require("path");

//app.use(express.static('..//frontend'));
// Define a route that responds with "Hello, World!" for the root path
app.get('/', (req, res) => {
    app.use(express.static("../frontend"));
    res.render(path.join(__dirname, "../frontend", "/signup.ejs"));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
