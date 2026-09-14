# CANDLEKIN — PROJECT DOCS

This document mirrors the public-facing project documentation and separates locked product facts from implementation work that is still in progress.

## 1. Collection

Candlekin is a 4,096-piece ERC-721 collection on Robinhood Chain.

| Item | Value |
|---|---|
| Total supply | 4,096 |
| Bullkin | 2,048 |
| Bearkin | 2,048 |
| Family split | 50 / 50 |
| Art direction | Hard-pixel modular candlestick characters |
| Reveal | Blind / delayed, one-way |
| Primary mint execution | OpenSea / canonical SeaDrop |

## 2. Lifecycle

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

### Whitelist outcomes

Whitelist applications are curated into one of three database statuses:

- `GTD` — guaranteed presale allocation;
- `FCFS` — first-come, first-served presale access;
- `NOT_SELECTED` — not selected for presale.

`PENDING` exists internally while curation is incomplete. Public is a mint stage, not an application outcome.

The website Allocation Checker reports the whitelist application result. OpenSea / SeaDrop remains the authoritative mint execution layer.

## 3. Mint architecture

Candlekin uses a hybrid architecture:

```text
Candlekin ERC-721
  ownership
  fixed 4,096 max supply
  metadata
  reveal
        ↑
        │ mint authorization
        │
Canonical SeaDrop
  GTD / FCFS / Public configuration
  stage timings
  prices
  wallet limits
  allowlists
  payout
        ↑
        │
OpenSea / collector wallet
```

The Candlekin token contract does not expose a public mint bypass. Mint price and stage configuration belong to SeaDrop, not static website copy.

## 4. Genesis Signal

Genesis Signal is a **participant identity**, not an NFT attribute.

- 6 calibration questions;
- 4 answers per question;
- each answer maps to two bits;
- final display: 12 bits shown as `4-4-4`.

Genesis Signal must not determine:

- GTD / FCFS selection;
- token ID;
- Bullkin / Bearkin family;
- Visual DNA;
- rarity;
- final artwork;
- Market Genome.

## 5. Visual DNA

Visual DNA describes the NFT's artwork identity.

Public trait categories:

1. Background
2. Head
3. Body
4. Body Accessory
5. Glasses
6. Special Trait

Visual DNA is independent from Genesis Signal and Market Genome.

## 6. Market Genome

Market Genome is the separate post-Reveal NFT identity layer.

Current product structure:

```text
MMMM VVVV CCCC
```

- Momentum: 4 bits, 0–15
- Volatility: 4 bits, 0–15
- Conviction: 4 bits, 0–15

The Market Lab can visualize each axis as a 0–15 value, percentage position and state label. These values are collectible identity/lore only. They are not live market data, performance probabilities, price predictions, financial advice, or trading recommendations.

The final production token↔genome assignment mechanism is not yet frozen. Demo mappings in the preview must not be treated as production assignment truth.

## 7. Reveal

Before reveal, all minted token IDs resolve to shared sealed metadata.

After reveal:

```text
tokenURI(N) → finalBaseURI + N + ".json"
```

Reveal is owner-controlled and one-way. The same NFT contract, token ID and owner continue through reveal; only the metadata view changes.

## 8. Market Lab

Current product scope:

- Genome Decoder
- Momentum / Volatility / Conviction axis views
- Market Profile
- Genome Anatomy
- Compare Candlekin
- Genome Share
- Genome Atlas with 4,096 possible 12-bit states

Market Lab is an identity explorer, not a market-signal product.

## 9. Website roles

Candlekin.xyz handles:

- project identity and documentation;
- whitelist application;
- Genesis Signal generation;
- allocation checking;
- collection ownership experience;
- My Candlekin;
- Market Lab.

OpenSea / SeaDrop handles primary mint execution.

The internal lifecycle selector remains visible only on the preview branch for review and should be hidden in the final production release.

## 10. Testnet validation

Robinhood Chain Testnet:

```text
Chain ID: 46630
Candlekin: 0x3D8A54bdee95791D4AE9D9D5163bf6ddA3c607f8
Canonical SeaDrop: 0x00005EA00Ac477B1030CE78506496e8C2dE24bf5
```

Completed validation:

- source hash / runtime bytecode verification;
- fixed max supply enforcement;
- canonical SeaDrop-only mint path;
- real sealed SeaDrop mint;
- hidden metadata update while sealed;
- one-way reveal at partial supply;
- token-specific metadata and final image resolution;
- second reveal simulation reverting as expected.

The testnet address is not a mainnet mint address.

## 11. Mainnet status

Mainnet is **not deployed yet**.

Before mainnet deployment:

- update the constructor's initial hidden metadata URI to the corrected hidden metadata;
- re-run build and contract tests;
- finalize production owner / treasury / royalty configuration;
- finalize GTD / FCFS / Public SeaDrop stage parameters;
- complete non-owner browser mint validation and allowlist validation;
- publish the canonical mainnet contract and OpenSea destination only after verification.

## 12. Official links

- Website: `https://candlekin.xyz`
- X: `https://x.com/Candlekin`
- Testnet explorer: `https://explorer.testnet.chain.robinhood.com/address/0x3D8A54bdee95791D4AE9D9D5163bf6ddA3c607f8`

Do not trust contract or mint links that are not published through the official website or official X account.
