const Controller = require("./controller");

module.exports.registerRoutes = function(app) {
    app.get('/health-check/', Controller.healthCheck);
    app.get('/blocks', Controller.getBlocks);
    app.post('/addAuthor', Controller.addAuthor),
    app.post('/addContent', Controller.addContent),
    app.post('/addContract', Controller.addContract),
    app.post('/addContentContract', Controller.addContentContract),
    app.post('/executeContract', Controller.executeContract),
    app.post('/mineBlock', Controller.mine);
};
