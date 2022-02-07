import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('Lottery Ticket', function () {
  it("Should return the new greeting once it's changed", async function () {
    const Lottery = await ethers.getContractFactory('Lottery')
    const lottery = await Lottery.deploy()
    await lottery.deployed()
  })
})
