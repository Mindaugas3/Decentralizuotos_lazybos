
const BettingManager = artifacts.require("BettingManager");
const Bet = artifacts.require("Bet");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(BettingManager);
  deployer.deploy(Bet, accounts[0]);
};
