pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./MamiStakeV2.sol";

contract LpStake is Ownable, ReentrancyGuard {
    address public mamiStakeAddress;

    mapping (address => mapping(uint256 => address)) public tokenOwner;

    mapping (address => mapping (address => uint256[])) public ownerTokens;

    mapping (uint256 => uint256) public sharePoolIds;

    constructor(address stakeAddress) {
        mamiStakeAddress = stakeAddress;

        sharePoolIds[0] = 1;
    }

    function getStakeTokenIds (address needNftAddress, address owner) external view returns (uint256[] memory) {
        return ownerTokens[needNftAddress][owner];
    }

    function approveToken (address token, uint256 amount) external onlyOwner {
        IERC20(token).approve(mamiStakeAddress, amount);
    }

    function withdrawToken (address token) external onlyOwner {
        uint256 balance = IERC20(token).balanceOf(address(this));
        IERC20(token).transfer(_msgSender(), balance);
    }

    function editSharePoolIds(uint256 poolId, uint256 sharePoolId) external onlyOwner {
        sharePoolIds[poolId] = sharePoolId;
    }

    function stake(
        uint256 _poolId,
        uint256[] calldata _tokenIds,
        uint256[] calldata _syncTokenIds
    ) external {
        (address needNftAddress,,,,) = MamiStakeV2(mamiStakeAddress).pools(_poolId);
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            require(
                _msgSender() ==
                    IERC721(needNftAddress).ownerOf(_tokenIds[i]),
                "You dont owner this nft"
            );
            ownerTokens[needNftAddress][_msgSender()].push(_tokenIds[i]);
            IERC721(needNftAddress).transferFrom(_msgSender(), address(this), _tokenIds[i]);
            tokenOwner[needNftAddress][_tokenIds[i]] = _msgSender();
        }
        // referaddress
        MamiStakeV2(mamiStakeAddress).stake(_poolId, _tokenIds, _syncTokenIds, owner());
    }

    function claim(
        uint256 _poolId,
        uint256[] calldata _tokenIds,
        uint256[] calldata _syncTokenIds
    ) public {
        (address needNftAddress,,,,) = MamiStakeV2(mamiStakeAddress).pools(_poolId);
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            require(_msgSender() == tokenOwner[needNftAddress][_tokenIds[i]], "You dont owner this nft");
        }
        (uint256 userRewards,) = getRewardsAmount(_poolId, _tokenIds);
        (,,,,address rewardsTokenAddress) = MamiStakeV2(mamiStakeAddress).pools(_poolId);
        MamiStakeV2(mamiStakeAddress).claim(_poolId, _tokenIds, _syncTokenIds);
        IERC20(rewardsTokenAddress).transfer(_msgSender(), userRewards);
    }

    function unStake(
        uint256 _poolId,
        uint256[] calldata _tokenIds,
        uint256[] calldata _syncTokenIds
    ) external {
        (address needNftAddress,,,,address rewardsTokenAddress) = MamiStakeV2(mamiStakeAddress).pools(_poolId);
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            require(_msgSender() == tokenOwner[needNftAddress][_tokenIds[i]], "You dont owner this nft");
        }
        (uint256 userRewards,) = getRewardsAmount(_poolId, _tokenIds);
        MamiStakeV2(mamiStakeAddress).unStake(_poolId, _tokenIds, _syncTokenIds);
        // (address needNftAddress,,,,address rewardsTokenAddress) = MamiStakeV2(mamiStakeAddress).pools(_poolId);
        IERC20(rewardsTokenAddress).transfer(_msgSender(), userRewards);
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            IERC721(needNftAddress).transferFrom(address(this), _msgSender(), _tokenIds[i]);
            delete tokenOwner[needNftAddress][_tokenIds[i]];
        }
    }

    function getPoolRateByBlock(uint256 _poolId, uint256 increaseAmount) public view returns(uint256) {
        (,,,uint256 rate,) = MamiStakeV2(mamiStakeAddress).pools(_poolId);
        uint256 poolStakeAmount = MamiStakeV2(mamiStakeAddress).poolStakeAmount(_poolId);
        return rate / (poolStakeAmount + increaseAmount);
    }

    function getRewardsAmount(uint256 _poolId, uint256[] calldata _tokenIds) public view returns(uint256, uint256) {
        uint256 totalRewardAmount = 95 * MamiStakeV2(mamiStakeAddress).getRewardsAmount(_poolId, _tokenIds) / 100;
        uint256 poolAmount = getPoolRateByBlock(_poolId, 0);
        uint256 sharePoolId = sharePoolIds[_poolId];
        uint256 sharePoolAmount = getPoolRateByBlock(sharePoolId, _tokenIds.length);
        if (poolAmount <=  sharePoolAmount) return (totalRewardAmount, 0);
        uint256 diffTokenAmount = (poolAmount - sharePoolAmount) * totalRewardAmount / poolAmount;
        return (totalRewardAmount - diffTokenAmount / 2, diffTokenAmount / 2);
    }
}