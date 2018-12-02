var Hangup = artifacts.require("./Hangup.sol");

module.exports = function(deployer) {
  deployer.deploy(Hangup);
};
