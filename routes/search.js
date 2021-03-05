var express = require("express");
var router = express.Router();

const movies = require("../data/movies");
const people = require("../data/people");

const queryRequired = (req, res, next) => {
  const searchTerm = req.query.search;
  if (!searchTerm) {
    res.json({
      msg: "Search query cannot be empty",
    });
  } else {
    next();
  }
};

/* this middleware uses all routes in these router - the searchRouter */
router.use(queryRequired);

/* GET search page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/movie", (req, res, next) => {
  const searchTerm = req.query.search;
  // if user doesn't provide the search query
  /* instead of using this conditional for all paths, since search query is required for all routes, we can use a middleware*/
  const results = movies.filter((movie) => {
    return (
      movie.overview.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  res.json({
    results,
    length: results.length,
  });
});

/* instead of using the conditional or a middleware that will be written on each route, we can just use router.use() middleware */
/* router.get('/person', queryRequired, (req, res, next) => {}) */

router.get("/person", (req, res, next) => {
  const searchTerm = req.query.search;
  const results = people.filter((person) => {
    return person.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  res.json({
    results,
    length: results.length,
  });
});

module.exports = router;
