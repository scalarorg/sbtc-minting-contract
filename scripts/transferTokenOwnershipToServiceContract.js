// set ownership for mintContract
const path = require("path");
const yargs = require("yargs");
const { ethers } = require("hardhat");
const envs = require("../envs.js");
const { readChainConfig, getContractAddress, getContractByName } = require("./utils.js");

async function main() {
  const {n: network } = yargs
    .option('network', {
      alias: 'n',
      description: 'network',
      type: 'string',
      demandOption: true
    }).argv;
  const [deployer, user1, user2] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );
  console.log("Account balance:", (await deployer.getBalance()).toString());
  const chainConfig = await readChainConfig(network);
  const sBtcAddress = await getContractAddress(chainConfig, "sBtc");
  const mintContractAddress = await getContractAddress(chainConfig, "mintContract");
  
  console.log(`transferOwnershipToServiceContract ${mintContractAddress} for ERC20 ${sBtcAddress}`);
  const sBTCContract = await getContractByName("sBTC", sBtcAddress, signer);
  const txTransferOwnership = await sBTCContract.transferOwnership(mintContractAddress, true, false);
  const txRes = await txTransferOwnership.wait();
  console.log(txRes);

  // const sBTCContract = await getContractByName("sBTC", sBTCAddress);

  // console.log("sbtc address:", sBTCContract.address);
  // console.log("sbtc total supply:", await sBTCContract.totalSupply());

  // const mintContract = await getContractByName("MintContract", mintContractAddress);
  // // const mintContractName = "MintContract";
  // // const mintContractArtifact = require(`../artifacts/contracts/${mintContractName}.sol/${mintContractName}.json`);
  // // const mintContractABI = mintContractArtifact.abi;
  // // const mintContract = new ethers.Contract(
  // //   "0x3AE131F593C603c152f419f954C49f8A742bEC8c", // TODO: Update this address to old mintContract address
  // //   mintContractABI,
  // //   deployer
  // // );

  // console.log("mintContract address:", mintContract.address);
  // console.log("Current sBTC owner:", await sBTCContract.owner());
  // const txTransferOwnership = await sBTCContract.transferOwnership(mintContract.address, true, false);
  // // const txTransferOwnership = await mintContract.transferMintOwnership(
  // //   "0x768E8De8cf0c7747D41f75F83C914a19C5921Cf3" // TODO: Update this address to new mintContract address
  // // );
  // await txTransferOwnership.wait();
  // console.log("New sBTC owner:", await sBTCContract.owner());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
