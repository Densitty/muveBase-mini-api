var express = require("express");
var router = express.Router();
// pull up the movies data
const movies = require("../data/movies");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/most_popular", (req, res, next) => {
  let page = req.query.page;
  if (page === undefined) {
    page = 1;
  }

  // if the api_key is not supplied
  // if (req.query.api_key !== "123456789") {
  //   res.json("Invalid API Key");
  // } else {...}
  let results = movies.filter((movie) => movie.most_popular);
  console.log(movies.length);
  /** to get the page of the data fetched */
  const startIndex = (page - 1) * 20;
  results = results.slice(startIndex, startIndex + 19);
  res.json({
    results,
    length: results.length,
    page: req.query.page,
  });
});

module.exports = router;
