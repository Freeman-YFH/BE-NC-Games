const db = require("./db/connection");
const express = require("express");
const { getCategories, getReviewById } = require("./controllers/games.controller");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.use('*', (req, res, next) => {
    res.status(404).send({ msg: "Invalid path" })
});

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "Bad request" })
    } else if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    }

});

module.exports = app;
