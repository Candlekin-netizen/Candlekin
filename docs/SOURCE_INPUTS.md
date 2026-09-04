# SOURCE INPUTS

This file records the source materials used to bootstrap Candlekin.

## 1. NFT PROJECT MASTER PRODUCTION SYSTEM v1.1

Role: **engineering operating manual**.

Authority:
- project bootstrap process;
- architecture and quality gates;
- security boundaries;
- local/testnet/mainnet workflow;
- frontend/Web3 productionization;
- RPC, wallet, hosting, marketplace, reveal and incident-response practices.

It does not override Candlekin-specific creative/product decisions.

## 2. CANDLEKIN — NFT MASTER CONCEPT v1

Role: **Candlekin conceptual source-of-truth**.

Authority:
- project identity;
- supply/family structure;
- art direction;
- Visual DNA;
- Market Genome concept;
- Genesis Signal;
- whitelist/GTD/Public model;
- reveal intent;
- Market Lab;
- trait/background architecture;
- LOCKED / CURRENT / TBD decisions.

Decision labels must be preserved:
- LOCKED = final unless explicitly changed later;
- CURRENT = active direction, still changeable;
- TBD = unresolved; do not silently assume.

## 3. CANDLEKIN FULL LIFECYCLE PROTOTYPE v13

Role: **visual/product interaction reference**.

Current classification: `PRESENTATION_REUSABLE`.

Useful for:
- lifecycle presentation;
- page hierarchy;
- copy placement;
- dark market/protocol visual direction;
- whitelist flow;
- checker flow;
- GTD/Public mint surfaces;
- sealed/revealed collection states;
- Market Lab presentation.

Not authoritative for:
- real wallet state;
- real applicants;
- real checker data;
- real owned NFTs;
- real contract reads/writes;
- real supply progress;
- production Market Genome assignment.

## Reconciliation hierarchy

```text
MASTER PRODUCTION SYSTEM
→ engineering process / quality / safety

CANDLEKIN MASTER CONCEPT
→ project intent / identity / product decisions

LIFECYCLE PROTOTYPE
→ intended presentation / experience

PROJECT_CONFIG.md
→ reconciled project-specific engineering truth

ONCHAIN STATE
→ authoritative runtime truth after deployment
```

Contradictions must be surfaced rather than silently resolved.
