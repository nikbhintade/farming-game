// SPDX-License-Identifier: MIT LICENSE

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./CatFish.sol";

contract Pond is Ownable {
    CatFish cf;
    IERC20 eggs;
    IERC20 usdt;

    uint256[] public heistPrices = [
        5 * 10**8,
        10 * 10**8,
        20 * 10**8,
        40 * 10**8,
        80 * 10**8
    ];
    struct Staking {
        uint256 timestamp;
        address owner;
        uint16 stolen;
    }

    struct CurrentValue {
        uint256 tokenId;
        uint256 timestamp;
        uint256 value;
        string metadata;
    }

    struct Cat {
        uint256 timestamp;
        uint256 dailyCount;
        uint256 catValue;
    }

    mapping(uint256 => Staking) public stakings;
    mapping(address => uint256[]) public stakingsByOwner;

    uint256 public catValue;
    uint256 public catCount;
    uint256 public eggsHeistedAmount;
    uint256 public heistAmount;
    uint256 public totalTaxAmount;
    mapping(uint256 => Cat) public cats;

    uint16 public taxPercentage = 1;
    uint16 public taxFreeDays = 3;

    bool public paused;

    event Heist(
        address indexed owner,
        uint256 indexed cat,
        uint256 fish,
        uint256 amount
    );

    constructor(
        address _cf,
        address _eggs,
        address _usdt,
    ) {
        cf = CatFish(_cf);
        eggs = IERC20(_eggs);
        usdt = IERC20(_usdt);
        usdt.approve(msg.sender, type(uint256).max);
    }

    // Reads
    function daysStaked(uint256 tokenId) public view returns (uint256) {
        Staking storage staking = stakings[tokenId];
        uint256 diff = block.timestamp - staking.timestamp;
        return uint256(diff) / 1 days;
    }

    function calculateReward(uint256 tokenId) public view returns (uint256) {
        require(cf.ownerOf(tokenId) == address(this), "The fish must be staked");
        uint256 balance = eggs.balanceOf(address(this));
        Staking storage staking = stakings[tokenId];
        uint256 baseReward = 100000 ether / uint256(1 days);
        uint256 diff = block.timestamp - staking.timestamp;
        uint256 dayCount = uint256(diff) / (1 days);
        if (dayCount < 1 || balance == 0) {
            return 0;
        }
        uint256 yesterday = dayCount - 1;
        uint256 dayRewards = (yesterday * yesterday + yesterday) /
            2 +
            10 *
            dayCount;
        uint256 ratio = (((dayRewards / dayCount) *
            (diff - dayCount * 1 days)) / 1 days) + dayRewards;
        uint256 reward = baseReward * ratio;
        return reward < balance ? reward : balance;
    }

    function tokenOfOwnerByIndex(address owner, uint256 index)
        public
        view
        returns (uint256)
    {
        return stakingsByOwner[owner][index];
    }

    function balanceOf(address owner) public view returns (uint256) {
        return stakingsByOwner[owner].length;
    }

    function allStakingsOfOwner(address owner)
        public
        view
        returns (CurrentValue[] memory)
    {
        uint256 balance = balanceOf(owner);
        CurrentValue[] memory list = new CurrentValue[](balance);
        for (uint16 i = 0; i < balance; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(owner, i);
            Staking storage staking = stakings[tokenId];
            uint256 reward = calculateReward(tokenId) - staking.stolen;
            string memory metadata = cf.tokenURI(tokenId);
            list[i] = CurrentValue(
                tokenId,
                staking.timestamp,
                reward,
                metadata
            );
        }
        return list;
    }

    function batchCatInfo(uint256[] memory catIds)
        public
        view
        returns (Cat[] memory)
    {
        Cat[] memory info = new Cat[](catIds.length);
        for (uint16 i = 0; i < catIds.length; i++) {
            info[i] = cats[catIds[i]];
        }
        return info;
    }

    function heistCost(uint256 tokenId) public view returns (uint256) {
        Cat storage cat = cats[tokenId];
        uint256 diff = block.timestamp - cat.timestamp;
        uint256 exp = diff > 1 days ? 0 : cat.dailyCount;
        return heistPrices[exp];
    }

    // Staking
    function stakeFish(uint256 tokenId) public {
        require(!paused, "Contract paused");
        require(cf.ownerOf(tokenId) == msg.sender, "You must own that fish");
        require(!cf.isCat(tokenId), "You can only stake fish");
        require(cf.isApprovedForAll(msg.sender, address(this)));

        Staking memory staking = Staking(block.timestamp, msg.sender, 0);
        stakings[tokenId] = staking;
        stakingsByOwner[msg.sender].push(tokenId);
        cf.transferFrom(msg.sender, address(this), tokenId);
    }

    function multiStakeFish(uint256[] memory fish) public {
        for (uint8 i = 0; i < fish.length; i++) {
            stakeFish(fish[i]);
        }
    }

    function unstakeFis(uint256 tokenId) public {
        require(cf.ownerOf(tokenId) == address(this), "The fish must be staked");
        Staking storage staking = stakings[tokenId];
        require(staking.owner == msg.sender, "You must own that fish");
        uint256[] storage stakedFish = stakingsByOwner[msg.sender];
        uint16 index = 0;
        for (; index < stakedFish.length; index++) {
            if (stakedFish[index] == tokenId) {
                break;
            }
        }
        require(index < stakedFish.length, "Fish not found");
        stakedFish[index] = stakedFish[stakedFish.length - 1];
        stakedFish.pop();
        staking.owner = address(0);
        cf.transferFrom(address(this), msg.sender, tokenId);
    }

    function claimFishRewards(uint256 tokenId, bool unstake) public {
        require(!paused, "Contract paused");
        uint256 netRewards = _claimFishRewards(tokenId);
        if (unstake) {
            unstakeFish(tokenId);
        }
        if (netRewards > 0) {
            require(eggs.transfer(msg.sender, netRewards));
        }
    }

    function claimManyFishRewards(uint256[] calldata fish, bool unstake) public {
        require(!paused, "Contract paused");
        uint256 netRewards = 0;
        for (uint8 i = 0; i < fish.length; i++) {
            netRewards += _claimFishRewards(fish[i]);
        }
        if (netRewards > 0) {
            require(eggs.transfer(msg.sender, netRewards));
        }
        if (unstake) {
            for (uint8 i = 0; i < fish.length; i++) {
                unstakeFish(fish[i]);
            }
        }
    }

    function claimManyCatRewards(uint256[] calldata claimingCats, bool token) public {
        for (uint8 i = 0; i < claimingCats.length; i++) {
            heist(claimingCats[i], false, token);
        }
    }

    // Heists
    function heist(uint256 tokenId, bool enterPond, bool token) public payable {
        require(!paused, "Contract paused");
        require(
            cf.ownerOf(tokenId) == msg.sender && cf.isCat(tokenId),
            "You must own that cat"
        );
        cat storage cat = cats[tokenId];

        if (cat.timestamp == 0) {
            cat.timestamp = block.timestamp;
            cat.catValue = catValue;
            catCount++;
        }

        if (enterPond) {
            uint256 diff = block.timestamp - cat.timestamp;
            if (diff > 1 days) {
                cat.timestamp = block.timestamp;
                cat.dailyCount = 0;
            }
            require(
                cat.dailyCount < heistPrices.length,
                "You can heist a maximum of 5 times per day"
            );
            uint256 cost = heistCost(tokenId);
            require(msg.value == 0, "ERC20 token collateral");

            uint256 allowance = usdt.allowance(msg.sender, address(this));
            uint256 balance = usdt.balanceOf(msg.sender);
            require(
                allowance >= cost && balance >= cost,
                "You must pay the correct amount of USDT"
            );
            usdt.transferFrom(msg.sender, address(this), cost);
            
            cat.dailyCount++;
            heistAmount++;
			fulfillRandom(tokenId);
        }

        if (cat.catValue < catValue) {
            uint256 tax = catValue - cat.catValue;
            cat.catValue = catValue;
            totalTaxAmount += tax;
            eggs.transfer(msg.sender, tax);
        }
    }

    // Internal
    function randomHeistPercent() internal returns (uint16) {

        uint256 randomNum = randomness / ((2**256 - 1) / uint256(1000));
        uint16 randomPercent;
        if (randomNum >= 0 && randomNum <= 400) {
            randomPercent = 10;
        } else if (randomNum > 400 && randomNum <= 750) {
            randomPercent = 20;
        } else if (randomNum > 750 && randomNum <= 900) {
            randomPercent = 30;
        } else if (randomNum > 900 && randomNum <= 936) {
            randomPercent = 40;
        } else if (randomNum > 936 && randomNum <= 961) {
            randomPercent = 50;
        } else if (randomNum > 961 && randomNum <= 980) {
            randomPercent = 60;
        } else if (randomNum > 980 && randomNum <= 992) {
            randomPercent = 70;
        } else if (randomNum > 992 && randomNum <= 998) {
            randomPercent = 80;
        } else if (randomNum == 999) {
            randomPercent = 90;
        }
        return randomPercent;
    }

    function fulfillRandom(uint256 catId) internal {

        address catOwner = cf.ownerOf(catId);
        Cat storage cat = cats[catId];
        require(catOwner != address(0));
        uint256 fishIndex = randomness % cf.balanceOf(address(this));
        uint256 fishId = cf.tokenOfOwnerByIndex(address(this), fishIndex);
        Staking storage staking = stakings[fishId];

        if(catOwner == staking.owner) {
            cat.dailyCount = 5;
        }
        
        uint256 rewards = calculateReward(fishId) - staking.stolen;
        uint256 stealAmount = (randomHeistPercent() * rewards) / 100;

        if (stealAmount > 0) {
            eggsHeistedAmount += stealAmount;
            eggs.transfer(catOwner, stealAmount);
        }
        emit Heist(catOwner, catId, fishId, stealAmount);
    }

    function _claimFishRewards(uint256 tokenId) internal returns (uint256) {
        require(cf.ownerOf(tokenId) == address(this), "The fish must be staked");
        Staking storage staking = stakings[tokenId];
        require(staking.owner == msg.sender, "You must own that fish");

        uint256 rewards = calculateReward(tokenId);
        require(rewards >= staking.stolen, "You have no rewards at this time");
        rewards -= staking.stolen;

        uint256 tax = catCount == 0 || daysStaked(tokenId) >= taxFreeDays
            ? 0
            : (taxPercentage * rewards) / 100;
        uint256 netRewards = rewards - tax;

        if (catCount > 0 && tax > 0) {
            catValue += tax / catCount;
        }

        staking.stolen = 0;
        staking.timestamp = block.timestamp;

        return netRewards;
    }

    // Admin
    function withdraw(uint256 amount) external onlyOwner {
        payable(owner()).transfer(amount);
    }

    function togglePause() external onlyOwner {
        paused = !paused;
    }

    function setHeistPrice(uint8 index, uint256 price) external onlyOwner {
        require(index < heistPrices.length, "Incorrect index");
        heistPrices[index] = price;
    }
}
