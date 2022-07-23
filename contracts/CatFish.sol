// SPDX-License-Identifier: MIT LICENSE

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Metadata.sol";

// TODO: Integrate Telos oracle

contract CatFish is ERC721Enumerable, Ownable {
    uint256 public constant MAX_TOKENS = 9999;
    uint256 public constant MAIN_TOKENS = 3450;
    uint256 public constant AIRDROP_TOKENS = 400;
    uint256 public constant WHITELIST_TOKENS = 150;
    uint256 public constant PUBLIC_PRICE = 0.015 ether;
    uint256 public constant WHITELIST_PRICE = 0.01 ether;
    uint16 public purchased = 0;
    uint16 public airdropCount = 0;
    uint16 public whitelistCount = 0;

    struct TokenWithMetadata {
        uint256 tokenId;
        bool isCat;
        string metadata;
    }
    struct Tracker {
        bool check;
        bool userType;
        uint16 count;
    }
    struct TrackerUser {
        address user;
        bool check;
        bool userType;
    }
    mapping(uint256 => bool) public isCat;
    uint256[] public cats;
    mapping(uint256 => uint256) public traitsOfToken;
    mapping(uint256 => bool) public traitsTaken;
    mapping(address => Tracker) public trackers;
    bool public mainSaleFlag;
    bool public eggsSaleFlag;
    IERC20 eggs;
    Metadata metadata;

    constructor(address _eggs, address _metadata) ERC721("CatFish", "CF") {
        eggs = IERC20(_eggs);
        metadata = Metadata(_metadata);
        require(eggs.approve(msg.sender, type(uint256).max));
    }

    // Internal
    function setTraits(uint256 tokenId, uint256 seed)
        internal
        returns (uint256)
    {
        uint256 maxTraits = 16**4;
        uint256 nextRandom = uint256(keccak256(abi.encode(seed, 1)));
        uint256 traitsID = nextRandom % maxTraits;
        while (traitsTaken[traitsID]) {
            nextRandom = uint256(keccak256(abi.encode(nextRandom, 1)));
            traitsID = nextRandom % maxTraits;
        }
        traitsTaken[traitsID] = true;
        traitsOfToken[tokenId] = traitsID;
        return traitsID;
    }

    function setSpecies(uint256 tokenId, uint256 seed) internal returns (bool) {
        uint256 random = uint256(keccak256(abi.encode(seed, 2))) % 10;
        if (random == 0) {
            isCat[tokenId] = true;
            cats.push(tokenId);
            return true;
        }
        return false;
    }

    function fulfillRandom(address minter, uint256 tokenId) internal {
        uint256 randomness = randomSeed();
        require(minter != address(0));
        setSpecies(tokenId, randomness);
        setTraits(tokenId, randomness);
        _mint(minter, tokenId);
    }

    // Reads
    function eggsPrice(uint16 amount) public view returns (uint256) {
        require(purchased + amount > AIRDROP_TOKENS + WHITELIST_TOKENS + MAIN_TOKENS);
        uint16 secondGen = purchased + amount - uint16(AIRDROP_TOKENS + WHITELIST_TOKENS + MAIN_TOKENS);
        return (secondGen / 500 + 1) * 40 ether;
    }

    function catCount() public view returns (uint256) {
        return cats.length;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        return
            metadata.tokenMetadata(
                isCat[tokenId],
                traitsOfToken[tokenId],
                tokenId
            );
    }

    function allTokensOfOwner(address owner)
        public
        view
        returns (TokenWithMetadata[] memory)
    {
        uint256 balance = balanceOf(owner);
        TokenWithMetadata[] memory tokens = new TokenWithMetadata[](balance);
        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(owner, i);
            string memory data = tokenURI(tokenId);
            tokens[i] = TokenWithMetadata(tokenId, isHound[tokenId], data);
        }
        return tokens;
    }

    // Public
    function airdropOrWhitelistMint(uint16 amount, address minter) public payable {
        require(minter != address(0));
        require(trackers[minter].check, "Can't access");
        require(trackers[minter].count + amount <= 2, "Max 2 mints per address");
        if(trackers[minter].userType) {
            require(whitelistCount + amount <= WHITELIST_TOKENS, "Whitelist sale sold out");
            require(msg.value >= WHITELIST_PRICE * amount, "You must pay enough ETH");
            for (uint16 i = 0; i < amount; i++) {
                whitelistCount++;
                purchased++;
                fulfillRandom(minter, purchased - 1);
            }
        } else {
            require(airdropCount + amount <= AIRDROP_TOKENS, "Airdrop sale sold out");
            for (uint16 i = 0; i < amount; i++) {
                airdropCount++;
                purchased++;
                fulfillRandom(minter, purchased - 1);
            }
        }
        trackers[minter].count += amount;
    }

    function mainMint(uint8 amount) public payable {
        address minter = _msgSender();
        require(mainSaleFlag && !eggsSaleFlag, "Main Sale has't started yet");
        require(tx.origin == minter, "Contracts not allowed");
        require(amount > 0 && amount <= 10, "Max 10 mints per tx");
        require(airdropCount == AIRDROP_TOKENS, "Not enough airdrop");
        require(purchased + amount <= AIRDROP_TOKENS + WHITELIST_TOKENS + MAIN_TOKENS, "Main Sale sold out");
        require(msg.value >= PUBLIC_PRICE * amount, "You must pay enough ETH");

        for(uint8 i = 0; i< amount; i++) {
            purchased++;
            fulfillRandom(minter, purchased - 1);
        }
    }

    function buyWithWools(uint16 amount) public {
        address minter = _msgSender();
        require(eggsSaleFlag && !mainSaleFlag, "Wools Sale hasn't started yet");
        require(tx.origin == minter, "Contracts not allowed");
        require(amount > 0 && amount <= 10, "Max 10 mints per tx");
        require(purchased > AIRDROP_TOKENS + WHITELIST_TOKENS + MAIN_TOKENS, "Eggs sale not active");
        require(purchased + amount <= MAX_TOKENS, "Sold out");
        uint256 price = amount * eggsPrice(amount);
        require(price <= eggs.allowance(minter, address(this)) && price <= eggs.balanceOf(minter), "You need to send enough eggs");
        require(eggs.transferFrom(minter, address(this), price));

        for (uint16 i = 0; i < amount; i++) {
            purchased++;
            fulfillRandom(minter, purchased - 1);
        }
    }

    // Admin
    function setAirdropOrWhitelistUser(TrackerUser[] memory trackerUsers) public onlyOwner {
        for(uint16 i = 0; i< trackerUsers.length; i++) {
            trackers[trackerUsers[i].user].check = trackerUsers[i].check;
            trackers[trackerUsers[i].user].userType = trackerUsers[i].userType;
        }
    }
    function toggleMainSale() public onlyOwner {
        mainSaleFlag = !mainSaleFlag;
    }

    function toogleEggsSale() public onlyOwner {
        eggsSaleFlag = !eggsSaleFlag;
    }

    function withdraw(uint256 amount) external onlyOwner {
        payable(owner()).transfer(amount);
    }
}
