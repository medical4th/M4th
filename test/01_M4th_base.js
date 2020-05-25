const Token = artifacts.require("M4thToken");
const BN = web3.utils.BN;

contract("M4 Token test", async accounts => {
  let m4token;
  let owner = accounts[0];
  let team = accounts[1];
  let dnapool = accounts[2];

  let testUser1 = accounts[5];
  let testUser2 = accounts[6];

  let initSupply = new BN("400000000000000000000000000");
  let teamSupply = initSupply.mul(new BN("17")).div(new BN("100"));
  let poolSupply = initSupply.mul(new BN("20")).div(new BN("100"));
  let baseTime = new Date("2019-10-01 00:00:01").getTime() / 1000;

  before(async () => {
    m4token = await Token.deployed();
    await m4token.transfer(team, teamSupply);
    await m4token.transfer(dnapool, poolSupply);
    await m4token.setBaseLockTime(baseTime);

    console.log("teamSupply = " + teamSupply.toString());
    console.log("poolSupply = " + poolSupply.toString());
    console.log("baseTime = " + baseTime);
  });

  it("Owner(admin) Check", async () => {
    let _owner = await m4token.owner.call();
    //console.log(symbol.valueOf());
    assert.equal(_owner.valueOf(), owner, "owner is not equal");
  });

  it("Token Symbol Check", async () => {
    let _symbol = await m4token.symbol.call();
    //console.log(symbol.valueOf());
    assert.equal(_symbol.valueOf(), "M4th", "Symbol should be M4th");
  });

  it("Token Decimal Check", async () => {
    let _decimals = await m4token.decimals.call();
    //console.log(decimals.toNumber());
    assert.equal(_decimals.valueOf(), 18, "decimal should be 18");
  });

  it("Token Total Supply Check", async () => {
    let totalSupply = await m4token.totalSupply.call();
    assert.equal(
      new BN(totalSupply).toString(),
      initSupply.toString(),
      "total supply is not equal"
    );

    //console.log(web3.utils.fromWei(new BN(totalSupply).toString(), "ether"))
  });

  it("Token Team Supply Check", async () => {
    let amount0 = await m4token.balanceOf(team);
    assert.equal(
      new BN(amount0).toString(),
      teamSupply.toString(),
      "team supply is not equal"
    );
  });

  it("Token DNA Pool Supply Check", async () => {
    let amount0 = await m4token.balanceOf(dnapool);
    assert.equal(
      new BN(amount0).toString(),
      poolSupply.toString(),
      "DNA Pool supply is not equal"
    );
  });

  it("owner remain Check", async () => {
    let amount0 = await m4token.balanceOf(owner);
    let remain = initSupply.sub(teamSupply).sub(poolSupply);
    assert.equal(
      new BN(amount0).toString(),
      remain.toString(),
      "DNA Pool supply is not equal"
    );
  });

  it("baseTime Check", async () => {
    let _baseTime = await m4token.getBaseLockTime.call();
    assert.equal(
      _baseTime.valueOf(),
      baseTime,
      "baseTime should be " + baseTime
    );
  });

  it("burning token Check", async () => {
    let amount0 = await m4token.balanceOf(owner);
    let burnAmount = new BN("100000000000000000000000000");

    await m4token.burnToken(owner, burnAmount);
    let _totalSupply_burn = await m4token.totalSupply.call();
    let _balance_burn = await m4token.balanceOf(owner);

    //console.log(_totalSupply_burn);
    //console.log(initSupply.sub(burnAmount))

    assert.equal(
      _totalSupply_burn.toString(),
      initSupply.sub(burnAmount).toString(),
      "total supply should be after burning amount"
    );
    assert.equal(
      _balance_burn.toString(),
      amount0.sub(burnAmount).toString(),
      "owner balance should be after burning amount"
    );
  });
});
