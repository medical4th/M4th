const Token = artifacts.require("M4thToken");
const BN = web3.utils.BN;
const truffleAssert = require("truffle-assertions");

contract("M4 Token test", async accounts => {
  let m4token;
  let blacklistAccount = accounts[5];

  before(async () => {
    m4token = await Token.deployed();
  });

  it("blacklist amount 0 Check", async () => {
    let amount = await m4token.balanceOf(blacklistAccount);
    //console.log(symbol.valueOf());
    assert.equal(new BN(amount).toString(), "0");
  });

  it("account[0] send to blacklist after amount check", async () => {
    await m4token.transfer(blacklistAccount, "100000000000000000000000000");
    let amount0 = await m4token.balanceOf(accounts[0]);
    let amount5 = await m4token.balanceOf(blacklistAccount);
    //console.log(symbol.valueOf());
    assert.equal(new BN(amount0).toString(), "300000000000000000000000000");
    assert.equal(new BN(amount5).toString(), "100000000000000000000000000");
  });

  it("blacklist account add blacklist ", async () => {
    await m4token.addBlacklisted(blacklistAccount);
    let isblack = await m4token.isBlacklisted(blacklistAccount);
    //console.log(symbol.valueOf());
    assert.equal(isblack, true);
  });

  it("blacklist account transfer to other ", async () => {
    //await m4token.addBlacklisted(blacklistAccount);
    let isblack = await m4token.isBlacklisted(blacklistAccount);
    //console.log(symbol.valueOf());
    assert.equal(isblack, true);

    await truffleAssert.fails(
      m4token.transfer(accounts[9], "100000000000000000000000000", {
        from: blacklistAccount
      }),
      truffleAssert.ErrorType.REVERT,
      "caller have the Blacklisted role"
    );
  });

  it("blacklist account remove blacklist ", async () => {
    await m4token.removeBlacklisted(blacklistAccount);
    let isblack = await m4token.isBlacklisted(blacklistAccount);
    //console.log(symbol.valueOf());
    assert.equal(isblack, false);
  });

  it("removed blacklist account transfer to account[9] ", async () => {
    //await m4token.addBlacklisted(blacklistAccount);
    let isblack = await m4token.isBlacklisted(blacklistAccount);
    //console.log(symbol.valueOf());
    assert.equal(isblack, false);

    await m4token.transfer(accounts[9], "100000000000000000000000000", {
      from: blacklistAccount
    });

    let amount5 = await m4token.balanceOf(blacklistAccount);
    assert.equal(new BN(amount5).toString(), "0");
  });

  it("account[9] and blacklist amount check", async () => {
    let amount9 = await m4token.balanceOf(accounts[9]);
    let amount5 = await m4token.balanceOf(blacklistAccount);
    //console.log(symbol.valueOf());
    assert.equal(new BN(amount9).toString(), "100000000000000000000000000");
    assert.equal(new BN(amount5).toString(), "0");
  });
});
