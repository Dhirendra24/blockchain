'use strict';
let WebSocket = require("ws");

const config = require('./config');
const blockChain = require("./block-chain");
const httpServer = require('./http-server');
const utils = require('./utils');

let p2p_port = process.env.P2P_PORT || config.p2pPort;
let initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : [];

let sockets = [];
let MessageType = {
    QUERY_LATEST: 0,
    QUERY_ALL: 1,
    RESPONSE_BLOCKCHAIN: 2
};

let initP2PServer = () => {
    let server = new WebSocket.Server({port: p2p_port});
    server.on('connection', ws => initConnection(ws));
    console.log('listening Web Socket port on: ' + p2p_port);

};

let initConnection = (ws) => {
    sockets.push(ws);
    initMessageHandler(ws);
    initErrorHandler(ws);
    write(ws, queryChainLengthMsg());
};

let initMessageHandler = (ws) => {
    ws.on('message', (data) => {
        let message = JSON.parse(data);
        console.log('Received message' + JSON.stringify(message));
        switch (message.type) {
            case MessageType.QUERY_LATEST:
                write(ws, responseLatestMsg());
                break;
            case MessageType.QUERY_ALL:
                write(ws, responseChainMsg());
                break;
            case MessageType.RESPONSE_BLOCKCHAIN:
                handleBlockChainResponse(message);
                break;
        }
    });
};

let initErrorHandler = (ws) => {
    let closeConnection = (ws) => {
        console.log('connection failed to peer: ' + ws.url);
        sockets.splice(sockets.indexOf(ws), 1);
    };
    ws.on('close', () => closeConnection(ws));
    ws.on('error', () => closeConnection(ws));
};

let connectToPeers = (newPeers) => {
    newPeers.forEach((peer) => {
        let ws = new WebSocket(peer);
        ws.on('open', () => initConnection(ws));
        ws.on('error', (err) => {
            console.log('connection failed', err);
        });
    });
};

let handleBlockChainResponse = (message) => {
    let receivedBlocks = JSON.parse(message.data).sort((b1, b2) => (b1.index - b2.index));
    let latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];
    let latestBlockHeld = blockChain.getLatestBlock();
    if (latestBlockReceived.index > latestBlockHeld.index) {
        console.log('blockchain possibly behind. We got: ' + latestBlockHeld.index + ' Peer got: ' + latestBlockReceived.index);
        if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
            console.log("We can append the received block to our chain");
            blockChain.blockChain.push(latestBlockReceived);
            broadcast(responseLatestMsg());
        } else if (receivedBlocks.length === 1) {
            console.log("We have to query the chain from our peer");
            broadcast(queryAllMsg());
        } else {
            console.log("Received blockchain is longer than current blockchain");
            replaceChain(receivedBlocks);
        }
    } else {
        console.log('received blockchain is not longer than current blockchain. Do nothing');
    }
};

let replaceChain = (newBlocks) => {
    if (newBlocks.length > this.blockChain.getBlockChainSize() && blockChain.isValidChain(newBlocks)) {
        console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
        blockChain.blockChain = newBlocks;
        broadcast(responseLatestMsg());
    } else {
        console.log('Received blockchain invalid');
    }
};

let queryChainLengthMsg = () => ({'type': MessageType.QUERY_LATEST});
let queryAllMsg = () => ({'type': MessageType.QUERY_ALL});
let responseChainMsg = () =>({
    'type': MessageType.RESPONSE_BLOCKCHAIN, 'data': blockChain.getBlocks()
});
let responseLatestMsg = module.exports.responseLatestMsg = () => ({
    'type': MessageType.RESPONSE_BLOCKCHAIN,
    'data': JSON.stringify([blockChain.getLatestBlock()])
});

let write = (ws, message) => ws.send(JSON.stringify(message));
let broadcast  = module.exports.broadcast = (message) => sockets.forEach(socket => write(socket, message));

httpServer();
initP2PServer();
utils.waitSync(1000);
connectToPeers(initialPeers);
