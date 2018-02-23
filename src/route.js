import {getBlocks, mine} from "./controller";

var healthCheck = function (req, resp) {
    resp.send("Success");
};

module.exports.registerRoutes = function(app) {
    app.get('/health-check/', healthCheck);
    app.get('/blocks', getBlocks);
    app.post('/mineBlock', mine);
};
