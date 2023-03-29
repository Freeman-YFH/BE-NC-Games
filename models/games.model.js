const db = require("../db/connection");
const format = require("pg-format");

exports.selectCategories = () => {
    return db
        .query(`SELECT * FROM categories`)
        .then((data) => {
            return data.rows;
        });
};

exports.selectReviewById = (review_id) => {
    return db
        .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
        .then((data) => {
            if (data.rows.length === 0) {
                return Promise.reject({ msg: "Invalid input", status: 400 })
            }
            return data.rows[0]
        });
};

exports.selectReviews = () => {
    return db
        .query(`SELECT reviews.*, COUNT(comment_id) AS comment_count FROM reviews LEFT JOIN comments on comments.review_id = reviews.review_id GROUP BY reviews.review_id ORDER BY comment_count DESC;`)
        .then((data) => {
            return data.rows;
        });
};

exports.selectCommentsByReviewId = (review_id) => {
    return db
        .query(`SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;`, [review_id])
        .then((data) => {
            if (data.rows.length === 0) {
                return Promise.reject({ msg: "Bad request", status: 400 })
            }
            return data.rows;
        });
};

exports.insertCommentsByReviewId = (comment) => {
    const { username, body } = comment;
    return db.query(
        `INSERT INTO comments
        (author, body)
        VALUES
        ($1, $2)
        RETURNING *;`,
        [username, body]
    )
        .then((data) => {
            console.log(data)
        })
}