# CANDLEKIN — PROJECT CURRENT HANDOFF

## Current state

**Phase:** Project Bootstrap / Pre-Production Decision Lock  
**Status:** ACTIVE  
**Repository:** `Candlekin-netizen/Candlekin`

## Inputs reviewed

- NFT Project Master Production System v1.1
- Candlekin NFT Master Concept v1
- Candlekin Full Lifecycle Prototype v13

## What is already known

### LOCKED
- Name: Candlekin
- Supply: 4,096
- 2,048 Bullkin / 2,048 Bearkin
- Robinhood Chain
- Hard-pixel modular art direction
- Visual DNA and Market Genome are separate systems
- 12-bit Market Genome concept
- Genesis Signal is participant identity only
- Genesis Signal does not influence NFT outcome
- Whitelist is an application pool
- Final curation outcome is only GTD or Public
- Blind/delayed reveal
- Same NFT / token ID / owner before and after reveal
- 4,096 unique Visual DNA goal
- Approved PNG assets remain production art source
- Collection experience prioritizes My Candlekin over a full 4,096-token RPC gallery

### CURRENT
- GTD = one guaranteed free allocation
- Public mint = 0.0005 ETH
- GTD before Public
- Unclaimed GTD returns to public supply
- 20 solid backgrounds + 6 curated legendary worlds
- Body Accessory 80%
- Glasses 70%
- Body 3 Curved Arms special-trait rule
- 21 special traits
- V6B generator direction
- Market Genome candidate: `MMMM VVVV CCCC`
- Market Profile band model
- Market Lab post-Reveal
- No token dependency for Candlekin v1
- Google Sheets as simple whitelist curation workbench
- Merkle allowlist as current GTD implementation direction

### TBD / NOT LOCKED
- Exact GTD count
- Public wallet limit
- GTD duration
- Public start timing
- Reveal timing
- Final 4/4/4 Market Genome lock
- Final Market Profile vocabulary
- Exact Market Genome assignment algorithm
- Metadata schema
- Collection description
- Image CID
- Metadata CID
- Contract implementation / ABI
- Production RPC / wallet details
- Marketplace / explorer links
- Overall rarity ranking policy
- Genome Atlas release timing

## Prototype classification

`PRESENTATION_REUSABLE`

The existing HTML prototype is useful as a product/visual reference but is not production Web3 code. Mock state must be replaced with authoritative wallet, contract, metadata and application state.

## Current recommendation under discussion

Preserve the 12-bit `MMMM VVVV CCCC` model:

- Momentum: 4 bits / 0–15
- Volatility: 4 bits / 0–15
- Conviction: 4 bits / 0–15

Use a one-to-one **deterministic shuffled assignment** between the 4,096 token IDs and the 4,096 genome states rather than deriving the final production genome directly from token ID.

**Important:** this assignment model is still a recommendation and is not yet marked LOCKED.

## Do not do yet

- Do not deploy a contract.
- Do not freeze metadata.
- Do not freeze final mint configuration.
- Do not publish a final metadata CID.
- Do not treat prototype mock values as production state.
- Do not imply Market Genome assignment is finalized.

## Next active task

**Decision Gate — Market Genome**

Finalize:
1. `MMMM VVVV CCCC` structure;
2. 0–15 axis mapping;
3. percentage display;
4. deterministic shuffled token ↔ genome assignment.

After this gate passes, move to Market Profile vocabulary.
