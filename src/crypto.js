const CryptoJS = require("crypto-js");

module.exports.calculateHash = function calculateHash(index, previousHash, timestamp, data) {
    return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
};

module.exports.calculateHashForBlock = function calculateHash(block) {
    return calculateHash(block.index, block.previousHash, block.timestamp, block.data);
};
