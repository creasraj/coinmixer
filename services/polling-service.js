#!/usr/bin/env node
"use strict";
const _ = require('lodash');
const cron = require('node-cron');
const logging = require('winston');

const config = require('../config');
const apiClient = require('../apiClient');

class PollingService {

    constructor() {
      this.poller = null;
    }

    async poll(depositAddress, callback) {
        this.poller = cron.schedule(config.polling, async () => {
            logging.info('polling ' + depositAddress);
            await this.getAddressInfo(depositAddress, callback);
        });
    }

    async getAddressInfo (depositAddress, callback) {
        const response = await apiClient.getAddressInfo(depositAddress);
        const transactions = _.filter(response.transactions, {'toAddress': depositAddress});
        if (!_.isEmpty(transactions)) {
          this.poller.stop();
          callback(transactions);
        } else {
          logging.info('Deposit not yet made to : ' + depositAddress);
        }
    }
}

module.exports = PollingService;
