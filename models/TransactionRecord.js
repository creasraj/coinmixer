#!/usr/bin/env node
"use strict";

class TransactionRecord {
    constructor(publicFromAddress, publicToAddress, depositAddress, amount, timeStamp) {
      this.publicFromAddress = publicFromAddress;
      this.publicToAddress = publicToAddress;
      this.depositAddress = depositAddress;
      this.amount = amount;
      this.timeStamp = timeStamp;
    }

    getPublicFromAddress() {
      return this.publicFromAddress;
    }
    setPublicFromAddress(publicFromAddress) {
      this.publicFromAddress = publicFromAddress
    }
    getPublicToAddress() {
      return this.publicToAddress;
    }
    setPublicToAddress(publicToAddress) {
      this.publicToAddress = publicToAddress
    }
    getDepositAddress() {
      return this.depositAddress;
    }
    setDepositAddress(depositAddress) {
      this.depositAddress = depositAddress;
    }
    getAmount() {
        return this.amount;
    }
    setAmount(amount) {
        this.amount = amount
    }
    getTimeStamp() {
        return this.timeStamp;
    }
    setTimeStamp(timeStamp) {
        this.timeStamp = timeStamp;
    }
}

module.exports = TransactionRecord;
