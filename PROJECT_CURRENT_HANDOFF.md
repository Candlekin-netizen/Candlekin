# CANDLEKIN — PROJECT CURRENT HANDOFF

## Current state

**Phase:** Testnet end-to-end validation / frontend integration  
**Status:** ACTIVE  
**Repository:** `Candlekin-netizen/Candlekin`  
**Working branch:** `preview`

## Locked product shape

- Candlekin: 4,096 ERC-721 NFTs on Robinhood Chain.
- 2,048 Bullkin / 2,048 Bearkin.
- Primary mint execution: OpenSea / canonical SeaDrop.
- Whitelist lifecycle: application → curation → GTD / FCFS / NOT_SELECTED → checker.
- Mint lifecycle: GTD → FCFS → Public.
- Blind / delayed reveal, one-way.
- Genesis Signal is participant identity only and never influences NFT outcome.
- Visual DNA and Market Genome are separate identity layers.
- No token dependency for Candlekin v1.
- Website is the identity / whitelist / collection / Market Lab layer, not the primary mint execution layer.

## Current preview website

The preview branch intentionally exposes the internal lifecycle selector for review. Do not remove it until testnet and lifecycle review are complete. Hide it before final production release.

The expanded Market Lab is loaded through:

```text
vercel.json
  / → /api/page-market
       → /api/page-mint-fixed
       → /api/page
       + market-lab.css
       + market-lab.js
       + site-polish.css
       + site-polish.js
```

`site-polish.js` owns the current Docs page, official X navigation, wording cleanup and preview-safe project documentation.

Official X profile:

```text
https://x.com/Candlekin
```

## Backend / whitelist

Supabase applications are authoritative for whitelist application status.

Statuses:

```text
PENDING
GTD
FCFS
NOT_SELECTED
```

`/api/apply` handles live applications and `/api/check` handles the Allocation Checker.

GTD and FCFS are mutually exclusive. Public is a mint stage, not a whitelist status.

## Testnet contract

```text
Network: Robinhood Chain Testnet
Chain ID: 46630
Contract: 0x3D8A54bdee95791D4AE9D9D5163bf6ddA3c607f8
Canonical SeaDrop: 0x00005EA00Ac477B1030CE78506496e8C2dE24bf5
```

Contract source SHA-256:

```text
7d2ed352c45145319cecefea2af2d8b345023236ae3855b27c0f90ce2546952f
```

Completed:

- Phase 0 preflight PASS
- Phase 1/2 build + 19/19 tests PASS
- Phase 3 deployment + verification PASS
- Phase 3.5 gas reconciliation PASS
- Phase 4 real sealed SeaDrop mint PASS
- Phase 4.5 hidden metadata correction PASS
- Phase 5 reveal PASS

Current state after Phase 5 checkpoint:

```text
totalSupply = 2
revealed = true
tokenURI(1) → final /1.json
tokenURI(2) → final /2.json
```

This supply value is a checkpoint and will change during the next mint test.

## Important metadata note

The deployed testnet contract's initial constructor hidden URI used the old hidden metadata. It was corrected onchain before reveal via `setHiddenMetadataURI()`.

Before mainnet deployment, update the source constructor default to the corrected hidden metadata URI and re-run the full test suite. Do not redeploy testnet only for that constructor-default correction.

Do not publish final metadata/IPFS mapping as public website documentation before the intended mainnet reveal.

## Next active task

**Phase 6 — browser / non-owner mint validation.**

Preferred path:

1. Owner/agent re-opens a minimal Public test stage on canonical SeaDrop.
2. Do not let the agent mint the next token.
3. Preview website exposes an internal testnet mint harness.
4. User connects a non-owner wallet in the browser.
5. User mints through canonical SeaDrop.
6. Verify the newly minted token is owned by that wallet and immediately resolves final metadata because the contract is already revealed.
7. Verify My Candlekin / Market Lab reads the connected wallet correctly.

After that, validate price reconfiguration and GTD / FCFS allowlists.

## Mainnet gate

Mainnet is NOT authorized yet.

Before mainnet:

- browser non-owner mint PASS;
- GTD / FCFS allowlist PASS;
- live price update PASS;
- update corrected initial hidden metadata URI in source;
- final production owner / treasury / royalty decisions;
- final SeaDrop stage parameters;
- final frontend production cleanup;
- hide internal lifecycle controls;
- publish canonical contract and OpenSea link only after verification.
