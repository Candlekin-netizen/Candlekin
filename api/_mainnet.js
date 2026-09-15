const CHAIN_ID = 4663;
const CONTRACT = '0x1422F37Cdc2a845B9dB8b5D4faDf9C6AFA1d3A50';
const DEPLOY_BLOCK = 63808786;
const SEADROP = '0x00005EA00Ac477B1030CE78506496e8C2dE24bf5';

const rpcUrl = () => process.env.ROBINHOOD_MAINNET_RPC || process.env.ALCHEMY_ROBINHOOD_MAINNET_RPC || '';

async function rpc(method, params = []) {
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

async function rpcBatch(calls) {
  const url = rpcUrl();
  if (!url) {
    const error = new Error('MAINNET_RPC_NOT_CONFIGURED');
    error.code = 'MAINNET_RPC_NOT_CONFIGURED';
    throw error;
  }
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

module.exports = { CHAIN_ID, CONTRACT, DEPLOY_BLOCK, SEADROP, rpcUrl, rpc, rpcBatch };
