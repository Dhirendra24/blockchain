'use strict';

module.exports = class Block {
    constructor(index, hash, previousHash, data, timestamp, nonce) {
        this.index = index;
        this.hash = hash.toString();
        this.previousHash = previousHash.toString();
        this.data = data;
        this.timestamp = timestamp;
        this.nonce = nonce;
        this.state = {
            content: {},
            author: {},
            contract: {},
            content_contract: {},
            content_to_buyer: {},
            user_credit: {}
        }
    }

    getContentIndex(content) {
        return this.state["content"][content];
    }

    copyPreviousState(previousBlock) {
        this.state = JSON.parse(JSON.stringify(previousBlock.state));
    }

    verifyContent() {
        const users = this.data['entities'];
        for (let i = 0; i < users.length; i++) {
            if (!this.state["author"].hasOwnProperty(users[i])) {
                return false;
            }
        }
        return true;
    }

    updateAuthorState() {
        // if (!this.state["author"].hasOwnProperty(this.data["address"])) {
        this.state["author"][this.data["address"]] = this.index;
        // }
    }

    updateContentState() {
        // if (!this.state["content"].hasOwnProperty(this.data["address"])) {
            this.state["content"][this.data["address"]] = this.index;
            this.updateContentContractState();
        // }
    };

    updateContractState() {
        // if (!this.state["contract"].hasOwnProperty(this.data["address"])) {
        this.state["contract"][this.data["address"]] = this.index;
        // }
    }

    updateContentContractState() {
        const previousContent = this.state["content"][this.data["address"]];
        this.state["content"][this.data["address"]] = this.index;
        const actions = this.data["content"]["actions"];
        if (this.state["content_contract"].hasOwnProperty(previousContent)) {
            this.state["content_contract"][this.index] = this.state["content_contract"][previousContent];
            delete this.state["content_contract"][previousContent]
        } else {
            this.state["content_contract"][this.index] = {}
        }
        const actionList = Object.keys(actions);
        for (let i = 0; i < actionList.length; i++) {
            const type = actionList[i];
            const contract = actions[type]["contract"];
            const params = actions[type]["params"];
            this.state["content_contract"][this.index][type] = {
                contract: this.state["contract"][contract]
            }
        }
    }

    updateTransactionState() {
        const transactions = this.data["txns"];
        for (let i = 0; i < transactions.length; i++) {
            const transaction = transactions[i];
            const transactionType = transaction["tx_type"];

            const to = transaction["to"];
            const from = transaction["from"];
            const value = transaction["value"];
            const action = transaction["action"];

            if (transactionType === "user-content") {
                const state = transaction["state"];
                const contract = this.state["contract"][from];
                const content = this.state["content"][value];
                if (!this.state["content_to_buyer"].hasOwnProperty(content)) {
                    this.state["content_to_buyer"][content] = {
                        entities: []
                    };
                }
                this.state["content_to_buyer"][content]["entities"].push({
                    "user": to,
                    "action": action,
                    "state": state
                })
            } else if (transactionType === "user-credit") {
                if (!this.state["user_credit"].hasOwnProperty(from)) {
                    this.state["user_credit"][from] = 0;
                }
                if (!this.state["user_credit"].hasOwnProperty(to)) {
                    this.state["user_credit"][to] = 0;
                }
                this.state["user_credit"][from] -= value;
                this.state["user_credit"][to] += value;
            }
        }
    }
};
