// Configuration
const CONTRACT_ADDRESS = '0x5C30e1552d37d3e119dAC4Fc4e364258f8809Bd8';
const OWNER_ADDRESS = '0x6Cb5365ADfC0fdFc2aD7C02151A04e9f0F9eBeCA'; // Your address

// Contract ABI
const CONTRACT_ABI = [
    {
        "inputs": [],
        "name": "owner",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
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
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_newPrice", "type": "uint256"}],
        "name": "setMintPrice",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "bool", "name": "_enabled", "type": "bool"}],
        "name": "setMintingEnabled",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

let web3;
let contract;
let currentAccount;

// Whitelist stored locally (in production, use a database)
let whitelist = [
    '0x6Cb5365ADfC0fdFc2aD7C02151A04e9f0F9eBeCA' // Owner address
];

// Initialize
window.addEventListener('DOMContentLoaded', async () => {
    await initializeWeb3();
    await checkAdminStatus();
    loadWhitelist();
    updateStats();
    
    // Set up toggle listener
    document.getElementById('mintingToggle').addEventListener('change', toggleMinting);
});

async function initializeWeb3() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
            
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            currentAccount = accounts[0];
            
            // Check network
            const chainId = await web3.eth.getChainId();
            if (chainId !== 1088) {
                await switchToMetis();
            }
            
        } catch (error) {
            console.error('Web3 init error:', error);
            showStatus('Failed to connect to MetaMask', 'error');
        }
    } else {
        showStatus('Please install MetaMask', 'error');
    }
}

async function switchToMetis() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x440' }],
        });
    } catch (switchError) {
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x440',
                        chainName: 'Metis Andromeda Mainnet',
                        nativeCurrency: {
                            name: 'Metis',
                            symbol: 'METIS',
                            decimals: 18
                        },
                        rpcUrls: ['https://andromeda.metis.io/?owner=1088'],
                        blockExplorerUrls: ['https://andromeda-explorer.metis.io/']
                    }],
                });
            } catch (addError) {
                console.error('Failed to add Metis network:', addError);
            }
        }
    }
}

async function checkAdminStatus() {
    const adminStatus = document.getElementById('adminStatus');
    const walletInfo = document.getElementById('walletInfo');
    
    if (!currentAccount) {
        adminStatus.textContent = 'Wallet not connected';
        adminStatus.className = 'admin-status error';
        return;
    }
    
    walletInfo.textContent = `Connected: ${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}`;
    
    try {
        const contractOwner = await contract.methods.owner().call();
        if (currentAccount.toLowerCase() === contractOwner.toLowerCase()) {
            adminStatus.textContent = '✅ Admin Access Confirmed';
            adminStatus.className = 'admin-status success';
        } else {
            adminStatus.textContent = '❌ Not Contract Owner';
            adminStatus.className = 'admin-status error';
            disableAdminControls();
        }
    } catch (error) {
        console.error('Failed to check owner:', error);
    }
}

async function updateStats() {
    if (!contract) return;
    
    try {
        // Get total supply
        const totalSupply = await contract.methods.totalSupply().call();
        document.getElementById('totalSupply').textContent = totalSupply;
        
        // Get mint price
        const mintPrice = await contract.methods.mintPrice().call();
        document.getElementById('mintPrice').textContent = `${web3.utils.fromWei(mintPrice, 'ether')} METIS`;
        
        // Get minting status
        const mintingEnabled = await contract.methods.mintingEnabled().call();
        document.getElementById('mintingToggle').checked = mintingEnabled;
        
        // Get contract balance
        const balance = await web3.eth.getBalance(CONTRACT_ADDRESS);
        document.getElementById('contractBalance').textContent = `${web3.utils.fromWei(balance, 'ether')} METIS`;
        
    } catch (error) {
        console.error('Failed to update stats:', error);
    }
}

