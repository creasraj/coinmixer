#!/usr/bin/env node
"use strict";
const crypto = require("crypto");

const utils = {
  generateDepositAddress() {
    const hash = crypto.createHash("sha256");
    return hash
      .update(`${Date.now()}`)
      .digest("hex")
      .substring(0, 8);
  },
  smallerAmounts(amount, parts) {
    let amounts = []

   if (amount % parts === 0)
    {
      for(let i=0; i < parts; i++)
        amounts.push(amount / parts);
    }
    else
    {
      let zp = parts - (amount % parts);
      let pp = (amount/parts).toFixed(2);
      for(let i=0;i< parts;i++)
      {
        if(i>= zp)
          amounts.push(pp+1);
        else
          amounts.push(pp);
      }
    }
    return  amounts;
  }
};

module.exports = utils;
