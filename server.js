const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const session = require('express-session');


const g_routes = require("./routes/get_routes.js");
const p_routes = require("./routes/post_routes.js");
const app = express();
const PORT = 3000;

app.use(session({
    secret: 'someCrazySecret@123',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 600000
    }
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

app.use("/data/", p_routes);//POST Routes
app.use("/", g_routes);//GET Routes

app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
});