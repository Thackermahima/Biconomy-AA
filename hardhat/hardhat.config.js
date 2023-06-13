require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config({ path : '.env'});
/** @type import('hardhat/config').HardhatUserConfig */
const POLYGON_URL = process.env.POLYGON_URL;
const accounts = process.env.PRIVATE_KEY;
module.exports = {
  solidity: "0.8.18",
  networks : {
    mumbai : {
      url :POLYGON_URL,
      accounts : [accounts],
    }
  }
};
