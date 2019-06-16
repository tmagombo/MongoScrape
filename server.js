var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models/Article");

var PORT = 3000;

var app = express();



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/webscrape";

mongoose.connect(MONGODB_URI);


app.get("/scrape", function(req, res) {
  axios.get("https://www.cnn.com/us").then(function(response) {
    var $ = cheerio.load(response.data);
    $("div h3").each(function(i, element) {
      var result = {};

      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
        console.log(result.title);
        if(result.link.indexOf('index.html')> -1){
          if(result.link.indexOf('/us/')> -1){
                db.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
      };};
    });
    res.send("Scrape Complete");
  });
});

app.get("/articles", function(req, res) {
  db.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
  db.findOne({ _id: req.params.id })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
