'use strict';
const blockChain = require("./block-chain");
const main = require('./main');

module.exports.healthCheck = function (req, resp) {
    resp.send({message: "Success"});
};

module.exports.getBlocks = function (req, res) {
    res.send(blockChain.getBlocks());
};

module.exports.getLatestBlock = function (req, res) {
    res.send(blockChain.getLatestBlock());
};

module.exports.getBlock = function (req, res) {
    res.send(blockChain.getBlock(Number(req.params.index)));
};

/**
 * Format of Author
 * {
 *  "username": "<username>",
 *  "address": "<author address>",
 *  "verification_signature": <>
 * }
 */
module.exports.addAuthor = function addAuthor(req, res) {
    const newContent = blockChain.addAuthor(req.body);
    if (newContent){
        main.broadcast(main.responseLatestMsg());
    }
    res.status(200).send();
};

/**
 * Format of Content
 * {
 *  "content": {
 *      "actions": {
 *          "buy": {
 *              "contract": "<contract address>",
 *              "params" {<kwargs of contract>}
 *          },
 *          "rent": {
 *              "contract": "<contract address>",
 *              "params" {<kwargs of contract>}
 *          },
 *          "meta": {}
 *      }
 *  },
 *  "address: "<content address>",
 *  "entities": {
 *      "<key>": {
 *          "address": [list of addresses],
 *          "required": boolean
 *      },
 *      ...
 *  }
 * }
 */
module.exports.addContent = function addContent(req, res) {
    const newContent = blockChain.addContent(req.body);
    if (newContent){
        main.broadcast(main.responseLatestMsg());
    }
    res.status(200).send();
};

/**
 * Format of Contract
 * {
 *  "contract": {},
 *  "address": "<contract address>",
 * }
 */
module.exports.addContract = function addContract(req, res) {
    const newContract = blockChain.addContract(req.body);
    if (newContract){
        main.broadcast(main.responseLatestMsg());
    }
    res.status(200).send();
};

/**
 * Format of Content Contract
 * {
 *  "address": "<content address>"
 *  "entities": {
 *      "<key>": {
 *          "address": [list of addresses],
 *          "required": boolean
 *      },
 *      ...
 *  },
 *  "content": {
 *      "actions": {
 *          "buy": {
 *              "contract": "<contract address>",
 *              "params" {<kwargs of contract>}
 *          },
 *          "rent": {
 *              "contract": "<contract address>",
 *              "params" {<kwargs of contract>}
 *          },
 *          "meta": {}
 *      }
 *  }
 * }
 */
module.exports.addContentContract = function addContentContract(req, res) {
    const newContentContract = blockChain.addContentContract(req.body);
    if (newContentContract){
        main.broadcast(main.responseLatestMsg());
    }
    res.status(200).send();
};

/**
 * Transactions Types:
 * - User to
 * {
 *      "req_account": <>
 *      "txns": [
 *          {
 *              "to": <user address>, (buyer address for BUY) - depends upon type
 *              "from": <contract address> or <user address>,
 *              "value": <content_address> or <value>,
 *              "action": <action>,
 *              "type": <user-credit/user-content>
 *          }
 *       ]
 * }
 */
module.exports.makeTransaction = function makeTransaction(req, res) {
    const newTransaction = blockChain.makeTransaction(req.body);
    if (newTransaction){
        main.broadcast(main.responseLatestMsg());
    }
    res.status(200).send();
};

/**
 * Format of Execute Contract Data
 * {
 *      "content": <content address>,
 *      "action": <action buy/rent>,
 *      "entities": [list of users],
 *      "payload": {}
 * }
 * Execution Request Data
 * {
 *      "contract": "<contract address>",
 *      "params": {},
 *      "entities": []
 * }
 */
module.exports.executeContract = function executeContract(req, res) {
    blockChain.executeContract(req.body).then(function (transactionData) {
        const newTransaction = blockChain.makeTransaction(transactionData);
        if (newTransaction){
            main.broadcast(main.responseLatestMsg());
        }
        res.status(200).send();
    }).catch(function (err) {
        console.log("error occurred while executing contract.");
        res.status(200).send();
    });
};
