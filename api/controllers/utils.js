module.exports.jsonResponse = function (response, status, content) {
    response.status(status);
    response.json(content);
};

module.exports.jsonResponseError = function (res, error) {
    this.jsonResponse(res, 500, {
        ret: -1,
        msg: error
    })
};