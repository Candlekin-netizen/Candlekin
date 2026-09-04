# PROJECT CONFIG — CANDLEKIN

## Source Inputs

MASTER_VERSION: `NFT PROJECT MASTER PRODUCTION SYSTEM v1.1`  
PROJECT_CONCEPT_SOURCE: `CANDLEKIN — NFT MASTER CONCEPT v1`  
WEBSITE_PROTOTYPE_SOURCE: `Candlekin — Full Lifecycle Prototype v13`  
ARTWORK_SOURCE: V6B generator output / approved PNG assets (not yet committed here)  
PROTOTYPE_CLASSIFICATION: `PRESENTATION_REUSABLE`  
CONCEPT_PROTOTYPE_AUDIT_STATUS: `PASS WITH NON-BLOCKING NOTES`

### Material source notes

- Prototype values and mock functions are not automatically production truth.
- The prototype `genomeFor(tokenId)` function is a demonstration only. Exact production Market Genome assignment remains unresolved.
- Mock wallets, mock applicants, mock checker records, mock owned NFTs and simulated mint state must be replaced by authoritative production state.

## Identity

PROJECT_NAME: `Candlekin`  
COLLECTION_TYPE: `ERC-721 NFT collection`  
ART_STYLE: `hard-pixel modular character collection`  
CORE_THEME: `stock-market candlestick characters / market-state identity`  
CHAIN: `Robinhood Chain`  
NATIVE_MINT_CURRENCY: `ETH`  

## Supply

MAX_SUPPLY: `4096` — LOCKED  
BULLKIN_SUPPLY: `2048` — LOCKED  
BEARKIN_SUPPLY: `2048` — LOCKED  
FAMILY_SPLIT: `50:50` — LOCKED

## Identity Systems

VISUAL_DNA: `appearance / artwork traits` — LOCKED  
MARKET_GENOME: `permanent post-Reveal market identity` — LOCKED concept  
GENESIS_SIGNAL: `whitelist participant identity only` — LOCKED  

Rules:
- Genesis Signal must not determine family, rarity, traits, token ID, final art, Market Genome or mint result.
- Market Genome must not be derived from Visual DNA, rarity or background.
- Wallet / GTD / Public status must not influence final NFT quality or genome.

## Trait Architecture

PUBLIC_TRAIT_CATEGORIES:
1. Background
2. Head
3. Body
4. Body Accessory
5. Glasses
6. Special Trait

RENDER_ORDER_CURRENT:
`Background → Body → Body Accessory → Special Trait → Head → Glasses`

BODY_ACCESSORY_CHANCE_CURRENT: `80%`  
GLASSES_CHANCE_CURRENT: `70%`  
SPECIAL_TRAITS_CURRENT: `21`  
BODY_3_CURVED_ARMS_RULE_CURRENT: `always receives one special trait`

## Background System

TOTAL_BACKGROUND_IDENTITIES_CURRENT: `26`  
SOLID_BACKGROUNDS_CURRENT: `20`  
CURATED_LEGENDARY_WORLDS_CURRENT: `6`

RARITY_DISTRIBUTION_CURRENT:
- Common: 2,048
- Uncommon: 1,024
- Rare: 640
- Epic: 320
- Legendary: 64

## Generator

HISTORICAL_FROZEN_BUILD: `CANDLEKIN_4096_V5_21_SPECIALS`  
HISTORICAL_V5_MANIFEST_SHA256: `6bf094875e8c41b453d8aa9260e63b44817e326787e6392bc0232767f18a1726`  
HISTORICAL_V5_REGISTRY_FINGERPRINT: `e21443ef9525badb3f9a1ebfe6c0dedbb20ee0534753de9184a874e9027ca8cd`

CURRENT_GENERATOR_BUILD: `CANDLEKIN_4096_V6B_SOLID_BG_DRIVE_NAMES_21_SPECIALS`  
CURRENT_GENERATOR_NOTEBOOK: `CANDLEKIN_4096_V6B_SOLID_BG_DRIVE_NAMES_RESUME_SAFE.ipynb`  
CURRENT_SEED: same as current build string

V6B_FINAL_QA_STATUS: `NOT YET FROZEN / MUST BE VALIDATED`

## Market Genome

GENOME_BITS: `12` — LOCKED concept  
UNIQUE_GENOME_TARGET: `4096 states / one state per NFT` — LOCKED concept  
CURRENT_RECOMMENDED_STRUCTURE: `MMMM VVVV CCCC`  
CURRENT_RECOMMENDED_AXES:
- Momentum: 4 bits, 0–15
- Volatility: 4 bits, 0–15
- Conviction: 4 bits, 0–15

NORMALIZED_DISPLAY_CURRENT: `round(value / 15 × 100)`

STATUS: `CURRENT RECOMMENDED — NOT YET FINAL LOCK`

PROPOSED_ASSIGNMENT_DIRECTION_FROM_BOOTSTRAP: `deterministic shuffled one-to-one token ↔ genome mapping`  
PROPOSED_ASSIGNMENT_STATUS: `PROPOSED — NOT LOCKED`

## Market Profile

CURRENT_BANDS:

Momentum:
- 0–3 Dormant
- 4–7 Building
- 8–11 Active
- 12–15 Surging

