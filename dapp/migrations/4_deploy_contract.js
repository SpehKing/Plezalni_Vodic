const ExchangeRate = artifacts.require("ExchangeRate");

module.exports = function (deployer) {
  deployer.deploy(ExchangeRate);
};
