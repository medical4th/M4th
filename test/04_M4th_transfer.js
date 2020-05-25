const Token = artifacts.require("M4thToken");
const BN = web3.utils.BN;

contract("M4 Token test", async accounts => {
  let m4token;

  before(async () => {
    m4token = await Token.deployed();
  });

  it("account[5] amount 0 Check", async () => {
    let amount = await m4token.balanceOf(accounts[5]);
    //console.log(symbol.valueOf());
    assert.equal(new BN(amount).toString(), "0");
  });

  it("account[0] send to account[5] after amount check", async () => {
    await m4token.transfer(accounts[5], "100000000000000000000000000");
    let amount0 = await m4token.balanceOf(accounts[0]);
    let amount5 = await m4token.balanceOf(accounts[5]);
    //console.log(symbol.valueOf());
    assert.equal(new BN(amount0).toString(), "300000000000000000000000000");
    assert.equal(new BN(amount5).toString(), "100000000000000000000000000");
  });

  it("account[0] send to account[6] after amount check", async () => {
    await m4token.transfer(accounts[6], "50000000000000000000000000");
    let amount0 = await m4token.balanceOf(accounts[0]);
    let amount6 = await m4token.balanceOf(accounts[6]);
    //console.log(symbol.valueOf());
    assert.equal(new BN(amount0).toString(), "250000000000000000000000000");
    assert.equal(new BN(amount6).toString(), "50000000000000000000000000");
  });
});
