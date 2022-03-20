require('dotenv').config();

require("@nomiclabs/hardhat-waffle");
require("solidity-coverage");
require("@nomiclabs/hardhat-web3");
const { API_URL, PRIVATE_KEY } = process.env;
// require('./tasks/tasks');

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

 task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs) => {
    const account = web3.utils.toChecksumAddress(taskArgs.account);
    const balance = await web3.eth.getBalance(account);

    console.log(web3.utils.fromWei(balance, "ether"), "ETH");
});

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
  mocha: {
    timeout: 40000
  }
};

