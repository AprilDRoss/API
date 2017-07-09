const express = require('express');
const bodyParser = require("body-parser");
const mustacheExpress = require('mustache-express');

const app = express();
const routes = require('./routes/routes.js')

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(routes);



app.listen(8080, function (){
  console.log("App is running on part 8080 successfully.")
});
