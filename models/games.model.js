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
        .query(`SELECT reviews.*, COUNT(comment_id)::INT AS comment_count
        FROM reviews LEFT OUTER JOIN comments ON comments.review_id = reviews.review_id 
        WHERE reviews.review_id = $1
        GROUP BY reviews.review_id;`, [review_id])
        .then((data) => {
            if (data.rows.length === 0) {
                return Promise.reject({ msg: "Invalid input", status: 400 })
            }
            return data.rows[0];
        });
};

exports.selectReviews = () => {
    return db
        .query(`SELECT reviews.review_id, reviews.title, reviews.designer, reviews.owner, reviews.review_img_url, reviews.category, reviews.created_at, reviews.votes, COUNT(comment_id)::INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id GROUP BY reviews.review_id ORDER BY created_at DESC;`)
        .then((data) => {
            return data.rows;
        });
};

exports.selectCommentsByReviewId = (review_id) => {
    return db
        .query(`SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;`, [review_id])
        .then((data) => {
            return data.rows;
        });
};

exports.checkReviewIdExist = (review_id) => {
    return db
        .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
        .then((data) => {
            if (data.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "review not found" });
            }
        })
};

exports.insertCommentsByReviewId = (comment, id) => {
    const { username, body } = comment;
    const { review_id } = id
    return db
        .query(`INSERT INTO comments 
        (author, body, review_id) 
        VALUES 
        ($1, $2, $3) 
        RETURNING *;`,
            [username, body, review_id]
        )
        .then(({ rows }) => {
            return (rows[0])
        })
}

exports.updateReviewsByReview_id = (review_id, inc_votes) => {
    return db
        .query(`
        UPDATE reviews
        SET votes = votes + $2
        WHERE review_id = $1 RETURNING *;`,
            [review_id, inc_votes])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ msg: "resource not exist", status: 400 })
            }
            return (rows[0]);
        })
};

exports.deleteComments = (comment_id) => {
    return db
        .query(`DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;`,
            [comment_id]
        )
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "comment_id not found" });
            }
            return (rows[0]);
        });
};

exports.selectUsers = () => {
    return db.query(`SELECT * FROM users`)
        .then(({ rows }) => {
            return rows;
        });
};