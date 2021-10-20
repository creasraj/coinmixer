#!/usr/bin/env node
"use strict";
const _ = require('lodash');
const logger = require('winston');

const DoleService = require('./dole-service');
const TransactionRecord = require('../models/TransactionRecord');
const config = require('../config')
const apiClient = require('../apiClient');


const mapper = new Map();
const doleOutMapper = new Map();

class MixerService {

    constructor() {
      this.houseAccountAddress = config.houseAddress;
      this.feePercentage = config.fee;
      this.handlePollCallback = this.handlePollCallback.bind(this);
      this.doleService = new DoleService();
    }

    async mapDepositAccount (depositAddress, addresses) {
      try {
          if (!_.isEmpty(addresses)) {
            const splitToAddresses = _.split(addresses, ',');
            const isValid = await this.validateDestAccounts(splitToAddresses);
            if (isValid) {
                const transactionRecord = new TransactionRecord(null, splitToAddresses, depositAddress, null, new Date());
                mapper.set(depositAddress, transactionRecord);
                return mapper;
            } else {
                logger.error('Provide used addresses');
            }
          } else {
             logger.error('Invalid addresses');
          }
      } catch (e) {
        logger.error('Error processing : ' + e.message);
      }
    }

    async validateDestAccounts(destAccounts) {
       let isValid = true
       for (const destAccount of destAccounts) {
           const response = await apiClient.getAddressInfo(destAccount);
           if (response.transactions.length > 0) {
               isValid = false;
           }
       }
       return isValid;
    }

    getFee (amount) {
      return this.feePercentage * amount;
    }

    getTransactionAmount (amount) {
      return amount - this.getFee(amount);
    }

    async handlePollCallback (transactions) {
     logger.info('Handle callback event');

     if (_.isEmpty(transactions)) {
       return;
     }
     transactions.forEach((transaction) => {
        const depositAddress = transaction.toAddress;
        const timeStamp = transaction.timestamp;
        const transactionRecord = mapper.get(depositAddress);
        if (!_.isEmpty(transactionRecord)) {
            if (Date.parse(timeStamp) >= Date.parse(transactionRecord.getTimeStamp())) {
                transactionRecord.setPublicFromAddress(transaction.fromAddress);
                if (transactionRecord.getAmount() != null) {
                    transactionRecord.setAmount(transactionRecord.getAmount() + this.getTransactionAmount(transaction.amount));
                } else {
                    transactionRecord.setAmount(this.getTransactionAmount(transaction.amount));
                }
            }
        }
     })
     await this.mixWithHouseAccount();
     if (doleOutMapper.size > 0) {
       await this.doleService.doleOut(doleOutMapper);
       doleOutMapper.clear();
       logger.info('Successfully dole out to sender address(es)');
     }
    }

    async mixWithHouseAccount() {
        logger.info('Sending amount to house account address after accounting fee')
        for (const [depositAddress, transactionRecord] of mapper.entries()) {
            if (transactionRecord.getAmount() != null) {
                const errorResponse = await apiClient.postTransaction(depositAddress, this.houseAccountAddress, transactionRecord.getAmount());
                if (_.isEmpty(errorResponse)) {
                    this.setupDoleOutEntries(transactionRecord, depositAddress);
                } else {
                    if (errorResponse.response.status === 422) {
                        logger.error('Insufficient funds');
                    } else if (errorResponse.response.status === 400) {
                        logger.error('Bad request');
                    }
                    break;
                }
            } else {
              logger.info('Invalid request');
            }
        }
    }

    setupDoleOutEntries(transactionRecord, depositAddress) {
       const publicToAddresses = transactionRecord.getPublicToAddress();
       const amount = transactionRecord.getAmount() / publicToAddresses.length;
        publicToAddresses.forEach((publicToAddress) => {
            const transactionRecord = new TransactionRecord();
            transactionRecord.setAmount(amount);
            transactionRecord.setPublicToAddress(publicToAddress);
            transactionRecord.setPublicFromAddress(depositAddress);
            doleOutMapper.set(publicToAddress, transactionRecord);
        })
    }
}

module.exports = MixerService;
