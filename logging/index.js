#!/usr/bin/env node
"use strict";

const winston = require('winston');
const config = require('../config');

const initLogging = () => {
    const { env } = config;

    let transports;
    if (env === 'test') {
        transports = [];
    } else if (env === 'development' || env === 'production') {
        transports = [new winston.transports.Console()];
    }

    winston.configure({ transports });
};

module.exports = {
    initLogging,
};
