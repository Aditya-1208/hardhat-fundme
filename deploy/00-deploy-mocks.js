const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    initialAnswer
} = require("../helper-hardhat-config")

module.exports = async function({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    log(network.name, developmentChains)
    if (developmentChains.includes(network.name)) {
        log("Local Network Detected! Deploying mocks")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, initialAnswer]
        })
        log("mocks deployed")
        log("__________________________________________________________")
    }
}

module.exports.tags = ["all", "mocks"]
