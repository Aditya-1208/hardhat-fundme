const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")

module.exports = async function({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    // const ethUsdPricefeedAddress = networkConfig[chainId].ethUsdPriceFeed
    let ethUsdPricefeedAddress

    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPricefeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPricefeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    const FundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPricefeedAddress],
        log: true
    })
    log("_________________________________________________________")

    //pricefeeds are not available in hardhat network,
    // SO WE NEED A 'MOCK' CONTRACT, WE'LL DEPLOY OUR OWN MOCK CONTRACT
}

module.exports.tags = ["all", "fundme"]
