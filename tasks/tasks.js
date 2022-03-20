require("@nomiclabs/hardhat-web3");
require('dotenv').config();
const { getDefaultProvider, ethers } = require("ethers");
const CryptonArtefact = require('../artifacts/contracts/MyFirstContract.sol/Crypton.json');
const { PRIVATE_KEY, CONTRACT_ADDR } = process.env;

// Make a donation
task('pay', 'Send funds from contract to any address')
  .addParam("privatekey", "Account's private key")
  .addParam("value", "Amount funds")
  .setAction(async (taskArgs) => {
    const provider = new getDefaultProvider("rinkeby");
    const ownerWalletWithProvider = new ethers.Wallet(`0x${PRIVATE_KEY}`, provider);
    const senderWalletWithProvider = new ethers.Wallet(taskArgs.privatekey, provider);
    provider.getGasPrice();
    const contractAddr = CONTRACT_ADDR;
    const Contract = new ethers.Contract(
        contractAddr,
        CryptonArtefact.abi,
        ownerWalletWithProvider
    )
    const senderAddr = senderWalletWithProvider.address
    const sum = ethers.utils.parseEther(taskArgs.value);
    const tx = await Contract.connect(senderWalletWithProvider).pay({ value: sum });
    tx.wait();
    
    console.log('Balance on contract', contractAddr, web3.utils.fromWei(String(await Contract.connect(ownerWalletWithProvider).currentBalance()), "ether"), "ETH")
    console.log('Balance on', senderAddr, web3.utils.fromWei(String(await Contract.connect(ownerWalletWithProvider).addrBalance(senderAddr)), "ether"), "ETH");
  });

// Get the amount of donations from a specific address
task("sumbalance", "Get the amount of donations from a specific address")
  .addParam("account", "Account's address")
  .setAction(async (taskArgs) => {
    const provider = new getDefaultProvider("rinkeby");
    const ownerWalletWithProvider = new ethers.Wallet(`0x${PRIVATE_KEY}`, provider);
    const contractAddr = CONTRACT_ADDR;
    const Contract = new ethers.Contract(
        contractAddr,
        CryptonArtefact.abi,
        ownerWalletWithProvider
    )

    const targetAddress = web3.utils.toChecksumAddress(taskArgs.account);
    const sumFunds = await Contract.connect(ownerWalletWithProvider).summBalance(targetAddress);

    console.log('Total funds on', targetAddress, web3.utils.fromWei(String(sumFunds), "ether"), "ETH");
  });

// Withdraw money to a specific address in a specific amount
task("withdraw", "Withdraw money to a specific address in a specific amount")
  .addParam("account", "The address of the account to which the withdrawal is made")
  .addParam("value", "Amount funds")
  .setAction(async (taskArgs) => {
    const provider = new getDefaultProvider("rinkeby");
    const ownerWalletWithProvider = new ethers.Wallet(`0x${PRIVATE_KEY}`, provider);
    provider.getGasPrice();
    const contractAddr = CONTRACT_ADDR;
    const Contract = new ethers.Contract(
        contractAddr,
        CryptonArtefact.abi,
        ownerWalletWithProvider
    )

    const _to = web3.utils.toChecksumAddress(taskArgs.account);
    const sum = ethers.utils.parseEther(taskArgs.value)

    const tx = await Contract.connect(ownerWalletWithProvider).transferTo(_to, sum);
    tx.wait();

    // console.log('Balance on', _to, web3.utils.fromWei(String(await Contract.addrBalance(_to)), "ether"), "ETH");
    // console.log('Balance on contract', contractAddr, web3.utils.fromWei(String(await Contract.connect(ownerWalletWithProvider).currentBalance()), "ether"), "ETH")
  });

// Get a list of donors
task("donors", "Get a list of donors")
  .setAction(async () => {
    const provider = new getDefaultProvider("rinkeby");
    const ownerWalletWithProvider = new ethers.Wallet(`0x${PRIVATE_KEY}`, provider);
    const contractAddr = CONTRACT_ADDR;
    const Contract = new ethers.Contract(
        contractAddr,
        CryptonArtefact.abi,
        ownerWalletWithProvider
    )
    
    const accounts = await Contract.connect(ownerWalletWithProvider).getAllAddresses();

    console.log(accounts);
  });