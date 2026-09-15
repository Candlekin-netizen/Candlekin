const { CONTRACT, DEPLOY_BLOCK, rpc, rpcBatch } = require('./_mainnet');

const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
const OWNER_OF_SELECTOR = '0x6352211e';
const BALANCE_OF_SELECTOR = '0x70a08231';

const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
};

const validAddress = (value) => /^0x[a-fA-F0-9]{40}$/.test(String(value || ''));
const encodeAddress = (address) => String(address).toLowerCase().replace(/^0x/, '').padStart(64, '0');
const encodeUint = (value) => BigInt(value).toString(16).padStart(64, '0');
const decodeUint = (raw) => (!raw || raw === '0x' ? 0 : Number(BigInt(raw)));
const decodeAddress = (raw) => (!raw || raw === '0x' ? '' : `0x${raw.slice(-40).toLowerCase()}`);

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return json(res, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const host = req.headers.host || 'localhost';
    const url = new URL(req.url, `https://${host}`);
    const address = String(url.searchParams.get('address') || '').toLowerCase();
    if (!validAddress(address)) return json(res, 400, { ok: false, error: 'INVALID_ADDRESS' });

    const balanceRaw = await rpc('eth_call', [{
      to: CONTRACT,
      data: BALANCE_OF_SELECTOR + encodeAddress(address)
    }, 'latest']);
    const expectedBalance = decodeUint(balanceRaw);
    if (expectedBalance === 0) return json(res, 200, { ok: true, ids: [], balance: 0, source: 'mainnet-transfer-index' });

    const incomingLogs = await rpc('eth_getLogs', [{
      address: CONTRACT,
      fromBlock: `0x${DEPLOY_BLOCK.toString(16)}`,
      toBlock: 'latest',
      topics: [TRANSFER_TOPIC, null, `0x${encodeAddress(address)}`]
    }]);

    const candidateIds = [...new Set((Array.isArray(incomingLogs) ? incomingLogs : []).map(log => {
      const topic = Array.isArray(log.topics) ? log.topics[3] : null;
      return topic ? Number(BigInt(topic)) : null;
    }).filter(id => Number.isInteger(id) && id > 0))].sort((a, b) => a - b);

    const mine = [];
    const batchSize = 50;
    for (let start = 0; start < candidateIds.length; start += batchSize) {
      const ids = candidateIds.slice(start, start + batchSize);
      const results = await rpcBatch(ids.map(id => ({
        method: 'eth_call',
        params: [{ to: CONTRACT, data: OWNER_OF_SELECTOR + encodeUint(id) }, 'latest']
      })));
      results.forEach((entry, index) => {
        if (!entry.error && decodeAddress(entry.result) === address) mine.push(ids[index]);
      });
    }

    mine.sort((a, b) => a - b);
    if (mine.length !== expectedBalance) {
      console.error('Ownership index mismatch', { address, expectedBalance, resolved: mine.length, candidates: candidateIds.length });
      return json(res, 502, { ok: false, error: 'OWNERSHIP_INDEX_MISMATCH' });
    }

    return json(res, 200, {
      ok: true,
      ids: mine,
      balance: expectedBalance,
      source: 'mainnet-transfer-index'
    });
  } catch (error) {
    console.error('Owned tokens lookup failed', error?.code || error?.message || error);
    if (error?.code === 'MAINNET_RPC_NOT_CONFIGURED') {
      return json(res, 503, { ok: false, error: 'MAINNET_RPC_NOT_CONFIGURED' });
    }
    if (error?.code === 'WRONG_MAINNET_RPC_CHAIN') {
      return json(res, 503, { ok: false, error: 'WRONG_MAINNET_RPC_CHAIN' });
    }
    return json(res, 502, { ok: false, error: 'OWNERSHIP_LOOKUP_FAILED' });
  }
};
