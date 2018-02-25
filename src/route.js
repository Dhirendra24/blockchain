const Controller = require("./controller");

module.exports.registerRoutes = function(app) {
    app.get('/health-check/', Controller.healthCheck);
    app.get('/blocks', Controller.getBlocks);
    app.get('/latestBlock', Controller.getLatestBlock);
    app.get('/block/:index', Controller.getBlock);
    app.post('/addAuthor', Controller.addAuthor);
    app.post('/addContent', Controller.addContent);
    app.post('/addContract', Controller.addContract);
    app.post('/addContentContract', Controller.addContentContract);
    app.post('/executeContract', Controller.executeContract);
};
