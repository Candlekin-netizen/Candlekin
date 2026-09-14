# CANDLEKIN

Candlekin is a **4,096-piece ERC-721 hard-pixel NFT collection on Robinhood Chain** built around candlestick-inspired characters and three deliberately separate identity systems: **Genesis Signal**, **Visual DNA**, and the post-Reveal **Market Genome**.

## Canonical collection facts

- Supply: **4,096 NFTs**
- Family split: **2,048 Bullkin / 2,048 Bearkin**
- Chain: **Robinhood Chain**
- Art direction: **hard-pixel modular candlestick characters**
- Mint execution: **OpenSea / canonical SeaDrop**
- Presale model: **GTD → FCFS → Public**
- Reveal: **blind / delayed, one-way**
- Collection experience: **My Candlekin + Market Lab**
- Genesis Signal is participant identity only and does **not** influence whitelist tier, token outcome, artwork, rarity, family, or Market Genome.
- Market Genome is collectible identity/lore and is **not** a live market signal, prediction, or trading recommendation.

## Product lifecycle

```text
WHITELIST OPEN
→ WHITELIST CLOSED
→ CURATION
→ CHECKER OPEN
→ GTD MINT
→ FCFS MINT
→ PUBLIC MINT
→ SOLD OUT / SEALED
→ REVEAL
→ MY CANDLEKIN / MARKET LAB
```

Whitelist curation outcomes are mutually exclusive **GTD**, **FCFS**, or **NOT_SELECTED**. Public is a mint stage, not a whitelist outcome.

## Website responsibility

Candlekin.xyz is the project identity, whitelist, allocation-checker, collection and Market Lab layer. Primary mint execution is delegated to OpenSea / SeaDrop. Static website copy does not promise mint price, timing, or wallet limits; those values belong to the active SeaDrop stage configuration.

The `preview` branch intentionally keeps the internal lifecycle selector visible for review. It must be hidden before the final production release.

## Current testnet status

Robinhood Chain Testnet validation has passed through:

- custom ERC-721 deployment and source verification;
- canonical SeaDrop public mint while sealed;
- hidden metadata correction while sealed;
- one-way reveal at partial supply;
- final token-specific metadata and artwork resolution.

Testnet contract:

```text
0x3D8A54bdee95791D4AE9D9D5163bf6ddA3c607f8
```

Chain ID:

```text
46630
```

This is **not** the mainnet contract. Mainnet has not been deployed or published.

## Identity systems

### Genesis Signal

Six calibration questions × four answers create a 12-bit participant identity shown as `4-4-4`. It is used for the whitelist experience only and does not determine NFT outcome.

### Visual DNA

Artwork identity composed from the approved production trait system: Background, Head, Body, Body Accessory, Glasses and Special Trait.

### Market Genome

The product model is a 12-bit post-Reveal identity using the current `MMMM VVVV CCCC` structure:

- Momentum: 4 bits / 0–15
- Volatility: 4 bits / 0–15
- Conviction: 4 bits / 0–15

The final production assignment mechanics remain a separate decision and must not be inferred from the demo Market Lab mapping.

## Official links

- Website: `https://candlekin.xyz`
- X: `https://x.com/Candlekin`
- Testnet explorer: `https://explorer.testnet.chain.robinhood.com/address/0x3D8A54bdee95791D4AE9D9D5163bf6ddA3c607f8`

## Repository map

```text
/
├─ README.md
├─ PROJECT_CONFIG.md
├─ PROJECT_CURRENT_HANDOFF.md
├─ docs/
│  ├─ PROJECT_DOCS.md
│  ├─ SOURCE_INPUTS.md
│  ├─ DECISIONS.md
│  ├─ FRONTEND_EXPERIENCE_BRIEF.md
│  └─ GAP_AUDIT.md
├─ frontend/
├─ contracts/
├─ metadata/
├─ scripts/
└─ test/
```

## Safety rule

Only addresses and mint links published through **Candlekin.xyz** and the official **@Candlekin** account should be treated as canonical. Testnet addresses must never be presented as mainnet mint addresses.

---

**Candlekin** — Apply → Mint → Sealed → Reveal → Decode.
