const ExchangeRate = artifacts.require("ExchangeRate");
const Oracle = artifacts.require("Oracle");
const truffleAssert = require("truffle-assertions");
const { expect } = require("chai");

contract("ExchangeRate", (accounts) => {
  let exchangeRate;
  let oracle;

  beforeEach(async () => {
    oracle = await Oracle.new();
    exchangeRate = await ExchangeRate.new(oracle.address);
  });

  it("should convert USD to ETH correctly", async () => {
    const cents = 100;

    const actualEthWei = await exchangeRate.usdToEth(cents);
    const oracleLatestAnswer = await oracle.latestAnswer();

    const expectedFiatPrice = cents * 1e16;
    const expectedEthWei = (expectedFiatPrice * 1e18) / (oracleLatestAnswer * 1e10);

    expect(actualEthWei.toString()).to.equal(expectedEthWei.toString());
  });

  it("should revert when Oracle returns 0 as the latest answer", async () => {
    await oracle.setLatestAnswer(0);

    const cents = 100;

    await truffleAssert.reverts(
      exchangeRate.usdToEth(cents),
      "Oracle latest answer is zero"
    );
  });
});