Volatility:
- 0–3 Stable
- 4–7 Responsive
- 8–11 Volatile
- 12–15 Extreme

Conviction:
- 0–3 Flexible
- 4–7 Measured
- 8–11 Firm
- 12–15 Absolute

STATUS: `CURRENT RECOMMENDED — VOCABULARY NOT YET LOCKED`

## Whitelist / GTD

WHITELIST_MODEL: `application pool` — LOCKED  
FINAL_OUTCOMES: `GTD or PUBLIC` — LOCKED  
GENESIS_CALIBRATION: `6 questions × 4 choices = 12-bit signal` — LOCKED concept  
GTD_CURRENT: `1 guaranteed allocation / free mint / gas paid by user`  
GTD_COUNT: `TBD`  
GTD_DURATION: `TBD`  
ALLOWLIST_CURRENT_DIRECTION: `Merkle allowlist`

## Public Mint

PUBLIC_MINT_PRICE_CURRENT: `0.0005 ETH / NFT`  
PUBLIC_MINT_MODEL_CURRENT: `FCFS after GTD window`  
UNCLAIMED_GTD_CURRENT: `returns to public supply`  
PUBLIC_WALLET_LIMIT: `TBD`  
PUBLIC_START_TIMING: `TBD`

## Reveal

REVEAL_MODEL: `blind / delayed reveal` — LOCKED  
TOKEN_CONTINUITY: `same token ID / owner / contract before and after Reveal` — LOCKED  
FINAL_REVEAL_TIMING: `TBD`  
PRE_REVEAL_ART: `sealed artwork`  
POST_REVEAL: `final art + traits + Market Genome`

## Market Lab

STATUS: `CURRENT strong product direction`  
ROLE: `post-Reveal NFT identity explorer; not a financial signal service`

CURRENT_FEATURE_SET:
- Genome Decoder
- Genome Anatomy
- Momentum / Volatility / Conviction
- Market Profile
- Compare Candlekin
- Share Card
- Genome Atlas

GENOME_ATLAS_SHIP_TIMING: `TBD`

## Collection Experience

PRIMARY_COLLECTION_VIEW: `My Candlekin` — LOCKED current direction  
FULL_4096_RPC_GALLERY: `DO NOT USE as default architecture`  
BEFORE_REVEAL: `owned token ID + sealed art`  
AFTER_REVEAL: `art + family + traits + genome + profile + Market Lab link`

## Metadata

SOURCE_PRINCIPLE: `metadata generated from the same frozen manifest used for rendering` — LOCKED  
FINAL_SCHEMA: `TBD`  
FINAL_DESCRIPTION: `TBD`  
IMAGE_CID: `TBD`  
METADATA_CID: `TBD`  
METADATA_EXPORTER: `NOT YET FINALIZED`

## Contract

CONTRACT_IMPLEMENTATION: `TBD`  
CONTRACT_ADDRESS: `TBD`  
ABI: `TBD`  
HIGH_LEVEL_REQUIREMENTS_CURRENT:
- ERC-721
- max supply 4,096
- GTD phase
- Public phase
- allowlist verification
- wallet limits
- supply checks
- price handling
- reveal metadata switch
- owner/admin phase management
- emergency pause

No production contract should be written until the material pre-production decisions are resolved and the architecture gate is explicitly reached.

## Token Position

CANDLEKIN_V1_TOKEN_DEPENDENCY: `NONE` — CURRENT recommended direction  
Do not tease or promise a token on the public v1 website.

## Fairness / Determinism

LOCKED PRINCIPLES:
- blind mint
- deterministic reproducible collection generation
- 4,096 unique Visual DNA target
- no Genesis Signal influence over NFT outcome
- no wallet influence over final rarity
- no post-mint manual trait manipulation
- production NFT art comes from approved PNG assets, not silent AI replacement

## Frontend

PROTOTYPE_CLASSIFICATION: `PRESENTATION_REUSABLE`

PRESERVE:
- visual direction
- lifecycle concepts
- information hierarchy
- project terminology
- pre/post reveal distinction
- Market Lab concept

PRODUCTIONIZE:
- routing/application structure
- wallet connection
- chain enforcement
- contract reads/writes
- transaction state
- authoritative supply/price/phase
- My Candlekin ownership retrieval
- metadata/IPFS resolution
- checker data flow

REMOVE / REPLACE:
- mock applicants
- mock wallet connection
- fake checker database
- fake owned NFTs
- fake mint success / mock supply
- prototype-only genome assignment

## Infrastructure

FRONTEND_HOSTING: `TBD`  
PRODUCTION_RPC: `TBD`  
RPC_FALLBACK: `TBD`  
WALLET_CONNECTOR: `TBD`  
DOMAIN: `TBD`  
MARKETPLACE: `TBD`

## Current Project State

PHASE: `PRE-PRODUCTION DECISION LOCK / PROJECT BOOTSTRAP`  
STATUS: `ACTIVE`

NEXT MATERIAL DECISION:
1. Finalize / lock Market Genome structure.
2. Finalize assignment model.
3. Then finalize Market Profile vocabulary.

Mainnet deployment, metadata freeze, reveal, treasury actions and other irreversible operations require explicit approval gates.
