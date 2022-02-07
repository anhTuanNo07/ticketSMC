import chai, { expect } from 'chai'
import { ethers } from 'hardhat'
import asPromised from "chai-as-promised";

chai.use(asPromised);

describe('Lottery Ticket', () => {
  let deployer, acc1, acc2, acc3, acc4: any;

  beforeEach(async () => {
    [deployer, acc1, acc2, acc3, acc4] = await ethers.getSigners();
  })

  it("Set total ticket", async function () {
    const Lottery = await ethers.getContractFactory('Lottery')
    const lottery = await Lottery.deploy()
    await lottery.deployed()
  })
})
