'use strict';

const TRANSACTION_TYPE = {
    ADD_CONTRACT: "ADD_CONTRACT",
    ADD_CONTENT: "ADD_CONTENT",
    ADD_AUTHOR: "ADD_AUTHOR",
    EXECUTE_CONTRACT: "EXECUTE_CONTRACT",
};

module.exports = class Block {
    constructor(index, hash, previousHash, data, timestamp, nonce) {
        this.index = index;
        this.hash = hash.toString();
        this.previousHash = previousHash.toString();
        this.data = data;
        this.timestamp = timestamp;
        this.nonce = nonce;
        this.state = {
            content: {

            },
            author: {

            },
            contract: {

            },
            author_contracts: {

            },
            contract_on_content: {

            }
        }
    }

    copyPreviousState (previousBlock) {
        this.state = JSON.parse(JSON.stringify(previousBlock.state));
    }

    verifyContent() {
        if (this.state["author"].hasOwnProperty(this.data["author"])) {
            return true;
        }
        return false
    }

    updateAuthorState() {
        if (!this.state["author"].hasOwnProperty(this.data["author"])) {
            this.state["author"][this.data["author"]] = Object.keys(this.state["author"]).length;
        }
    }

    updateContentState() {
        if (!this.state["content"].hasOwnProperty(this.data["content"])) {
            this.state["content"][this.data["content"]] = Object.keys(this.state["content"]).length;
        }
    }
};
