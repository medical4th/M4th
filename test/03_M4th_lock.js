const Token = artifacts.require("M4thToken");
const BN = web3.utils.BN;
const truffleAssert = require("truffle-assertions");

contract("M4 Token test", async (accounts) => {
  let m4token;
  let lockTime = 86400; //sec

  //event
  let eventTimeLocked;

  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  //await timeout(5000);
  before(async () => {
    m4token = await Token.deployed();
    //m4token = await Token.new();
  });

  it("total lock balance Check", async () => {
    let totalbalance = await m4token.totalLockedBalance();
    console.log(totalbalance.toString());
    assert.equal(new BN(totalbalance).toString(), "0");
  });

  it("account[1] amount 0 Check", async () => {
    let amount = await m4token.balanceOf(accounts[1]);
    //console.log(symbol.valueOf());
    assert.equal(new BN(amount).toString(), "0");
  });

  it("account[0] send to account[1] 100 M4 after amount check", async () => {
    await m4token.transfer(accounts[1], web3.utils.toWei("100", "ether"));
    let amount1 = await m4token.balanceOf(accounts[1]);
    assert.equal(new BN(amount1).toString(), web3.utils.toWei("100", "ether"));
  });

  it("Token lock 10 M4 account[1] Check", async () => {
    await m4token.timeLock(
      accounts[1],
      web3.utils.toWei("10", "ether"),
      lockTime
    );
    let lockInfo = await m4token.lockedInfo(accounts[1], 0);
    assert.equal(lockInfo[0], accounts[1]);
    assert.equal(
      new BN(lockInfo[1]).toString(),
      web3.utils.toWei("10", "ether")
    );
    console.log(new Date(new BN(lockInfo[2]) * 1000));
    console.log(new BN(lockInfo[1]).toString());
  });

  it("Token lock 20 M4 account[1] Check", async () => {
    await m4token.timeLock(
      accounts[1],
      web3.utils.toWei("20", "ether"),
      lockTime
    );

    let lockCount = await m4token.lockCount(accounts[1]);
    console.log("lock count = " + lockCount);

    let lockInfo0 = await m4token.lockedInfo(accounts[1], 0);
    let lockInfo1 = await m4token.lockedInfo(accounts[1], 1);

    console.log(lockInfo0[0]);
    console.log(new BN(lockInfo0[1]).toString());
    console.log(new BN(lockInfo0[2]).toString());

    console.log(lockInfo1[0]);
    console.log(new BN(lockInfo1[1]).toString());
    console.log(new BN(lockInfo1[2]).toString());
  });

  /*
  it("Token lock 90 M4 account[1] Check", async () => {
    await truffleAssert.fails(
      m4token.timeLock(accounts[1], web3.utils.toWei("90", "ether"), lockTime),
      truffleAssert.ErrorType.REVERT,
      "Not enough token "
    );
    //truffleAssert.eventEmitted(retTX, "TimeLocked", (param) => {
    //    console.log(param);
    //    return true;
    //});
    //let lockedCount = await m4token.lockCount(accounts[1]);
    //let totalLockAmount = await m4token.totalLockedBalance.call();
    //let amount = await m4token.balanceOf(accounts[1]);
    //console.log(tranLock.logs[1]);
    //assert.equal(new BN(lockedCount).toString(), "1");
    //assert.equal(new BN(totalLockAmount).toString(), web3.utils.toWei("90", "ether"));
    //assert.equal(new BN(amount).toString(), web3.utils.toWei("10", "ether"));
  });

        it("Token lock info account[1],  90 M4 Check", async () => {
            let lockInfo = await m4token.lockedInfo(accounts[1], 0);
            assert.equal(lockInfo[0], accounts[1]);
            assert.equal(new BN(lockInfo[1]).toString(), web3.utils.toWei("90", "ether"));
            console.log(new Date(new BN(lockInfo[2]) * 1000));
            console.log(new BN(lockInfo[1]).toString());
        });

        it("unlock  Check", async () => {
            console.log(new Date());
            let unlockAmount = await m4token.timeUnlock(accounts[1]);
            console.log(unlockAmount);
            //console.log(new BN(unlockAmount).toString());
            //assert.equal(new BN(unlockAmount).toString(), 0);

        });

        it("unlock  Check after 7 second", async () => {
            await timeout(7000);
            console.log(new Date());
            let unlockAmount = await m4token.timeUnlock(accounts[1]);
            assert.equal(new BN(unlockAmount).toString(), web3.utils.toWei("90", "ether"));

        });
    */
});
