const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

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
    const args = [ethUsdPricefeedAddress]
    const FundMe = await deploy("FundMe", {
        from: deployer,
        args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(FundMe.address, args)
    }
    log("_________________________________________________________")

    //pricefeeds are not available in hardhat network,
    // SO WE NEED A 'MOCK' CONTRACT, WE'LL DEPLOY OUR OWN MOCK CONTRACT
}

module.exports.tags = ["all", "fundme"]
