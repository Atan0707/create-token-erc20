const { expect } = require("chai");

// describe("MyToken", function () {
//     it("Should deploy with correct initial supply", async function () {
//         const [owner] = await ethers.getSigners();
//         const MyToken = await ethers.getContractFactory("MintToken");
//         const initialSupply = ethers.parseUnits("1000", 18);
//         const myToken = await MyToken.deploy(initialSupply);

//         expect(await myToken.totalSupply()).to.equal(initialSupply);
//         expect(await myToken.balanceOf(owner.address)).to.equal(initialSupply);
//     });

//     it("Should mint tokens successfully", async function () {
//         const [owner, addr1] = await ethers.getSigners();
//         const MyToken = await ethers.getContractFactory("MintToken");
//         const initialSupply = ethers.parseUnits("1000", 18);
//         const myToken = await MyToken.deploy(initialSupply);

//         // Mint tokens to addr1
//         const mintAmount = ethers.parseUnits("100", 18);
//         await myToken.mint(addr1.address, mintAmount);

//         expect(await myToken.balanceOf(addr1.address)).to.equal(mintAmount);
//     });
// });

describe("MintNFT Contract", function () {
    let MintNFT, mintNFT, owner, addr1, addr2;
  
    beforeEach(async function () {
      // Deploy the contract before each test
      MintNFT = await ethers.getContractFactory("MintNFT");
      [owner, addr1, addr2] = await ethers.getSigners();
      mintNFT = await MintNFT.deploy();
      await mintNFT.waitForDeployment();
    });
  
    describe("Minting NFTs", function () {
      it("Should mint a new NFT and check total supply", async function () {
        // Mint a new NFT
        await mintNFT.mint("ipfs://QmNFT1URI");
  
        // Check the total supply is 1
        expect(await mintNFT.totalSupply()).to.equal(1);
  
        // Mint another NFT
        await mintNFT.mint("ipfs://QmNFT2URI");
  
        // Check the total supply is updated to 2
        expect(await mintNFT.totalSupply()).to.equal(2);
      });
  
      it("Should mint NFTs with correct URI", async function () {
        // Mint a new NFT and check the URI
        await mintNFT.mint("ipfs://QmNFT1URI");
        expect(await mintNFT.tokenURI(1)).to.equal("ipfs://QmNFT1URI");
  
        // Mint another NFT and check the URI
        await mintNFT.mint("ipfs://QmNFT2URI");
        expect(await mintNFT.tokenURI(2)).to.equal("ipfs://QmNFT2URI");
      });
    });
  
    describe("Retrieving NFTs", function () {
      it("Should retrieve the correct NFT by ID", async function () {
        // Mint NFTs
        await mintNFT.mint("ipfs://QmNFT1URI");
        await mintNFT.mint("ipfs://QmNFT2URI");
  
        // Retrieve and check first NFT
        let nft1 = await mintNFT.getNFT(1);
        expect(nft1.id).to.equal(1);
        expect(nft1.uri).to.equal("ipfs://QmNFT1URI");
  
        // Retrieve and check second NFT
        let nft2 = await mintNFT.getNFT(2);
        expect(nft2.id).to.equal(2);
        expect(nft2.uri).to.equal("ipfs://QmNFT2URI");
      });
  
      it("Should return correct total supply after multiple mints", async function () {
        // Mint multiple NFTs
        await mintNFT.mint("ipfs://QmNFT1URI");
        await mintNFT.mint("ipfs://QmNFT2URI");
  
        // Check the total supply
        expect(await mintNFT.totalSupply()).to.equal(2);
      });
    });
  
    describe("Access Control", function () {
      it("Should allow multiple users to mint NFTs", async function () {
        // addr1 mints an NFT
        await mintNFT.connect(addr1).mint("ipfs://QmUser1NFT");
  
        // addr2 mints an NFT
        await mintNFT.connect(addr2).mint("ipfs://QmUser2NFT");
  
        // Check total supply is updated correctly
        expect(await mintNFT.totalSupply()).to.equal(2);
  
        // Check the NFTs minted by both users
        expect(await mintNFT.tokenURI(1)).to.equal("ipfs://QmUser1NFT");
        expect(await mintNFT.tokenURI(2)).to.equal("ipfs://QmUser2NFT");
      });
    });
  });
