# CANDLEKIN

Candlekin is a 4,096-piece hard-pixel NFT collection inspired by stock-market candlesticks and built around two separate identity layers: **Visual DNA** and a post-Reveal **12-bit Market Genome**.

## Canonical collection facts

- Supply: **4,096 NFTs**
- Family split: **2,048 Bullkin / 2,048 Bearkin**
- Chain intent: **Robinhood Chain**
- Art direction: **hard-pixel, modular traits, clean candlestick silhouette**
- Mint model: **GTD phase → Public phase**
- Reveal: **blind / delayed reveal**
- Post-Reveal utility: **Market Lab**
- Genesis Signal is participant identity only and does **not** influence NFT outcome.

## Product lifecycle

```text
WHITELIST OPEN
→ WHITELIST CLOSED
→ CURATION
→ CHECKER OPEN
→ GTD MINT
→ PUBLIC MINT
→ SOLD OUT / PRE-REVEAL
→ REVEAL
→ MARKET LAB ONLINE
```

## Repository status

This repository is currently in **PROJECT BOOTSTRAP / PRE-PRODUCTION**.

No production contract, metadata CID, contract address, or mainnet configuration should be treated as final until the corresponding decision and QA gates pass.

## Repository map

```text
/
├─ README.md
├─ PROJECT_CONFIG.md
├─ PROJECT_CURRENT_HANDOFF.md
├─ docs/
│  ├─ SOURCE_INPUTS.md
│  ├─ DECISIONS.md
│  └─ FRONTEND_EXPERIENCE_BRIEF.md
├─ prototype/
├─ frontend/
├─ contracts/
├─ metadata/
├─ scripts/
└─ test/
```

## Source-of-truth hierarchy

1. Production operating manual → engineering process, safety and release gates.
2. Candlekin master concept → project identity, product requirements and LOCKED/CURRENT/TBD decisions.
3. Lifecycle prototype → intended visual/product experience and demonstrated interactions.
4. `PROJECT_CONFIG.md` → reconciled project-specific engineering truth.
5. Onchain state → authoritative live state after deployment.

## Current focus

The next project-defining decision is the final **Market Genome structure and assignment model**. The current candidate is `MMMM VVVV CCCC` (Momentum / Volatility / Conviction), 4 bits per axis. The deterministic shuffled token↔genome assignment discussed during bootstrap remains **proposed, not yet frozen**.

---

**Candlekin** — Apply → Mint → Sealed → Reveal → Decode.
