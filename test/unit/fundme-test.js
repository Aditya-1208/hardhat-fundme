const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", function() {
          let fundMe, deployer, mockV3Aggregator
          const sendValue = ethers.utils.parseEther("1")
          beforeEach(async function() {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture("all")
              fundMe = await ethers.getContract("FundMe", deployer)
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })

          describe("constructor", async function() {
              it("sets the aggregator addresses correctly", async function() {
                  const response = await fundMe.s_priceFeed()
                  assert.equal(response, mockV3Aggregator.address)
              })
          })

          describe("fund", async function() {
              it("fails, if you don't send enough ETH", async function() {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "You need to spend more ETH!"
                  )
              })

              it("updates the amountFunded data structure", async function() {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.s_addressToAmountFunded(
                      deployer
                  )
                  assert.equal(response.toString(), sendValue.toString())
              })

              it("adds funders to array of funders", async function() {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.s_funders(0)
                  assert.equal(funder, deployer)
              })
          })

          describe("withdraw", async function() {
              beforeEach(async function() {
                  await fundMe.fund({ value: sendValue })
              })

              it("withdraw ETH from a single founder", async function() {
                  // arrange
                  const startingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const startingDeployerBalance = await fundMe.provider.getBalance(
                      deployer
                  )

                  //act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)

                  const { gasUsed, effectiveGasPrice } = transactionReceipt

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance = await fundMe.provider.getBalance(
                      deployer
                  )
                  //assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      endingDeployerBalance
                          .add(gasUsed.mul(effectiveGasPrice))
                          .toString(),
                      startingDeployerBalance
                          .add(startingFundMeBalance)
                          .toString()
                  )
              })

              it("Cheaper withdraw", async function() {
                  // arrange
                  const startingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const startingDeployerBalance = await fundMe.provider.getBalance(
                      deployer
                  )

                  //act
                  const transactionResponse = await fundMe.cheapWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)

                  const { gasUsed, effectiveGasPrice } = transactionReceipt

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance = await fundMe.provider.getBalance(
                      deployer
                  )
                  //assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      endingDeployerBalance
                          .add(gasUsed.mul(effectiveGasPrice))
                          .toString(),
                      startingDeployerBalance
                          .add(startingFundMeBalance)
                          .toString()
                  )
              })
          })
      })
