#!/usr/bin/env node
"use strict";

const fs = require('fs');
const logger = require('winston');

let config = {};
try {
    let environment = process.env.NODE_ENV;
    if (!fs.existsSync(`./app/config/${environment}.js`)) {
        environment = 'development';
    }
    logger.info(`Loading application config for environment: ${environment}, NODE_ENV=${process.env.NODE_ENV}`);
    config = require(`./${environment}`); // eslint-disable-line
} catch (e) {
    logger.warn('No application config could be found.');
}

module.exports = config;
