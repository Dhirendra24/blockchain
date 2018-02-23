import {BlockChain} from "./block";

const blockChain = new BlockChain();

module.exports.getBlocks = function (req, res) {
    res.send(blockChain.getBlocks());
};

module.exports.mine = function mine(req, res) {
    blockChain.addBlock(req.body.data);
    broadcast(responseLatestMsg());
    console.log('block added: ' + JSON.stringify(newBlock));
    res.send();
};
