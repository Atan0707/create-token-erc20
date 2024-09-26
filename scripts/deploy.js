const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // const initialSupply = hre.ethers.parseUnits("1000", 18); // 1000 tokens
    // const AtanToken = await hre.ethers.getContractFactory("MintToken");
    // const atanToken = await AtanToken.deploy(initialSupply);

    // await atanToken.waitForDeployment();
    // console.log("AtanToken deployed to:", atanToken.address);

    const MintNFT = await hre.ethers.getContractFactory("MintNFT");
    const mintNFT = await MintNFT.deploy();

    await mintNFT.waitForDeployment();
    console.log("MintNFT deployed to:", mintNFT.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
