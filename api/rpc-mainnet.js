const { rpcUrl, assertMainnet } = require('../lib/mainnet');

const ALLOWED = new Set([
  'web3_clientVersion','net_version','eth_chainId','eth_blockNumber','eth_getBalance',
  'eth_getBlockByNumber','eth_getBlockByHash','eth_getTransactionByHash','eth_getTransactionReceipt',
  'eth_getTransactionCount','eth_call','eth_estimateGas','eth_gasPrice','eth_feeHistory',
  'eth_maxPriorityFeePerGas','eth_getCode','eth_getStorageAt','eth_getLogs','eth_sendRawTransaction'
]);

const cors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
};

const fail = (res, status, message) => {
  cors(res);
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32000, message } }));
};

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return fail(res, 405, 'METHOD_NOT_ALLOWED');
  }

  const upstream = rpcUrl();
  if (!upstream) return fail(res, 503, 'MAINNET_RPC_NOT_CONFIGURED');

  const payload = req.body;
  const calls = Array.isArray(payload) ? payload : [payload];
  if (!calls.length || calls.length > 100) return fail(res, 400, 'INVALID_RPC_BATCH');
  if (calls.some(call => !call || typeof call.method !== 'string' || !ALLOWED.has(call.method))) {
    return fail(res, 403, 'RPC_METHOD_NOT_ALLOWED');
  }

  try {
    await assertMainnet();
    const response = await fetch(upstream, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await response.text();
    res.statusCode = response.ok ? 200 : 502;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(text || JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32000, message: 'EMPTY_RPC_RESPONSE' } }));
  } catch (error) {
    console.error('Mainnet RPC proxy failed', error?.code || error?.message || error);
    if (error?.code === 'WRONG_MAINNET_RPC_CHAIN') return fail(res, 503, 'WRONG_MAINNET_RPC_CHAIN');
    return fail(res, 502, 'RPC_UPSTREAM_FAILED');
  }
};
