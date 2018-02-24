'use strict';
const BlockChain = require("./block-chain");

const main = require('./main');
const blockChain = new BlockChain();

module.exports.healthCheck = function (req, resp) {
    console.log("Success");
    resp.send({message: "Success"});
};

module.exports.getBlocks = function (req, res) {
    res.send(blockChain.getBlocks());
};

module.exports.mine = function mine(req, res) {
    const newBlock = blockChain.addBlock(req.body);
    main.broadcast(main.responseLatestMsg());
    console.log('block added: ' + JSON.stringify(newBlock));
    res.send(newBlock);
};

module.exports.addAuthor = function addContent(req, res) {
    const newContent = blockChain.addAuthor(req.body);
    if (newContent){
        main.broadcast(main.responseLatestMsg());
    }
    res.send(newContent);
};

module.exports.addContent = function addContent(req, res) {
    const newContent = blockChain.addContent(req.body);
    if (newContent){
        main.broadcast(main.responseLatestMsg());
    }
    res.send(newContent);
};