async function toggleMinting() {
    const enabled = document.getElementById('mintingToggle').checked;
    
    try {
        const tx = await contract.methods.setMintingEnabled(enabled).send({ from: currentAccount });
        showStatus(`Minting ${enabled ? 'enabled' : 'disabled'} successfully!`, 'success');
        updateStats();
    } catch (error) {
        console.error('Toggle minting error:', error);
        showStatus('Failed to toggle minting', 'error');
        // Revert toggle
        document.getElementById('mintingToggle').checked = !enabled;
    }
}

async function updateMintPrice() {
    const newPrice = document.getElementById('newMintPrice').value;
    if (!newPrice || newPrice <= 0) {
        showStatus('Please enter a valid price', 'error');
        return;
    }
    
    try {
        const priceWei = web3.utils.toWei(newPrice, 'ether');
        const tx = await contract.methods.setMintPrice(priceWei).send({ from: currentAccount });
        showStatus('Mint price updated successfully!', 'success');
        document.getElementById('newMintPrice').value = '';
        updateStats();
    } catch (error) {
        console.error('Update price error:', error);
        showStatus('Failed to update mint price', 'error');
    }
}

async function withdrawFunds() {
    try {
        const tx = await contract.methods.withdraw().send({ from: currentAccount });
        showStatus('Funds withdrawn successfully!', 'success');
        updateStats();
    } catch (error) {
        console.error('Withdraw error:', error);
        showStatus('Failed to withdraw funds', 'error');
    }
}

// Whitelist Management (Local Storage)
function loadWhitelist() {
    const saved = localStorage.getItem('dusaNFT_whitelist');
    if (saved) {
        whitelist = JSON.parse(saved);
    }
    updateWhitelistDisplay();
}

function saveWhitelist() {
    localStorage.setItem('dusaNFT_whitelist', JSON.stringify(whitelist));
}

function addToWhitelist() {
    const addressInput = document.getElementById('whitelistAddress');
    const address = addressInput.value.trim();
    
    // Validate address
    if (!web3.utils.isAddress(address)) {
        showStatus('Invalid Ethereum address', 'error');
        return;
    }
    
    // Check if already whitelisted
    if (whitelist.some(addr => addr.toLowerCase() === address.toLowerCase())) {
        showStatus('Address already whitelisted', 'error');
        return;
    }
    
    // Add to whitelist
    whitelist.push(address);
    saveWhitelist();
    updateWhitelistDisplay();
    addressInput.value = '';
    showStatus('Address added to whitelist!', 'success');
}

function removeFromWhitelist(address) {
    whitelist = whitelist.filter(addr => addr.toLowerCase() !== address.toLowerCase());
    saveWhitelist();
    updateWhitelistDisplay();
    showStatus('Address removed from whitelist', 'success');
}

function updateWhitelistDisplay() {
    const container = document.getElementById('whitelistContainer');
    const count = document.getElementById('whitelistCount');
    
    count.textContent = whitelist.length;
    container.innerHTML = '';
    
    whitelist.forEach(address => {
        const item = document.createElement('div');
        item.className = 'whitelist-item';
        item.innerHTML = `
            <span class="whitelist-address">${address}</span>
            <button class="btn danger" onclick="removeFromWhitelist('${address}')">Remove</button>
        `;
        container.appendChild(item);
    });
}

function showStatus(message, type) {
    const statusEl = document.getElementById('statusMessage');
    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;
    statusEl.style.display = 'block';
    
    setTimeout(() => {
        statusEl.style.display = 'none';
    }, 5000);
}

function disableAdminControls() {
    // Disable all admin controls if not owner
    document.querySelectorAll('.btn').forEach(btn => btn.disabled = true);
    document.getElementById('mintingToggle').disabled = true;
    showStatus('Admin access required', 'error');
}

// Export whitelist for app.js
function exportWhitelist() {
    const whitelistCode = `const WHITELIST = ${JSON.stringify(whitelist, null, 4)};`;
    console.log('Copy this to your app.js:');
    console.log(whitelistCode);
    navigator.clipboard.writeText(whitelistCode);
    showStatus('Whitelist copied to clipboard!', 'success');
}