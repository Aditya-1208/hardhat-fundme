require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.8",
    defaultNetwork: "hardhat",
    networks: {
        goerli: {
            url:
                "https://eth-goerli.g.alchemy.com/v2/6qjj73eULPBieJsCXUIwJ__ER5ujS1Gm"
        }
    },
    namedAccounts: {
        deployer: {
            default: 0
        }
    }
}
