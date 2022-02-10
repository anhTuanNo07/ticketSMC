// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from 'hardhat'

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  let deployer
  let acc1
  ;[deployer, acc1] = await ethers.getSigners()
  const Lottery = await ethers.getContractFactory('Lottery')
  const lotteryContract = await Lottery.attach(
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  )

  //   await lotteryContract.connect(deployer).setTotalTicket(100)
  //   await lotteryContract.connect(deployer).setMaxTicketPerUser(3)
  //   await lotteryContract
  //     .connect(deployer)
  //     .setTicketFee(ethers.utils.parseEther('1'))
  //   await lotteryContract.connect(deployer).setTicketFunder(deployer.address)
  //   await lotteryContract.createBatchTicket(100, deployer.address)
  //   await lotteryContract.connect(deployer).approve(acc1.address, 1)
  //   await lotteryContract
  //     .connect(acc1)
  //     .buyTicket(1, { value: ethers.utils.parseEther('1') })

  console.log('deployer address: ', deployer.address)

  console.log('Lottery deployed to:', lotteryContract.address)

  console.log('successfully!')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
