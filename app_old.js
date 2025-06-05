// Metis Andromeda Network Configuration
const METIS_CHAINID = '0x440'; // 1088 in hex
const METIS_RPC = 'https://andromeda.metis.io/?owner=1088';
const CONTRACT_ADDRESS = '0x5C30e1552d37d3e119dAC4Fc4e364258f8809Bd8'; // Your deployed contract!
const METADATA_URI = 'ipfs://bafkreiazyhrirhlyeyxkvw7kukkcts2glji5vryobbqdcnnmz2otkvyjk4'; // Metadata uploaded!

// Whitelist addresses (add addresses that can mint)
const WHITELIST = [
    '0x6Cb5365ADfC0fdFc2aD7C02151A04e9f0F9eBeCA', // Your address
    // Add more addresses here
];

// Contract ABI (simplified for minting)
const CONTRACT_ABI = [
    {
        "inputs": [
            {"internalType": "address", "name": "to", "type": "address"},
            {"internalType": "string", "name": "uri", "type": "string"}
        ],
        "name": "safeMint",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "mintPrice",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "mintingEnabled",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    }
];

let web3;
let contract;
let currentAccount;

// Initialize Web3
async function initWeb3() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            web3 = new Web3(window.ethereum);
            
            // Initialize contract
            if (CONTRACT_ADDRESS) {
                contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
            }
        } catch (error) {
            console.error('Web3 init error:', error);
            showStatus('Failed to initialize Web3', 'error');
        }
    } else {
        showStatus('Please install MetaMask to mint NFTs', 'error');
    }
}

// Switch to Metis Network
async function switchToMetis() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: METIS_CHAINID }],
        });
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: METIS_CHAINID,
                        chainName: 'Metis Andromeda Mainnet',
                        nativeCurrency: {
                            name: 'Metis',
                            symbol: 'METIS',
                            decimals: 18
                        },
                        rpcUrls: [METIS_RPC],
                        blockExplorerUrls: ['https://andromeda-explorer.metis.io/']
                    }],
                });
            } catch (addError) {
                showStatus('Failed to add Metis network', 'error');
            }
        }
    }
}

// Connect Wallet
async function connectWallet() {
    try {
        // Request accounts
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts.length === 0) {
            throw new Error('No accounts found');
        }
        
        currentAccount = accounts[0];
        
        // Check network and switch if needed
        const chainId = await web3.eth.getChainId();
        if (chainId !== 1088) {
            await switchToMetis();
        }
        
        document.getElementById('walletAddress').textContent = 
            currentAccount.slice(0, 6) + '...' + currentAccount.slice(-4);
        
        document.getElementById('connectWallet').style.display = 'none';
        document.getElementById('mintButton').disabled = false;
        
        // Initialize contract after connection
        if (!contract && CONTRACT_ADDRESS) {
            contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        }
        
        updateSupply();
    } catch (error) {
        console.error('Connect error:', error);
        showStatus('Failed to connect wallet: ' + error.message, 'error');
    }
}

// Update supply display
async function updateSupply() {
    if (contract) {
        try {
            const supply = await contract.methods.totalSupply().call();
            document.getElementById('totalSupply').textContent = supply;
        } catch (error) {
            console.error('Failed to get supply:', error);
        }
    }
}

// Check if address is whitelisted
function isWhitelisted(address) {
    return WHITELIST.map(addr => addr.toLowerCase()).includes(address.toLowerCase());
}

// Mint NFT
async function mintNFT() {
    if (!contract || !currentAccount) {
        showStatus('Please connect wallet first', 'error');
        return;
    }
    
    // Check whitelist
    if (!isWhitelisted(currentAccount)) {
        showStatus('Your address is not whitelisted to mint', 'error');
        return;
    }
    
    const mintButton = document.getElementById('mintButton');
    mintButton.disabled = true;
    mintButton.innerHTML = '<span class="loading"></span> Minting...';
    
    try {
        // Check if minting is enabled
        const mintingEnabled = await contract.methods.mintingEnabled().call();
        if (!mintingEnabled) {
            throw new Error('Minting is currently disabled');
        }
        
        // Get mint price
        const mintPrice = await contract.methods.mintPrice().call();
        
        // Send transaction
        const tx = await contract.methods.safeMint(currentAccount, METADATA_URI).send({
            from: currentAccount,
            value: mintPrice
        });
        
        showStatus(`NFT minted successfully! Transaction: ${tx.transactionHash}`, 'success');
        updateSupply();
        
    } catch (error) {
        console.error('Minting error:', error);
        showStatus(error.message || 'Failed to mint NFT', 'error');
    } finally {
        mintButton.disabled = false;
        mintButton.textContent = 'Mint NFT';
    }
}

// Show status message
function showStatus(message, type) {
    const statusEl = document.getElementById('statusMessage');
    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;
    statusEl.style.display = 'block';
    
    setTimeout(() => {
        statusEl.style.display = 'none';
    }, 5000);
}

// Event listeners
document.getElementById('connectWallet').addEventListener('click', connectWallet);
document.getElementById('mintButton').addEventListener('click', mintNFT);

// Check for account changes
if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            currentAccount = null;
            document.getElementById('walletAddress').textContent = '';
            document.getElementById('connectWallet').style.display = 'block';
            document.getElementById('mintButton').disabled = true;
        } else {
            currentAccount = accounts[0];
            document.getElementById('walletAddress').textContent = 
                currentAccount.slice(0, 6) + '...' + currentAccount.slice(-4);
        }
    });
}

// Initialize on load
window.addEventListener('load', initWeb3);