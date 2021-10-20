#!/usr/bin/env node
"use strict";
const green = require("chalk").green;
const inquirer = require("inquirer");

const utils = require("./utils");
const { initLogging } = require('./logging');
const MixerService = require('./services/mixer-service');
const PollingService = require('./services/polling-service');

initLogging()

const depositAddress = utils.generateDepositAddress();


function prompt() {
  /* Inquirer documentation: https://github.com/SBoudrias/Inquirer.js#documentation */
  inquirer.prompt([
    {
      name: "addresses",
      message: "Please enter a comma-separated list of new, unused Jobcoin addresses where your mixed Jobcoins will be sent:"
    },
    {
      name: "deposit",
      message: `You may now send Jobcoins to address ${green(depositAddress)} after polling has started. They will be mixed and sent to your destination addresses. \n Press Enter or Enter ${green('"y"')} to run again.`,
    },
  ])
  .then(async (answers) => {
    /*  Your code here. */
    console.log('Processing...........')
    const mixerService = new MixerService();
    const mapper = await mixerService.mapDepositAccount(depositAddress, answers.addresses);
    if (mapper !== undefined) {
      const pollingService = new PollingService();
      await pollingService.poll(depositAddress, mixerService.handlePollCallback);
    }
    if (answers.deposit && answers.deposit.toLowerCase() === "y") {
      prompt();
    }
  });
}

console.log("Welcome to the Jobcoin mixer!");
prompt();

module.exports = prompt;
