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
            content_contract: {

            }
        }
    }

    copyPreviousState (previousBlock) {
        this.state = JSON.parse(JSON.stringify(previousBlock.state));
    }

    verifyContent() {
        return this.state["author"].hasOwnProperty(this.data["author"]);
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

    updateContractState() {
        if (!this.state["contract"].hasOwnProperty(this.data["contract"])) {
            this.state["contract"][this.data["contract"]] = Object.keys(this.state["contract"]).length;
        }
    }

    updateContentContractState() {
        const content = this.state["content"][this.data["content"]];
        const actions = this.data["action"];
        const actionList = Object.keys(actions);
        for (let i = 0; i < actionList.length; i++) {
            const type = actionList[i];
            const contract = actions[type]["contract"];
            const params = actions[type]["params"];
            this.state["content_contract"][content] = {
                contract: this.state["contract"][contract],
                type: type
            }
        }
        Object.keys(actions).forEach(function (type) {

        });
    }
};
