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

// Check for MetaMask specifically
function hasMetaMask() {
    return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
}

// Initialize Web3
async function initWeb3() {
    if (!hasMetaMask()) {
        showStatus('MetaMask not detected. Please install MetaMask extension.', 'error');
        return false;
    }
    
    try {
        web3 = new Web3(window.ethereum);
        
        // Initialize contract
        if (CONTRACT_ADDRESS) {
            contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        }
        
        return true;
    } catch (error) {
        console.error('Web3 initialization error:', error);
        showStatus('Failed to initialize Web3', 'error');
        return false;
    }
}

// Switch to Metis Network
async function switchToMetis() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: METIS_CHAINID }],
        });
        return true;
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
                return true;
            } catch (addError) {
                console.error('Failed to add Metis network:', addError);
                showStatus('Failed to add Metis network', 'error');
                return false;
            }
        }
        console.error('Failed to switch network:', switchError);
        return false;
    }
}

// Connect Wallet
async function connectWallet() {
    try {
        // First ensure Web3 is initialized
        const web3Ready = await initWeb3();
        if (!web3Ready) {
            return;
        }
        
        // Check if MetaMask is locked
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        let currentAccounts = accounts;
        
        // If no accounts, request access
        if (accounts.length === 0) {
            currentAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        }
        
        if (currentAccounts.length === 0) {
            throw new Error('No accounts found. Please unlock MetaMask.');
        }
        
        currentAccount = currentAccounts[0];
        
        // Check network and switch if needed
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const chainIdDecimal = parseInt(chainId, 16);
        
        if (chainIdDecimal !== 1088) {
            showStatus('Switching to Metis network...', 'success');
            const switched = await switchToMetis();
            if (!switched) {
                throw new Error('Failed to switch to Metis network');
            }
        }
        
        // Update UI
        document.getElementById('walletAddress').textContent = 
            currentAccount.slice(0, 6) + '...' + currentAccount.slice(-4);
        
        document.getElementById('connectWallet').style.display = 'none';
        document.getElementById('mintButton').disabled = false;
        
        showStatus('Wallet connected successfully!', 'success');
        
        // Update supply if contract is available
        if (contract) {
            updateSupply();
        }
        
    } catch (error) {
        console.error('Connect error:', error);
        let errorMessage = 'Failed to connect wallet';
        
        if (error.message) {
            errorMessage = error.message;
        } else if (error.code === -32002) {
            errorMessage = 'Please unlock MetaMask';
        } else if (error.code === 4001) {
            errorMessage = 'Connection request rejected';
        }
        
        showStatus(errorMessage, 'error');
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
        let errorMessage = 'Failed to mint NFT';
        
        if (error.message) {
            if (error.message.includes('insufficient funds')) {
                errorMessage = 'Insufficient METIS balance';
            } else if (error.message.includes('User denied')) {
                errorMessage = 'Transaction rejected';
            } else {
                errorMessage = error.message;
            }
        }
        
        showStatus(errorMessage, 'error');
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
    
    if (type === 'success') {
        setTimeout(() => {
            statusEl.style.display = 'none';
        }, 5000);
    }
}

// Event listeners - moved inside load event
// document.getElementById('connectWallet').addEventListener('click', connectWallet);
// document.getElementById('mintButton').addEventListener('click', mintNFT);

// Check for account changes
if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            currentAccount = null;
            document.getElementById('walletAddress').textContent = '';
            document.getElementById('connectWallet').style.display = 'block';
            document.getElementById('mintButton').disabled = true;
        } else if (accounts[0] !== currentAccount) {
            currentAccount = accounts[0];
            document.getElementById('walletAddress').textContent = 
                currentAccount.slice(0, 6) + '...' + currentAccount.slice(-4);
            
            // Check if new account is whitelisted
            if (!isWhitelisted(currentAccount)) {
                showStatus('This address is not whitelisted', 'error');
            }
        }
    });
    
    window.ethereum.on('chainChanged', (chainId) => {
        // Reload the page when chain changes
        window.location.reload();
    });
}

// Initialize on load
window.addEventListener('DOMContentLoaded', async () => {
    console.log('Dusa NFT Minting App loaded');
    console.log('Contract:', CONTRACT_ADDRESS);
    console.log('MetaMask detected:', typeof window.ethereum !== 'undefined');
    
    // Get buttons
    const connectBtn = document.getElementById('connectWallet');
    const mintBtn = document.getElementById('mintButton');
    
    if (connectBtn) {
        connectBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log('Connect button clicked');
            await connectWallet();
        });
    } else {
        console.error('Connect button not found!');
    }
    
    if (mintBtn) {
        mintBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log('Mint button clicked');
            await mintNFT();
        });
    } else {
        console.error('Mint button not found!');
    }
    
    // Check for MetaMask
    if (typeof window.ethereum === 'undefined') {
        showStatus('Please install MetaMask to use this dApp', 'error');
    }
});