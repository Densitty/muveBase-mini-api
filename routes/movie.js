const express = require("express");
const router = express.Router();
const movieDetails = require("../data/movieDetails");

// the content-type in the header can be changed using a middleware (BEST practice) or pacing the condition inside the routes
const requireJSONContentType = (req, res, next) => {
  if (!req.is("application/json")) {
    res.json({
      msg: "Content-Type must be 'application/json'",
    });
  } else {
    next();
  }
};

// optional => query.param can be used to run a callback function anytime we hit the route with a query id
router.param("/:id", (req, res, next) => {
  // We can pass some instruction to the db instead of letting the OS carry it out, like page analytics
  console.log("Someone hit a route that used the movie ID wildcard ");
  next();
});

/* we need to get the top_rated route first because of the req.param.id required for the other route, which won't match of query here if put first */
router.get("/top_rated", (req, res, next) => {
  let page = req.query.page;
  if (!page) {
    page = 1;
  }
  let results = movieDetails
    .filter((movie) => {
      return movie.vote_average >= 7;
    })
    .sort((a, b) => {
      return b.vote_average - a.vote_average;
    });

  // let results = movieDetails.sort((a, b) => {
  //   return a.vote_average - b.vote_average;
  // });

  // 20 result data per page
  const startIndex = (page - 1) * 20;
  results = results.slice(startIndex, startIndex + 19);

  res.json({
    results: results,
    length: results.length,
  });
});

/* GET movie page. */
router.get("/:id", (req, res, next) => {
  // find the particular movie id based on the id of the req params
  const movieID = req.params.id;

  const result = movieDetails.find((movie) => {
    /*console.log(movie.id);
    console.log(movieID);*/
    return movie.id === parseInt(movieID);
  });
  // if there is no movie with such id provided
  if (!result) {
    res.json({
      msg: "Movie not found",
    });
  } else {
    res.json({
      result,
      status_code: 200,
    });
  }
});

router.post("/:id/rating", requireJSONContentType, (req, res, next) => {
  const ID = req.params.id;
  // check if the content-type is application/json
  const userRating = req.body.value;
  if (userRating < 0.5 || userRating > 10) {
    res.json("Rating can't be below 0.5 and above 10.");
  } else {
    res.json({
      msg: "Thank you for submitting your rating.",
      status_code: 200,
    });
  }
});

router.delete("/:id/rating", requireJSONContentType, (req, res, next) => {
  res.json({
    msg: "Rating deleted",
    status_code: 200,
  });
});

module.exports = router;
