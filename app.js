const db = require("./db/connection");
const express = require("express");
const { getCategories } = require("./controllers/games.controller");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.use('*', (req, res, next) => {
    next(err)
})

app.use((err, req, res, next) => {
    res.status(404).send({ msg: "invalid path" })
})

module.exports = app;
