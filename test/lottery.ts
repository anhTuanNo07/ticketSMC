import { Lottery } from "./../typechain-types/Lottery";
import chai, { expect } from "chai";
import { ethers } from "hardhat";

describe("Lottery Ticket", () => {
  let deployer: any;
  let acc1: any;
  let acc2: any;
  let acc3: any;
  let acc4: any;
  let Lottery: any;
  let lotteryContract: Lottery;

  beforeEach(async () => {
    [deployer, acc1, acc2, acc3, acc4] = await ethers.getSigners();
    Lottery = await ethers.getContractFactory("Lottery");
    const lottery = await Lottery.deploy();
    lotteryContract = await lottery.deployed();
  });

  it("Set total ticket", async () => {
    await lotteryContract.connect(deployer).setTotalTicket(100);
    expect(await lotteryContract.totalTicket()).to.equal("100");
  });

  it("set max ticket per user", async () => {
    await lotteryContract.connect(deployer).setMaxTicketPerUser(3);
    expect(await lotteryContract.maxTicketPerUser()).to.equal("3");
  });

  it("set ticket fee", async () => {
    await lotteryContract.connect(deployer).setTicketFee(10);
    expect(await lotteryContract.ticketFee()).to.equal("10");
  });

  it("set ticket funder", async () => {
    await lotteryContract.connect(deployer).setTicketFunder(deployer.address);
    expect(await lotteryContract.ticketFunder()).to.equal(deployer.address);
  });

  describe("buy ticket", () => {
    beforeEach(async () => {
      await lotteryContract.connect(deployer).setTotalTicket(1);
      await lotteryContract.connect(deployer).setMaxTicketPerUser(3);
      await lotteryContract
        .connect(deployer)
        .setTicketFee(ethers.utils.parseEther("1"));
      await lotteryContract.connect(deployer).setTicketFunder(deployer.address);
    });

    it("create batch ticket", async () => {
      await lotteryContract.createBatchTicket(1, deployer.address);
      expect(await lotteryContract.balanceOf(deployer.address)).to.equal("1");
    });

    it("buy ticket", async () => {
      await lotteryContract.createBatchTicket(1, deployer.address);
      await lotteryContract.connect(deployer).approve(acc1.address, 1);
      await lotteryContract
        .connect(acc1)
        .buyTicket(1, { value: ethers.utils.parseEther("1") });
      const acc1Balance = await acc1.getBalance();
      expect(await acc1Balance.toString()).to.equal("9998999903988183314185");
      // around 1 ether with % fee
    });

    it("should receive reward", async () => {
      await lotteryContract.createBatchTicket(1, deployer.address);
      // mint only 1 ticket to persuade 100% buyer win
      await lotteryContract.connect(deployer).approve(acc1.address, 1);
      await lotteryContract
        .connect(acc1)
        .buyTicket(1, { value: ethers.utils.parseEther("1") });

      await lotteryContract.connect(deployer).rewardAndCreateNewRound();

      const oldTicket = await lotteryContract.oldRoundTicket();
      expect(oldTicket.toString()).to.equal("1");
      const acc1Balance = await acc1.getBalance();
      expect(acc1Balance.toString()).to.equal("9998999811727741840325");
      // receive 1 ether (approximately 10000 ethers)

      // receive reward
    });
  });
});
