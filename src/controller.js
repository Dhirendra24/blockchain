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

/**
 * Format of Author
 * {
 *  "author": "<author address>"
 * }
 */
module.exports.addAuthor = function addContent(req, res) {
    const newContent = blockChain.addAuthor(req.body);
    if (newContent){
        main.broadcast(main.responseLatestMsg());
    }
    res.send(newContent);
};

/**
 * Format of Content
 * {
 *  "content": "<content address>",
 *  "author": "<author address>"
 * }
 */
module.exports.addContent = function addContent(req, res) {
    const newContent = blockChain.addContent(req.body);
    if (newContent){
        main.broadcast(main.responseLatestMsg());
    }
    res.send(newContent);
};

/**
 * Format of Contract
 * {
 *  "contract": "<contract address>",
 *  "requiredFields": [<list of fields>],
 *  ...
 * }
 */
module.exports.addContract = function addContract(req, res) {
    const newContract = blockChain.addContract(req.body);
    if (newContract){
        main.broadcast(main.responseLatestMsg());
    }
    res.send(newContract);
};

/**
 * Format of Content Contract
 * {
 *  "content": "<content address>"
 *  "entities": {
 *      "author": "<author address>"
 *  },
 *  "actions": {
 *      "buy": {
 *          "contract": "<contract address>",
 *          "params" {<kwargs of contract>}
 *      },
 *      "rent": {
 *          "contract": "<contract address>",
 *          "params" {<kwargs of contract>}
 *      },
 *  },
 *  "meta": {}
 * }
 */
module.exports.addContentContract = function addContentContract(req, res) {
    const newContentContract = blockChain.addContentContract(req.body);
    if (newContentContract){
        main.broadcast(main.responseLatestMsg());
    }
    res.send(newContentContract);
};
