# FRONTEND EXPERIENCE BRIEF — CANDLEKIN

## Product personality

Candlekin should feel like a compact market/protocol world built around collectible identity rather than a conventional NFT mint template.

Visual language from the current prototype:
- deep navy / near-black environment;
- lime signal accent;
- restrained grid / terminal influence;
- editorial serif headlines paired with monospace system language;
- clean card surfaces;
- clear lifecycle status;
- data-like Market Genome presentation.

## Primary journey

```text
ARRIVE
→ understand Candlekin
→ apply to whitelist
→ generate Genesis Signal
→ submit for review
→ check GTD / Public status
→ GTD or Public mint
→ own sealed Candlekin
→ Reveal
→ view My Candlekin
→ decode in Market Lab
```

## Lifecycle-aware navigation

The public navigation should change based on the active lifecycle phase rather than exposing every feature all the time.

Expected phases:
1. WHITELIST_OPEN
2. WHITELIST_CLOSED
3. CHECKER_OPEN
4. GTD_MINT
5. PUBLIC_MINT
6. SOLD_OUT / PRE-REVEAL
7. REVEALED

Internal curation/admin must not be exposed as an ordinary public route.

## Preserve from prototype

- brand tone and dark/lime direction;
- lifecycle-driven UX;
- Home / Whitelist / Collection / FAQ logic;
- dedicated Mint surface during mint phases;
- Market Lab appearing after Reveal;
- My Candlekin as personalized collection view;
- Genesis Signal share-card concept;
- Market Genome decoder / profile / compare / atlas concepts;
- sealed/revealed distinction.

## Productionize

Replace prototype state with real systems:
- wallet connection and reconnect;
- exact Robinhood Chain enforcement;
- authoritative contract phase / supply / price reads;
- Merkle GTD eligibility/proof flow if retained;
- real transaction preparation, wallet approval and receipt handling;
- actual minted token IDs from receipt logs;
- ownership retrieval for My Candlekin;
- tokenURI/IPFS metadata resolver;
- real sealed/revealed metadata behavior;
- production checker data source;
- responsive/mobile wallet behavior;
- loading, rejection, revert and RPC failure states.

## Do not carry forward as production truth

- hard-coded checker wallets;
- mock applicants;
- fixed mock ownership list;
- fake progress values;
- fake connect/disconnect state;
- token-ID-derived prototype genome algorithm;
- placeholder hero art as final NFT artwork;
- any displayed contract data that is not backed by canonical config or live chain state.

## Critical UX rules

- Wallet connection must remain understandable even if atmosphere is stylized.
- Wrong-chain writes must be blocked.
- Mutable mint price must come from fresh authoritative state before transaction construction.
- One click/submit must never accidentally create duplicate transactions.
- Pre-Reveal UI must not leak final traits or Market Genome.
- Post-Reveal UI should resolve final metadata dynamically.
- Mobile layout must remain usable for wallet deep-link flows.

## Collection page

Primary model: **My Candlekin**.

Before Reveal:
- token ID;
- sealed art;
- sealed status.

After Reveal:
- final art;
- family;
- visual traits;
- Market Genome;
- Market Profile;
- link into Market Lab.

Do not implement a naive `ownerOf()` / `tokenURI()` × 4,096 real-time gallery.

## Market Lab

Market Lab is an NFT identity utility, not a trading signal service.

Planned surfaces:
- Genome Decoder
- Genome Anatomy
- Momentum / Volatility / Conviction
- Market Profile
- Compare
- Share Card
- Genome Atlas

Financial-return claims, real trading predictions or signal-service framing should not be introduced.

## Responsive direction

Desktop may preserve the spacious two-column editorial/data composition seen in the prototype. Mobile should collapse cleanly to one column, keep transaction controls above unnecessary decoration, and avoid fixed overlays obscuring wallet/mint actions.

## Current frontend status

`EXPERIENCE BRIEF READY / PRODUCTION STACK NOT YET SELECTED`

Framework, wallet connector, RPC provider, hosting and contract integration remain future engineering decisions.
