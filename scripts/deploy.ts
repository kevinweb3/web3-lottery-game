import { ethers, artifacts } from "hardhat";
import fs from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();
  const address = deployer.address;
  console.log("获取部署合约账户地址：", address);

  const contractFactory = await ethers.getContractFactory("Lottery");
  const deployContract = await contractFactory.deploy();
  await deployContract.waitForDeployment();

  const contractAddress = await deployContract.getAddress();
  console.log("合约部署地址：", contractAddress);

  // 获取部署合约信息保存到本地文件，供前端合约交互使用
  const contractInfos = {
    contractAddress,
  };

  // 将合约地址和部署账户信息生成json文件传给前端
  saveFrontendFiles("Lottery", contractInfos);
}

function saveFrontendFiles(
  name: string,
  _contractInfos: object
) {
  const contractDir = __dirname + "/../contractInfo";

  if (!fs.existsSync(contractDir)) {
    fs.mkdirSync(contractDir);
  }

  const path = contractDir + "/contractAddress.json";
  const LotteryJsonDir = contractDir + "/Lottery.json";

  const LotteryArtifact = artifacts.readArtifactSync("Lottery");

  fs.writeFileSync(LotteryJsonDir, JSON.stringify(LotteryArtifact, null, 2));
  fs.writeFileSync(path, JSON.stringify(_contractInfos, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
