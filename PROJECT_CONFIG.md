# PROJECT CONFIG — CANDLEKIN

## Identity

PROJECT_NAME: `Candlekin`  
COLLECTION_TYPE: `ERC-721 NFT collection`  
ART_STYLE: `hard-pixel modular candlestick characters`  
CHAIN: `Robinhood Chain`  
MAX_SUPPLY: `4096` — LOCKED  
BULLKIN_SUPPLY: `2048` — LOCKED  
BEARKIN_SUPPLY: `2048` — LOCKED

## Product lifecycle

```text
WHITELIST_OPEN
→ WHITELIST_CLOSED
→ CURATION_ADMIN
→ CHECKER_OPEN
→ GTD_MINT
→ FCFS_MINT
→ PUBLIC_MINT
→ SOLD_OUT
→ REVEALED
```

Whitelist statuses:

```text
PENDING / GTD / FCFS / NOT_SELECTED
```

Rules:
- GTD and FCFS are mutually exclusive.
- Public is a mint stage, not an application outcome.
- NOT_SELECTED can still mint during Public.
- Website Allocation Checker reports application allocation; SeaDrop / OpenSea is the authoritative mint execution layer.

## Identity systems

VISUAL_DNA: `appearance / artwork traits` — LOCKED  
GENESIS_SIGNAL: `whitelist participant identity only` — LOCKED  
MARKET_GENOME: `separate post-Reveal collectible identity / lore` — LOCKED role

Genesis Signal:
- 6 questions × 4 choices;
- 2 bits per answer;
- 12-bit display as `4-4-4`;
- must not influence whitelist tier, token ID, family, artwork, rarity, Visual DNA, or Market Genome.

Market Genome current product model:

```text
MMMM VVVV CCCC
Momentum   4 bits / 0–15
Volatility 4 bits / 0–15
Conviction 4 bits / 0–15
```

Market Genome is not a live market signal, prediction, performance probability, financial advice, or rarity ranking.

FINAL_GENOME_ASSIGNMENT: `TBD / NOT YET FROZEN`

## Artwork / traits

Public Visual DNA categories:
1. Background
2. Head
3. Body
4. Body Accessory
5. Glasses
6. Special Trait

Production art source: approved PNG generator output.  
Final supply artwork: generated and uploaded to IPFS.  
Final token metadata: generated, shuffled, validated and uploaded to IPFS.

Do not expose final token↔art mapping through public website docs before intended mainnet Reveal.

## Mint architecture

PRIMARY_MINT_EXECUTION: `OpenSea / canonical SeaDrop` — LOCKED  
TOKEN_CONTRACT_ROLE: `ownership + hard cap + metadata + reveal` — LOCKED  
SEADROP_ROLE: `GTD / FCFS / Public configuration + price + timing + wallet limits + allowlists + payout` — LOCKED

Rules:
- no duplicate public mint implementation in Candlekin;
- `mintSeaDrop` only accepts the canonical SeaDrop;
- max supply permanently fixed at 4,096;
- website does not hard-code or promise stage price;
- stage price/timing/limits are authoritative in SeaDrop / OpenSea configuration.

## Reveal

REVEAL_MODEL: `blind / delayed` — LOCKED  
REVEAL_DIRECTION: `SEALED → REVEALED, one-way` — LOCKED  
TOKEN_CONTINUITY: `same contract / token ID / owner` — LOCKED

Before Reveal:
- all minted token IDs resolve to one shared hidden metadata URI.

After Reveal:

```text
tokenURI(N) = finalBaseURI + N + ".json"
```

Metadata setters are owner-only while sealed and locked after Reveal.

## Contract

AUTHORITATIVE_SOURCE_SHA256:

```text
7d2ed352c45145319cecefea2af2d8b345023236ae3855b27c0f90ce2546952f
```

Implementation:
- Solidity 0.8.17
- ERC721A
- `INonFungibleSeaDropToken`
- IERC2981 support
- `MAX_SUPPLY = 4096`
- token IDs start at 1
- two-step ownership
- canonical SeaDrop guard
- owner-controlled one-way reveal
- metadata correction only while sealed
- no public / owner mint bypass

### Robinhood Chain Testnet

```text
Chain ID: 46630
RPC: https://rpc.testnet.chain.robinhood.com
Explorer: https://explorer.testnet.chain.robinhood.com
Candlekin: 0x3D8A54bdee95791D4AE9D9D5163bf6ddA3c607f8
Canonical SeaDrop: 0x00005EA00Ac477B1030CE78506496e8C2dE24bf5
```

Testnet validation through Phase 5: PASS.

Checkpoint after Phase 5:

```text
totalSupply = 2
revealed = true
```

This is a temporary validation checkpoint, not a production supply state.

MAINNET_CONTRACT: `NOT DEPLOYED`  
MAINNET_CHAIN_ID: `4663 — DO NOT TOUCH WITHOUT EXPLICIT APPROVAL`

## Market Lab

ROLE: `post-Reveal NFT identity explorer`  
FEATURES:
- Genome Decoder
- Genome Anatomy
- Momentum / Volatility / Conviction
- Market Profile
- Compare Candlekin
- Genome Share
- Genome Atlas / 4,096-state space

Percentages visualize position inside an identity axis, not market probabilities.

## Frontend

HOSTING: `Vercel`  
PRODUCTION_DOMAIN: `https://candlekin.xyz`  
WORKING_BRANCH: `preview`  
PRODUCTION_BRANCH: `main`

Preview root route:

```text
/ → /api/page-market
```

Render chain:

```text
page-market
→ page-mint-fixed
→ page
→ index.html
+ market-lab.css / market-lab.js
+ site-polish.css / site-polish.js
```

Preview keeps `LIFECYCLE // INTERNAL` visible until testnet/lifecycle review is complete. Final production must hide it.

## Whitelist backend

DATABASE: `Supabase`  
APPLICATION_API: `/api/apply`  
CHECKER_API: `/api/check`

Application fields include X username, EVM wallet, six calibration answers, Genesis Signal and shared X post URL.

## Official links

WEBSITE: `https://candlekin.xyz`  
X_PROFILE: `https://x.com/Candlekin`  
OPENSea_DROP: `NOT PUBLISHED YET`  
MAINNET_EXPLORER: `NOT PUBLISHED YET`

## Remaining production gates

1. Phase 6 non-owner browser mint through preview website.
2. Post-reveal mint verification.
3. Live SeaDrop price update verification.
4. GTD / FCFS allowlist verification.
5. Update constructor default to corrected hidden metadata URI before mainnet.
6. Final production owner / treasury / royalty configuration.
7. Final Market Genome assignment lock.
8. Final frontend cleanup and internal-control removal.
9. Mainnet deployment only after explicit approval.
