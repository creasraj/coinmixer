#!/usr/bin/env node
"use strict";
const logger = require('winston');
const _ = require('lodash');

const apiClient = require('../apiClient');
const config = require('../config');
const utils = require('../utils');



class DoleService {

    sleep (ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

   async doleOut(mapper) {
       logger.info('Running dole out service');
       try {
           for (const [depositAddress, transactionRecord] of mapper.entries()) {
              console.log(mapper);
              const amounts = utils.smallerAmounts(transactionRecord.amount, transactionRecord.publicToAddress.length);
              console.log(amounts);
              for(const amount of amounts) {
                  const errorResponse = await apiClient.postTransaction(config.houseAddress,
                      depositAddress,
                      amount);

                  if (!_.isEmpty(errorResponse)) {
                      if (errorResponse.response.status === 422) {
                          logger.error('Insufficient funds');
                      } else if (errorResponse.response.status === 400) {
                          logger.error('Bad request');
                      }
                      break;
                  }
              }
           }

       } catch (e) {
          logger.error('Error while sending amount to public addresses' + e + e.message);
       }
   }
}

module.exports = DoleService;
