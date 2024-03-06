// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

//import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract SafeMath {
    function safeMul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        require(c / a == b, "Multiplication overflow");
        return c;
    }

    function safeDiv(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "Division by zero");
        uint256 c = a / b;
        return c;
    }
}

interface Oracle {
    function latestAnswer() external view returns (int256);
}


contract ExchangeRate {

    address addressOracle = 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419; //ni povezave na network

    uint256 constant private eurToUsdRate = 109410000;

    function usdToEth(uint256 cents) public pure returns (uint256) {
        uint256 currentFiatPrice = 223945360000 * 1e10;
        uint256 fiatPrice = cents * 1e16;

        uint256 ethWei = (fiatPrice * 1e18) / currentFiatPrice;

        return ethWei;
    }

    function ethToUsd(uint256 ethWei) public pure returns (uint256) {
        uint256 currentFiatPrice = 223945360000 * 1e10;
        uint256 ethPrice = ethWei * currentFiatPrice / 1e18;

        return ethPrice;
    }

    function eurToEth(uint256 cents) public pure returns (uint256) { //euro value in cents
        uint256 usdAmount = cents * eurToUsdRate / 1e8;
        uint256 ethWei = usdToEth(usdAmount*100);
        return ethWei;
    }

    function ethToEur(uint256 eth) public pure returns (uint256) {
        uint256 usdAmount = ethToUsd(eth);
        uint256 eurAmount = usdAmount * 1e8 / eurToUsdRate;
        return eurAmount / 1e18;
    }
}
