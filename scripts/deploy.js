const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  const Crypton = await ethers.getContractFactory("Crypton");
  const cripton = await Crypton.deploy();

  await cripton.deployed();

  console.log("Crypton deployed to:", cripton.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });