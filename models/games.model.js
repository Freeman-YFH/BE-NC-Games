const db = require("../db/connection");

exports.selectCategories = () => {
    return db
        .query(`SELECT * FROM categories`)
        .then((data) => {
            return data.rows;
        })
}