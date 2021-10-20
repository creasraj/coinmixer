#!/usr/bin/env node
"use strict";
const utils = require("../utils");

describe("utils", () => {
  it("should exist", () => {
    expect(utils).toBeDefined();
  });

  it("generateDepositAddress generates a string with 8 characters", () => {
    const depositAddress = utils.generateDepositAddress();
    expect(typeof depositAddress).toEqual("string");
    expect(depositAddress).toHaveLength(8);
  });

  it("should split the amount to N parts", () => {
    const amounts = utils.smallerAmounts(9, 5);
    expect(amounts).toEqual([3, 3, 3]);
  });

});
