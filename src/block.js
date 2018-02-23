'use strict';
import {calculateHash} from "./crypto";

class Block {
    constructor(index, previousHash, timestamp, data, hash) {
        this.index = index;
        this.hash = hash.toString();
        this.previousHash = previousHash.toString();
        this.data = data;
        this.timestamp = timestamp;
    }

}

module.exports.BlockChain = class BlockChain {
    blockChain;
    constructor () {
        this.blockChain = [this.getGenesisBlock()]
    }

    getBlocks = function () {
        return JSON.stringify(this.blockChain);
    };

    getGenesisBlock = function getGenesisBlock() {
        return new Block(
            0,
            "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7",
            "0",
            "My Genesis Block",
            1465154705
        );
    };

    getLatestBlock = function () {
        return this.blockChain[this.blockChain - 1];
    };

    generateNextBlock = function(blockData) {
        var previousBlock = this.getLatestBlock();
        var nextIndex = previousBlock.index + 1;
        var nextTimestamp = new Date().getTime() / 1000;
        var nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
        return new Block(nextIndex, nextHash, previousBlock.hash, blockData, nextTimestamp);
    };

    isValidNewBlock = function(newBlock, previousBlock) {
        return true;
    };

    addBlock = function(blockData) {
        const newBlock = this.generateNextBlock(blockData);
        // validate
        if (this.isValidNewBlock(newBlock, this.getLatestBlock())) {
            this.blockChain.push(newBlock);
        }
    };
}