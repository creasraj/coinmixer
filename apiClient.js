#!/usr/bin/env node
"use strict";
const axios = require("axios");
const config = require('./config');
const logger = require('winston');

/* Urls */
const API_BASE_URL = config.baseUrl;
const API_ADDRESS_PATH = 'addresses/';
const API_TRANSACTIONS_PATH = 'transactions';


const getTransactions = async () => {
    try {
        const response = await axios.request({
            url: API_TRANSACTIONS_PATH,
            method: 'get',
            baseURL: API_BASE_URL,
        });
        logger.debug({
            message: 'Received transactions.',
        });
        return response.data;
    } catch (error) {
        // possible errors
        if (error.response) {
            logger.error({
                errorMsg: 'Error on calling transactions api' + error.response.data + error.response.status,
            });
        }
    }
}

const postTransaction = async (fromAddress, toAddress, amount) => {
    try {
        await axios.request({
            url: API_TRANSACTIONS_PATH,
            method: 'post',
            baseURL: API_BASE_URL,
            params: {
                fromAddress: fromAddress,
                toAddress: toAddress,
                amount: amount,
            },
        });
        logger.debug({
            message: 'Posted transactions.',
        });
    } catch (error) {
        // possible errors 422
        if (error.response) {
            logger.error({
                errorMsg: 'Error on calling transactions post api status code : ' + error.response.status + error.response.message,
            });
        }
        return error;
    }
}

const getAddressInfo = async(address) => {
    try {
        logger.info(address);
        const response = await axios.request({
            url: API_ADDRESS_PATH + address,
            method: 'get',
            baseURL: API_BASE_URL,
        });
        logger.debug({
            message: 'Received address info.',
        });
        logger.info(API_ADDRESS_PATH + address);
        return response.data;
    } catch (error) {
        // possible errors
        if (error.response) {
            logger.error({
                errorMsg: 'Error on calling address info api' + error.response.data + error.response.status,
            });
        }
    }
}

module.exports = {
    postTransaction,
    getTransactions,
    getAddressInfo,
}
