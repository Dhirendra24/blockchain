'use strict';
const Block = require('./block');
const crypto = require("./crypto");
const HttpClient = require('./http_client');
const utils = require('./utils');

class BlockChain {
    constructor () {
        this.blockChain = [this.getGenesisBlock()];
        this.httpClient = new HttpClient();
    }

    getBlocks() {
        return JSON.stringify(this.blockChain);
    };

    getGenesisBlock() {
        return new Block(
            0,
            "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7",
            "0",
            "Genesis Block",
            1465154705
        );
    };

    getBlockChainSize() {
        return this.blockChain.length;
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

    isValidBlock(newBlock, previousBlock) {
        if (previousBlock.index + 1 !== newBlock.index) {
            console.log('Invalid Index');
            return false;
        } else if (previousBlock.hash !== newBlock.previousHash) {
            console.log('Invalid PreviousHash');
            return false;
        } else if (crypto.calculateHashForBlock(newBlock) !== newBlock.hash) {
            console.log(typeof (newBlock.hash) + ' ' + typeof crypto.calculateHashForBlock(newBlock));
            console.log('Invalid Hash: ' + crypto.calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
            return false;
        }

        const waitTime = Math.floor(Math.random() * 1000);
        utils.waitSync(waitTime);
        return true;
    };

    isValidChain(blockChainToValidate) {
        if (JSON.stringify(blockChainToValidate[0]) !== JSON.stringify(this.getGenesisBlock())) {
            return false;
        }
        for (let i = 1; i < blockChainToValidate.length; i++) {
            if (!this.isValidBlock(blockChainToValidate[i], blockChainToValidate[i - 1])) {
                return false;
            }
        }
        return true;
    };


    getBlock(index) {
        for (let i = 0; i < this.blockChain.length; i++) {
            const block = this.blockChain[i];
            if (index === block.index) {
                return block;
            }
        }
        return null;
    };

    addAuthor(authorData) {
        const newAuthor = this.generateNextBlock(authorData);
        if (this.isValidBlock(newAuthor, this.getLatestBlock())) {
            newAuthor.updateAuthorState();
            this.blockChain.push(newAuthor);
            console.log('block added: ' + JSON.stringify(newAuthor));
            return newAuthor;
        }
        console.log('Verification Failed.', JSON.stringify(newAuthor));
        return undefined;
    };

    addContent(contentData) {
        const newContent = this.generateNextBlock(contentData);
        if (newContent.verifyContent() && this.isValidBlock(newContent, this.getLatestBlock())) {
            newContent.updateContentState();
            this.blockChain.push(newContent);
            console.log('block added: ' + JSON.stringify(newContent));
            return newContent;
        }
        console.log('Verification Failed.', JSON.stringify(newContent));
        return undefined;
    };

    addContract(contentData) {
        const newContract = this.generateNextBlock(contentData);
        if (this.isValidBlock(newContract, this.getLatestBlock())) {
            newContract.updateContractState();
            this.blockChain.push(newContract);
            console.log('block added: ' + JSON.stringify(newContract));
            return newContract;
        }
        console.log('Verification Failed.', JSON.stringify(newContract));
        return undefined;
    };

    addContentContract(contentData) {
        const newContract = this.generateNextBlock(contentData);
        if (this.isValidBlock(newContract, this.getLatestBlock())) {
            newContract.updateContentContractState();
            this.blockChain.push(newContract);
            console.log('block added: ' + JSON.stringify(newContract));
            return newContract;
        }
        console.log('Verification Failed.', JSON.stringify(newContract));
        return undefined;
    };

    makeTransaction(transactionData) {
        const newTransactions = this.generateNextBlock(transactionData);
        if (this.isValidBlock(newTransactions, this.getLatestBlock())) {
            newTransactions.updateTransactionState();
            this.blockChain.push(newTransactions);
            console.log('block added: ' + JSON.stringify(newTransactions));
            return newTransactions;
        }
        console.log('Verification Failed.', JSON.stringify(newTransactions));
        return undefined;
    };

    executeContract(contractExecutionData) {
        const latestBlock = this.getLatestBlock();
        const contentIndex = latestBlock.getContentIndex(contractExecutionData["content"]);
        const contentBlock = this.getBlock(contentIndex);
        const contentData = contentBlock.data;
        const action = contractExecutionData["action"];
        const contentContract = contentData["content"]["actions"][action]["contract"];
        const contentContractParams = contentData["content"]["actions"][action]["params"];
        const contentEntities = contractExecutionData["entities"];
        const executionPayload = {
            contract: contentContract,
            params: contentContractParams,
            entities: contentEntities
        };
        return this.httpClient.post(executionPayload);
    };
}

module.exports = new BlockChain();