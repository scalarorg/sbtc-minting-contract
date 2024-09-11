const path = require("path");
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(
        "Deploying the contracts with the account:",
        await deployer.getAddress()
    );
    console.log("Account balance:", (await deployer.getBalance()).toString());


    const TokenDeployerService = await ethers.getContractFactory("TokenDeployer");
    const tokenDeployerService = await TokenDeployerService.deploy();
    await tokenDeployerService.deployed();
    console.log("tokenDeployerService deployed to:", tokenDeployerService.address);


    saveABI([
        {
            name: "TokenDeployer",
            address: tokenDeployerService.address,
        },
    ]);
}
function saveABI(contracts) {
    const fs = require("fs");
    const contractsDir = path.join(__dirname, "..", "abis", "tokendeployer-service");

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    let contractAddresses = {};

    contracts.forEach((contract) => {
        // Save each contract's address
        contractAddresses[contract.name] = contract.address;

        // Save each contract's artifact
        const ContractArtifact = artifacts.readArtifactSync(contract.name);
        fs.writeFileSync(
            path.join(contractsDir, `${contract.name}.json`),
            JSON.stringify(ContractArtifact, null, 2)
        );
    });

    // Save all contract addresses in a single file
    fs.writeFileSync(
        path.join(contractsDir, "contract-addresses.json"),
        JSON.stringify(contractAddresses, undefined, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
