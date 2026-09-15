const CHAIN_ID = 4663;
const CONTRACT = '0x1422F37Cdc2a845B9dB8b5D4faDf9C6AFA1d3A50';
const DEPLOY_BLOCK = 63808786;
const SEADROP = '0x00005EA00Ac477B1030CE78506496e8C2dE24bf5';

const rpcUrl = () => process.env.ROBINHOOD_MAINNET_RPC || process.env.ALCHEMY_ROBINHOOD_MAINNET_RPC || '';

async function rawRpc(method, params = []) {
  const url = rpcUrl();
  if (!url) {
    const error = new Error('MAINNET_RPC_NOT_CONFIGURED');
    error.code = 'MAINNET_RPC_NOT_CONFIGURED';
    throw error;
  }
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params })
  });
  const body = await response.json().catch(() => null);
  if (!response.ok || !body || body.error) {
    const error = new Error(body?.error?.message || `RPC_${response.status}`);
    error.code = 'RPC_FAILED';
    throw error;
  }
  return body.result;
}

let verifiedAt = 0;
async function assertMainnet() {
  if (Date.now() - verifiedAt < 60_000) return true;
  const chain = await rawRpc('eth_chainId');
  if (!chain || Number(BigInt(chain)) !== CHAIN_ID) {
    const error = new Error('WRONG_MAINNET_RPC_CHAIN');
    error.code = 'WRONG_MAINNET_RPC_CHAIN';
    throw error;
  }
  verifiedAt = Date.now();
  return true;
}

async function rpc(method, params = []) {
  if (method !== 'eth_chainId') await assertMainnet();
  return rawRpc(method, params);
}

async function rpcBatch(calls) {
  await assertMainnet();
  const url = rpcUrl();
  const payload = calls.map((call, index) => ({
    jsonrpc: '2.0',
    id: index + 1,
    method: call.method,
    params: call.params || []
  }));
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const body = await response.json().catch(() => null);
  if (!response.ok || !Array.isArray(body)) {
    const error = new Error(`RPC_BATCH_${response.status}`);
    error.code = 'RPC_FAILED';
    throw error;
  }
  const byId = new Map(body.map(item => [item.id, item]));
  return payload.map(item => {
    const result = byId.get(item.id);
    if (!result || result.error) return { error: result?.error?.message || 'RPC_BATCH_ITEM_FAILED' };
    return { result: result.result };
  });
}

module.exports = { CHAIN_ID, CONTRACT, DEPLOY_BLOCK, SEADROP, rpcUrl, assertMainnet, rpc, rpcBatch };
