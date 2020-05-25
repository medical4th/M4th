pragma solidity ^0.5.0;

import "./Context.sol";
import "./Roles.sol";
import "./Ownable.sol";


contract BlackListedRole is Context, Ownable {
    using Roles for Roles.Role;

    event BlacklistedAdded(address indexed account);
    event BlacklistedRemoved(address indexed account);

    Roles.Role private _blocklisteds;

    modifier onlyNotBlacklisted() {
        require(!isBlacklisted(_msgSender()), "BlacklistedRole: caller have the Blacklisted role");
        _;
    }

    function isBlacklisted(address account) public view returns (bool) {
        return _blocklisteds.has(account);
    }

    function addBlacklisted(address account) public onlyOwner {
        _addBlacklisted(account);
    }

    function removeBlacklisted(address account) public onlyOwner {
        _removeBlacklisted(account);
    }


    function _addBlacklisted(address account) internal {
        _blocklisteds.add(account);
        emit BlacklistedAdded(account);
    }

    function _removeBlacklisted(address account) internal {
        _blocklisteds.remove(account);
        emit BlacklistedRemoved(account);
    }
}
