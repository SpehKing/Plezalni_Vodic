const ChainlinkPriceOracle = artifacts.require('ChainlinkPriceOracle');
const { expect } = require('chai');

contract('ChainlinkPriceOracle', (accounts) => {
  let chainlinkPriceOracle;

  const priceFeedAddress = '0xYourPriceFeedAddress'; // Replace with an actual price feed address for testing

  beforeEach(async () => {
    chainlinkPriceOracle = await ChainlinkPriceOracle.new(priceFeedAddress);
  });

  it('should get the latest price', async () => {
    const latestPrice = await chainlinkPriceOracle.getLatestPrice();
    expect(latestPrice).to.be.an('number');
  });

  it('should convert ETH to USD', async () => {
    const ethAmount = 1;
    const usdAmount = await chainlinkPriceOracle.ethToUsd(ethAmount);
    expect(usdAmount).to.be.an('number');
  });

  it('should convert USD to ETH', async () => {
    const usdAmount = 100;
    const ethAmount = await chainlinkPriceOracle.usdToEth(usdAmount);
    expect(ethAmount).to.be.an('number');
  });

  it('should convert EUR to ETH', async () => {
    const eurAmount = 50;
    const ethAmount = await chainlinkPriceOracle.eurToEth(eurAmount);
    expect(ethAmount).to.be.an('number');
  });

  it('should convert ETH to EUR', async () => {
    const ethAmount = 1;
    const eurAmount = await chainlinkPriceOracle.ethToEur(ethAmount);
    expect(eurAmount).to.be.an('number');
  });
});
