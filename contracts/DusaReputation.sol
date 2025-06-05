// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

interface IDusaNFT {
    function ownerOf(uint256 tokenId) external view returns (address);
    function totalSupply() external view returns (uint256);
}

contract DusaReputation is Ownable, Pausable {
    // NFT contract reference
    IDusaNFT public immutable dusaNFT;
    
    // XP Categories
    struct Reputation {
        uint256 alignXP;      // Alignment with values/missions
        uint256 actionXP;     // Actions taken/completed
        uint256 karmaXP;      // Good deeds and positive impact
        uint256 synergyXP;    // Collaboration and teamwork
        uint256 totalXP;
        uint256 level;
        uint256 lastUpdated;
    }
    
    // Mappings
    mapping(uint256 => Reputation) public tokenReputation;
    mapping(address => bool) public xpManagers;
    
    // Events
    event XPUpdated(
        uint256 indexed tokenId,
        uint256 alignXP,
        uint256 actionXP,
        uint256 karmaXP,
        uint256 synergyXP
    );
    
    event LevelUp(uint256 indexed tokenId, uint256 newLevel);
    event ManagerUpdated(address indexed manager, bool status);
    
    // Constants
    uint256 public constant XP_PER_LEVEL = 1000;
    uint256 public constant MAX_LEVEL = 100;
    
    constructor(address _nftContract) {
        dusaNFT = IDusaNFT(_nftContract);
        xpManagers[msg.sender] = true;
    }
    
    modifier onlyManager() {
        require(xpManagers[msg.sender], "Not an XP manager");
        _;
    }
    
    modifier validToken(uint256 tokenId) {
        require(dusaNFT.ownerOf(tokenId) != address(0), "Token does not exist");
        _;
    }
    
    // Admin functions
    function setManager(address manager, bool status) external onlyOwner {
        xpManagers[manager] = status;
        emit ManagerUpdated(manager, status);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // XP Management
    function updateXP(
        uint256 tokenId,
        uint256 alignXP,
        uint256 actionXP,
        uint256 karmaXP,
        uint256 synergyXP
    ) external onlyManager whenNotPaused validToken(tokenId) {
        Reputation storage rep = tokenReputation[tokenId];
        
        rep.alignXP += alignXP;
        rep.actionXP += actionXP;
        rep.karmaXP += karmaXP;
        rep.synergyXP += synergyXP;
        
        uint256 oldTotal = rep.totalXP;
        rep.totalXP = rep.alignXP + rep.actionXP + rep.karmaXP + rep.synergyXP;
        
        // Calculate new level
        uint256 oldLevel = rep.level;
        rep.level = rep.totalXP / XP_PER_LEVEL;
        if (rep.level > MAX_LEVEL) {
            rep.level = MAX_LEVEL;
        }
        
        rep.lastUpdated = block.timestamp;
        
        emit XPUpdated(tokenId, alignXP, actionXP, karmaXP, synergyXP);
        
        if (rep.level > oldLevel) {
            emit LevelUp(tokenId, rep.level);
        }
    }
    
    // Batch update for efficiency
    function batchUpdateXP(
        uint256[] calldata tokenIds,
        uint256[] calldata alignXPs,
        uint256[] calldata actionXPs,
        uint256[] calldata karmaXPs,
        uint256[] calldata synergyXPs
    ) external onlyManager whenNotPaused {
        require(
            tokenIds.length == alignXPs.length &&
            tokenIds.length == actionXPs.length &&
            tokenIds.length == karmaXPs.length &&
            tokenIds.length == synergyXPs.length,
            "Array length mismatch"
        );
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (dusaNFT.ownerOf(tokenIds[i]) != address(0)) {
                Reputation storage rep = tokenReputation[tokenIds[i]];
                
                rep.alignXP += alignXPs[i];
                rep.actionXP += actionXPs[i];
                rep.karmaXP += karmaXPs[i];
                rep.synergyXP += synergyXPs[i];
                
                rep.totalXP = rep.alignXP + rep.actionXP + rep.karmaXP + rep.synergyXP;
                
                uint256 oldLevel = rep.level;
                rep.level = rep.totalXP / XP_PER_LEVEL;
                if (rep.level > MAX_LEVEL) {
                    rep.level = MAX_LEVEL;
                }
                
                rep.lastUpdated = block.timestamp;
                
                emit XPUpdated(tokenIds[i], alignXPs[i], actionXPs[i], karmaXPs[i], synergyXPs[i]);
                
                if (rep.level > oldLevel) {
                    emit LevelUp(tokenIds[i], rep.level);
                }
            }
        }
    }
    
    // View functions
    function getReputation(uint256 tokenId) external view returns (Reputation memory) {
        return tokenReputation[tokenId];
    }
    
    function getLevel(uint256 tokenId) external view returns (uint256) {
        return tokenReputation[tokenId].level;
    }
    
    function getTotalXP(uint256 tokenId) external view returns (uint256) {
        return tokenReputation[tokenId].totalXP;
    }
    
    // Get XP by category
    function getAlignXP(uint256 tokenId) external view returns (uint256) {
        return tokenReputation[tokenId].alignXP;
    }
    
    function getActionXP(uint256 tokenId) external view returns (uint256) {
        return tokenReputation[tokenId].actionXP;
    }
    
    function getKarmaXP(uint256 tokenId) external view returns (uint256) {
        return tokenReputation[tokenId].karmaXP;
    }
    
    function getSynergyXP(uint256 tokenId) external view returns (uint256) {
        return tokenReputation[tokenId].synergyXP;
    }
    
    // Leaderboard support
    function getTopTokensByTotalXP(uint256 limit) external view returns (uint256[] memory, uint256[] memory) {
        uint256 totalSupply = dusaNFT.totalSupply();
        if (limit > totalSupply) limit = totalSupply;
        
        uint256[] memory tokenIds = new uint256[](limit);
        uint256[] memory xpValues = new uint256[](limit);
        
        // Simple implementation - in production, use more efficient sorting
        for (uint256 i = 0; i < totalSupply; i++) {
            uint256 currentXP = tokenReputation[i].totalXP;
            
            for (uint256 j = 0; j < limit; j++) {
                if (currentXP > xpValues[j]) {
                    // Shift array
                    for (uint256 k = limit - 1; k > j; k--) {
                        tokenIds[k] = tokenIds[k - 1];
                        xpValues[k] = xpValues[k - 1];
                    }
                    tokenIds[j] = i;
                    xpValues[j] = currentXP;
                    break;
                }
            }
        }
        
        return (tokenIds, xpValues);
    }
    
    // Metadata URI for dynamic updates
    function tokenURI(uint256 tokenId) external view returns (string memory) {
        Reputation memory rep = tokenReputation[tokenId];
        
        // In production, this would return a link to your metadata API
        // For now, return a data URI with the reputation info
        return string(abi.encodePacked(
            "data:application/json;base64,",
            "eyJuYW1lIjogIkR1c2EgTkZUIiwgImxldmVsIjogIiwgfQ==" // Base64 encoded JSON
        ));
    }
}