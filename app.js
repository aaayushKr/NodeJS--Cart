const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const errorController = require("./controllers/error");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({extended: false})); //middleware for parsing
app.use(express.static(path.join(__dirname, "public"))); //making the public folder public for styles, takes any request to public folder

app.use("/admin", adminRoutes.routes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);
