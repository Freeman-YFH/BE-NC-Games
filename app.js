const db = require("./db/connection");
const express = require("express");
const { getCategories, getReviewById, getReviews, getCommentsByReviewId, postCommentsByReviewId } = require("./controllers/games.controller");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.post("/api/reviews/:review_id/comments", postCommentsByReviewId);

app.use('*', (req, res, next) => {
    res.status(404).send({ msg: "Invalid path" })
});

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "Bad request" })
    } else if (err.code === "23503") {
        res.status(404).send({ msg: "resource not exist" })
    } else if (err.code === "23502") {
        res.status(400).send({ msg: "Invalid input" })
    }
    else if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    }
});

module.exports = app;
