var CryptoJS = require("crypto-js");

module.exports.calculateHash = function calculateHash(index, previousHash, timestamp, data) {
    return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
};
