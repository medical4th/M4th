const Token = artifacts.require("M4thToken");
const BN = web3.utils.BN;

contract("M4 Token test", async accounts => {
  let m4token;

  before(async () => {
    m4token = await Token.deployed();
  });

  it("Token burn Check", async () => {
    await m4token.burnToken(accounts[0], "100000000000000000000000000");
    let totalSupply = await m4token.totalSupply.call();
    assert.equal(new BN(totalSupply).toString(), "300000000000000000000000000");
  });

  it("Token burn Check", async () => {
    await m4token.burnToken(accounts[0], "50000000000000000000000000");
    let totalSupply = await m4token.totalSupply.call();
    assert.equal(new BN(totalSupply).toString(), "250000000000000000000000000");
  });

  it("account[0] balance Check", async () => {
    let balance = await m4token.balanceOf(accounts[0]);
    assert.equal(new BN(balance).toString(), "250000000000000000000000000");
  });
});
