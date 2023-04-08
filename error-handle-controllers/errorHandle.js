exports.handleCustomError = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    } else next(err);
};

exports.handlePsqlError = (err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "Bad request" })
    } else if (err.code === "23503") {
        res.status(404).send({ msg: "review not found" })
    } else if (err.code === "23502") {
        res.status(404).send({ msg: "resource not exist" })
    } else next(err);
};

exports.handleServerError = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: "Internal Server Error" })
}