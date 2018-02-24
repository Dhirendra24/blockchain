'use strict';
const Block = require('./block');
const crypto = require("./crypto");

module.exports = class BlockChain {
    constructor () {
        this.blockChain = [this.getGenesisBlock()]
    }

    getBlocks() {
        return JSON.stringify(this.blockChain);
    };

    getGenesisBlock() {
        return new Block(
            0,
            "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7",
            "0",
            "My Genesis Block",
            1465154705
        );
    };

    getLatestBlock() {
        return this.blockChain[this.blockChain.length - 1];
    };

    generateNextBlock(blockData) {
        const previousBlock = this.getLatestBlock();
        const nextIndex = previousBlock.index + 1;
        const nextTimestamp = new Date().getTime() / 1000;
        const nextHash = crypto.calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
        const nextBlock = new Block(nextIndex, nextHash, previousBlock.hash, blockData, nextTimestamp);
        nextBlock.copyPreviousState(previousBlock);
        return nextBlock;
    };

    isValidNewBlock(newBlock, previousBlock) {
        return true;
    };

    addBlock(blockData) {
        const newBlock = this.generateNextBlock(blockData);
        // validate
        if (this.isValidNewBlock(newBlock, this.getLatestBlock())) {
            this.blockChain.push(newBlock);
            return newBlock;
        }
        console.log('Verification Failed.', newBlock);
        return undefined;
    };

    addContent(contentData) {
        const newContent = this.generateNextBlock(contentData);
        if (newContent.verifyContent() && this.isValidNewBlock(newContent, this.getLatestBlock())) {
            newContent.updateContentState();
            this.blockChain.push(newContent);
            console.log('block added: ' + JSON.stringify(newContent));
            return newContent;
        }
        console.log('Verification Failed.', JSON.stringify(newContent));
        return undefined;
    }
    addAuthor(authorData) {
        const newAuthor = this.generateNextBlock(authorData);
        if (this.isValidNewBlock(newAuthor, this.getLatestBlock())) {
            newAuthor.updateAuthorState();
            this.blockChain.push(newAuthor);
            console.log('block added: ' + JSON.stringify(newAuthor));
            return newAuthor;
        }
        console.log('Verification Failed.', JSON.stringify(newAuthor));
        return undefined;
    }
};
