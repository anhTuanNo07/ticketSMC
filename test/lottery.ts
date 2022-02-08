import { Lottery } from './../typechain-types/Lottery'
import chai, { expect } from 'chai'
import { ethers } from 'hardhat'

describe('Lottery Ticket', () => {
  let deployer: any
  let acc1: any
  let acc2: any
  let acc3: any
  let acc4: any
  let Lottery: any
  let lotteryContract: Lottery

  beforeEach(async () => {
    ;[deployer, acc1, acc2, acc3, acc4] = await ethers.getSigners()
    Lottery = await ethers.getContractFactory('Lottery')
    const lottery = await Lottery.deploy()
    lotteryContract = await lottery.deployed()
  })

  it('Set total ticket', async () => {
    await lotteryContract.connect(deployer).setTotalTicket(100)
    expect(await lotteryContract.totalTicket()).to.equal('100')
  })

  it('set max ticket per user', async () => {
    await lotteryContract.connect(deployer).setMaxTicketPerUser(3)
    expect(await lotteryContract.maxTicketPerUser()).to.equal('3')
  })

  it('set ticket fee', async () => {
    await lotteryContract.connect(deployer).setTicketFee(10)
    expect(await lotteryContract.ticketFee()).to.equal('10')
  })

  describe('buy ticket', () => {
    beforeEach(async () => {
      await lotteryContract.connect(deployer).setTotalTicket(100)
      await lotteryContract.connect(deployer).setMaxTicketPerUser(3)
      await lotteryContract.connect(deployer).setTicketFee(10)
    })

    it('create batch ticket', async () => {
      await lotteryContract.createBatchTicket(100, deployer.address)
      expect(await lotteryContract.balanceOf(deployer.address)).to.equal('100')
    })

    it('buy ticket', async () => {
      await lotteryContract.createBatchTicket(100, lotteryContract.address)
      await lotteryContract.connect(acc1).buyTicket(1, { value: 10 })
    })
  })
})
