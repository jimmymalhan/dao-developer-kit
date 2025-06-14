const VRT = artifacts.require("VeganRobToken");
const DAO = artifacts.require("VeganRobDAO");

module.exports = async function (deployer) {
  await deployer.deploy(VRT);
  const vrt = await VRT.deployed();

  await deployer.deploy(DAO);
  const dao = await DAO.deployed();

  console.log("✔  VRT deployed at", vrt.address);
  console.log("✔  DAO deployed at", dao.address);
};
