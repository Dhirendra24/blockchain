'use strict';
const Block = require('./block');
const crypto = require("./crypto");
const HttpClient = require('./http_client');

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

    getBlock(index) {
        for (let i = 0; i < this.blockChain.length; i++) {
            const block = this.blockChain[i];
            if (index === block.index) {
                return block;
            }
        }
        return null;
    }

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
    };

    addContract(contentData) {
        const newContract = this.generateNextBlock(contentData);
        if (this.isValidNewBlock(newContract, this.getLatestBlock())) {
            newContract.updateContractState();
            this.blockChain.push(newContract);
            console.log('block added: ' + JSON.stringify(newContract));
            return newContract;
        }
        console.log('Verification Failed.', JSON.stringify(newContract));
        return undefined;
    }

    addContentContract(contentData) {
        const newContract = this.generateNextBlock(contentData);
        if (this.isValidNewBlock(newContract, this.getLatestBlock())) {
            newContract.updateContentContractState();
            this.blockChain.push(newContract);
            console.log('block added: ' + JSON.stringify(newContract));
            return newContract;
        }
        console.log('Verification Failed.', JSON.stringify(newContract));
        return undefined;
    }

    makeTransaction(transactionData) {
        const newTransactions = this.generateNextBlock(transactionData);
        if (this.isValidNewBlock(newTransactions, this.getLatestBlock())) {
            newTransactions.updateTransactionState();
            this.blockChain.push(newTransactions);
            console.log('block added: ' + JSON.stringify(newTransactions));
            return newTransactions;
        }
        console.log('Verification Failed.', JSON.stringify(newTransactions));
        return undefined;
    }

    executeContract(contractExecutionData) {
        const latestBlock = this.getLatestBlock();
        const contentIndex = latestBlock.getContentIndex(contractExecutionData["content"]);
        const contentBlock = this.getBlock(contentIndex);
        const contentData = contentBlock.data;
        const action = contractExecutionData["action"];
        const contentContract = contentData["content"]["actions"][action]["contract"];
        const contentContractParams = contentData["content"]["actions"][action]["params"];
        const contentEntities = contentData["entities"];
        const contentAddress = contentData["address"];
        const executionPayload = {
            contract: contentContract,
            params: contentContractParams,
            entities: contentEntities.concat(contentAddress)
        };
        return this.httpClient.post(executionPayload);
    }
};

module.exports = new BlockChain();