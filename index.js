const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.json())
// routes
require('./startup/routes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`running at port ${PORT}`));
