import { createAppKit } from 'https://esm.sh/@reown/appkit@1.8.23?bundle';
import { WagmiAdapter } from 'https://esm.sh/@reown/appkit-adapter-wagmi@1.8.23?bundle';
import { defineChain } from 'https://esm.sh/@reown/appkit@1.8.23/networks?bundle';

const PROJECT_ID = '4f90a2c28605fc9b93f3b2b9bb2cb71f';
const MAINNET_ID = 4663;
const MAINNET_CAIP = `eip155:${MAINNET_ID}`;
const MAINNET_RPC = `${window.location.origin}/api/rpc-mainnet`;

const robinhoodMainnet = defineChain({
  id: MAINNET_ID,
  caipNetworkId: MAINNET_CAIP,
  chainNamespace: 'eip155',
  name: 'Robinhood Chain',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: [MAINNET_RPC]
    }
  },
  blockExplorers: {
    default: {
      name: 'Robinhood Chain Explorer',
      url: 'https://robinhoodchain.blockscout.com'
    }
  },
  testnet: false
});

const networks = [robinhoodMainnet];
const wagmiAdapter = new WagmiAdapter({
  projectId: PROJECT_ID,
  networks
});

const metadata = {
  name: 'Candlekin',
  description: 'Candlekin — 4,096 market-born identities on Robinhood Chain.',
  url: window.location.origin,
  icons: ['https://res.cloudinary.com/lqk65ybn/image/upload/v1788090258/ChatGPT_Image_Aug_24_2026_11_44_38_AM.png']
};

const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  defaultNetwork: robinhoodMainnet,
  metadata,
  projectId: PROJECT_ID,
  themeMode: 'dark',
  themeVariables: {
    '--apkt-accent': '#ccff00',
    '--apkt-color-mix': '#07101a',
    '--apkt-color-mix-strength': 34,
    '--apkt-font-family': 'Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
    '--apkt-border-radius-master': '10px',
    '--apkt-z-index': 110000
  },
  features: {
    analytics: true,
    email: false,
    socials: [],
    swaps: false,
    onramp: false
  },
  enableWalletGuide: false,
  allWallets: 'SHOW'
});

let syncing = false;
let lastProvider = null;
let localDisconnect = window.disconnectWallet;

async function handoffProvider(provider, address) {
  if (!provider || !address || syncing) return;
  syncing = true;
  try {
    lastProvider = provider;
    const walletInfo = appKit.getWalletInfo?.() || {};
    window.CandlekinWalletProvider?.select({
      provider,
      info: {
        name: walletInfo.name || 'WalletConnect',
        icon: walletInfo.icon || '',
        rdns: 'walletconnect.reown'
      }
    });
    if (typeof window.CandlekinLegacyWalletConnect === 'function') {
      await window.CandlekinLegacyWalletConnect();
    }
    appKit.close?.();
  } catch (error) {
    console.error('[Candlekin AppKit handoff]', error);
  } finally {
    syncing = false;
  }
}

appKit.subscribeProvider?.(({ provider, address, chainId, isConnected }) => {
  if (isConnected && provider && address) {
    if (Number(chainId) !== MAINNET_ID) {
      appKit.switchNetwork?.(robinhoodMainnet).catch?.(() => {});
    }
    if (provider !== lastProvider || String(address).toLowerCase() !== String(window.state?.walletAddress || '').toLowerCase()) {
      handoffProvider(provider, address);
    }
    return;
  }
  if (!isConnected && lastProvider) {
    lastProvider = null;
    window.CandlekinWalletProvider?.clear?.();
    if (typeof localDisconnect === 'function' && window.state?.walletConnected) localDisconnect();
  }
});

window.CandlekinAppKit = {
  ready: true,
  instance: appKit,
  network: robinhoodMainnet,
  async open() {
    return appKit.open({ view: 'Connect', namespace: 'eip155' });
  },
  async openAccount() {
    return appKit.open({ view: 'Account' });
  },
  async disconnect() {
    return appKit.adapter?.connectionControllerClient?.disconnect?.();
  },
  isConnected() {
    return !!appKit.getIsConnected?.();
  },
  getProvider() {
    return appKit.getWalletProvider?.();
  },
  getAddress() {
    return appKit.getAddress?.();
  }
};

if (typeof localDisconnect === 'function') {
  window.disconnectWallet = async function() {
    try {
      if (window.CandlekinAppKit?.isConnected()) await window.CandlekinAppKit.disconnect();
    } catch (error) {
      console.warn('[Candlekin AppKit disconnect]', error);
    } finally {
      localDisconnect();
    }
  };
}

window.dispatchEvent(new CustomEvent('candlekin:appkit-ready'));
