'use strict';
const requestPromise = require("request-promise-native");
const config = require('./config');

module.exports = class HttpClient {

    constructor() {
        this.pooledRequest = requestPromise.defaults({
            pool: {
                maxSockets: 5,
            },
        });
    }

    post(requestData){
        const requestOptions = {
            baseUrl: config.contractExecutorHost,
            url: config.contractExecutionUrl,
            method: "POST",
            json: true,
            body: requestData
        };
        return this.pooledRequest(requestOptions);
    }
};
