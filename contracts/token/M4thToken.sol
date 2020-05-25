pragma solidity ^0.5.0;

import "./ERC20.sol";
import "./ERC20Detailed.sol";
import "./Ownable.sol";
import "./BlackListedRole.sol";

contract M4thToken is ERC20, ERC20Detailed, Ownable, BlackListedRole {
    string private _m4c_name = "M4th";
    string private _m4c_symbol = "M4th";
    uint8 private _m4c_decimals = 18;
    uint256 private INITIAL_SUPPLY = 400000000 * (10 ** uint(_m4c_decimals));

    //base time for lock term
    uint256 private baseLockTime = 0;  //2019-06-01 00:00(UTC-0) = 1559347200  

    //time lock info struct
    struct TimeLockInfo {
        address _beneficiary;
        uint256 _amount;
        uint256 _termTime;
    }

    //lock amount per account
    mapping(address => TimeLockInfo[]) private lockedList;
    //locked info list
    mapping(address => uint256) private lockedAmountInfo; 

    event TimeLocked( address indexed to, uint256 amount, uint256 time);
    event TimeUnlocked( address indexed to, uint256 amount, uint256 unlockTime);

    constructor () public ERC20Detailed(_m4c_name, _m4c_symbol, _m4c_decimals) Ownable() {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function transfer(address recipient, uint256 amount) public onlyNotBlacklisted returns (bool) {
        return super.transfer(recipient, amount);
    }




    // token burning - only owner
    function burnToken(address account, uint256 value) external onlyOwner{
        _burn(account, value);
    }

    // total locked token balance - only owner
    function totalLockedBalance() external onlyOwner view returns (uint256){
        return this.balanceOf(address(this));
    }

    // users locked token amount - only owner
    function lockedAmount(address addr) external onlyOwner view returns (uint256){
        return lockedAmountInfo[addr];
    }

    // lock infomation - only owner
    function lockedInfo(address addr, uint256 idx) external onlyOwner view returns(address, uint256, uint256){
        return _lockedInfo(addr, idx);
    }


    //set unlock - only owner
    function timeUnlock(address addr) external onlyOwner returns (uint256){
        return _timeUnlock(addr);
    }

    //set base lock time - only owner, only set it once
    function setBaseLockTime(uint256 time) external onlyOwner {
        if(baseLockTime == 0){
            baseLockTime = time;
        }
    }
    function getBaseLockTime() external view returns(uint256){
        return baseLockTime;
    }



    // erc20 balanceOf function return with lock token amount
    function balanceOf(address addr) public view returns (uint256) {
        return super.balanceOf(addr).add( lockedAmountInfo[addr] );
    }
    function lockedBalanceOf() public view returns (uint256) {
        return lockedAmountInfo[msg.sender];
    }
    function unlockedBalanceOf() public view returns (uint256) {
        return super.balanceOf(msg.sender);
    }




    // total locked info count(include unlocked info) - only owner
    function lockCount(address addr) public view returns (uint){
        return lockedList[addr].length;
    }
    //set time lock to address - only owner
    function timeLock(address addr, uint256 amount, uint256 time) external onlyOwner {
        require(addr != address(0), "Bad Address");
        require(addr != address(this), "Bad Address");
        require(amount > 0, "The amount must be greater than 0.");
        require(amount <= super.balanceOf(addr), "Not enough token balance");
        // 1 Day = 60 * 60 * 24,  1 Month = 1day * 30
        require(time > 0, "The time must be greater than 0.");

        _transfer(addr, address(this), amount);

        lockedAmountInfo[addr] = lockedAmountInfo[addr].add(amount);
        lockedList[addr].push(TimeLockInfo(addr, amount, time));

        emit TimeLocked(addr, amount, time);
    }
    // time unlock function
    function _timeUnlock(address addr) private returns (uint256){
        require(addr != address(0), "Bad Address");
        require(lockCount(addr) > 0, "Not found lockInfo");
        require(baseLockTime > 0, "Not set baseLockTime");

        uint256 unlockedAmount;

        if(lockedList[addr].length > 0){
            for(uint256 i = 0; i < lockedList[addr].length; i++){
                uint256 _releaseTime = baseLockTime.add(lockedList[addr][i]._termTime);
                if(_releaseTime <= now && lockedList[addr][i]._amount > 0){
                    unlockedAmount = unlockedAmount.add(lockedList[addr][i]._amount);
                    lockedList[addr][i]._amount = 0;
                }
            }

            if(unlockedAmount > 0){
                _transfer(address(this), addr, unlockedAmount);
                lockedAmountInfo[addr] = lockedAmountInfo[addr].sub(unlockedAmount);
            }
        }
        emit TimeUnlocked(addr, unlockedAmount, now);
    }
    function _lockedInfo(address addr, uint256 idx) private view returns(address, uint256, uint256){
        require(addr != address(0), "Bad Address");
        require(idx < lockCount(addr), "Bad lock idx");
        return (lockedList[addr][idx]._beneficiary, lockedList[addr][idx]._amount, lockedList[addr][idx]._termTime);
    }

}