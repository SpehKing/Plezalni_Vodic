// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./interface/AggregatorV3Interface.sol";


contract ChainlinkPriceOracle {
    AggregatorV3Interface internal priceFeed;

    constructor(address _priceFeedAddress) {
        require(_priceFeedAddress != address(0), "Invalid address");
        // Additional checks if necessary
        priceFeed = AggregatorV3Interface(_priceFeedAddress);
    }

    function getLatestPrice() public view returns (int) {
        (, int price, , ,) = priceFeed.latestRoundData();
        // Additional error handling if necessary
        require(price >= 0, "Negative price");
        return price;
    }

    function ethToUsd(uint256 ethAmount) external view returns (uint256) {
        int ethToUsdPrice = getLatestPrice();
        // Perform conversion using the obtained price
        // Add logic for precision and rounding as needed
        return uint256(ethAmount) * uint256(ethToUsdPrice);
    }

    function usdToEth(uint256 usdAmount) external view returns (uint256) {
        int usdToEthPrice = getLatestPrice();
        // Perform conversion using the obtained price
        // Add logic for precision and rounding as needed
        return uint256(usdAmount) / uint256(usdToEthPrice);
    }

    function eurToEth(uint256 eurAmount) external view returns (uint256) {
        int eurToEthPrice = getLatestPrice();  // Assuming the price is for EUR/ETH
        // Perform conversion using the obtained price
        // Add logic for precision and rounding as needed
        return uint256(eurAmount) / uint256(eurToEthPrice);
    }

    function ethToEur(uint256 ethAmount) external view returns (uint256) {
        int ethToEurPrice = getLatestPrice();  // Assuming the price is for ETH/EUR
        // Perform conversion using the obtained price
        // Add logic for precision and rounding as needed
        return uint256(ethAmount) / uint256(ethToEurPrice);
    }
}