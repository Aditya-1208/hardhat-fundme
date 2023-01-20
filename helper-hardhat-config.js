const networkConfig = {
    5: {
        name: "goerli",
        ethUsdPriceFeed: "0x44390589104C9164407A0E0562a9DBe6C24A0E05"
    }
}

const developmentChains = ["hardhat", "localhost"]
const DECIMALS = 8
const initialAnswer = 200000000000

module.exports = { networkConfig, developmentChains, DECIMALS, initialAnswer }
