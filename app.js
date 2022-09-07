const path = require('path');

const express = require("express");
const bodyParser = require("body-parser");

const feedRoutes = require("./routes/feed");
const mongoose = require("mongoose");

const ConfiLinks = require("./util/database");

const app = express();

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

// this is to avaid the error of CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({message:message});
});

mongoose
  .connect(ConfiLinks.MongooseUri)
  .then((result) => {
    console.log("Connected!");
    app.listen(8080);
  })
  .catch((err) => console.log(err));

