var healthCheck = function (req, resp) {
    resp.send("Success");
};

module.exports.registerRoutes = function(app) {
    app.get('/health-check/', healthCheck);
};
