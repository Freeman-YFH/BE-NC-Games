const db = require("../db/connection");
const { selectCategories } = require("../models/games.model");

exports.getCategories = (req, res, next) => {
    selectCategories()
        .then((result) => {
            res.status(200).send(result)
        })
        .catch(next);
}