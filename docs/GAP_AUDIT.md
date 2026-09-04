# CANDLEKIN — PRODUCTION GAP AUDIT

**Status:** Active pre-production checklist  
**Purpose:** Separate project decisions that are still unresolved from ordinary engineering work that can be completed later without redefining Candlekin.

---

## A. SOURCE-DEFINED MATERIAL DECISIONS STILL OPEN

These items are already identified as CURRENT/TBD in the Candlekin concept and should not be silently invented in code.

### Market Genome
- [ ] Lock the `MMMM VVVV CCCC` 4/4/4 structure.
- [ ] Lock 0–15 axis semantics and normalized percentage display.
- [ ] Lock final Market Profile vocabulary.
- [ ] Lock the exact token ↔ Market Genome assignment algorithm.
- [ ] Decide whether Genome Atlas ships at Reveal or later.

### GTD
- [ ] Exact GTD wallet/allocation count.
- [ ] Allocation per wallet (current direction is one guaranteed free mint).
- [ ] Exact GTD claim duration.

### Public Mint
- [ ] Final confirmation of `0.0005 ETH` price.
- [ ] Public per-wallet mint limit.
- [ ] Public mint start timing.

### Reveal
- [ ] Final Reveal timing/policy.
- [ ] Decide whether Reveal uses a fixed delay, calendar time, or another approved rule.

### Metadata / IPFS
- [ ] Exact metadata schema and attribute names.
- [ ] Final collection description.
- [ ] Final image CID.
- [ ] Final metadata CID.

### Production integration
- [ ] Final NFT contract implementation / ABI.
- [ ] Final production wallet integration details.
- [ ] Final RPC architecture/provider configuration.
- [ ] Final explorer / marketplace links.
- [ ] Decide whether an overall rarity ranking exists.

---

## B. ART / GENERATOR WORK STILL REQUIRED

- [ ] Rerender/finalize the V6B collection build.
- [ ] Validate exactly 4,096 output images.
- [ ] Validate exactly 2,048 Bullkin / 2,048 Bearkin.
- [ ] Validate 4,096 unique Visual DNA combinations.
- [ ] Freeze final manifest/config/seed.
- [ ] Generate and record canonical hashes/fingerprints after the final approved rerender.
- [ ] Finish the metadata exporter from the same frozen manifest.
- [ ] Run full manifest ↔ image ↔ metadata consistency QA.

No AI-generated support visual should silently replace approved production NFT artwork.

---

## C. CONTRACT ARCHITECTURE DECISIONS REQUIRED BEFORE SOLIDITY FREEZE

The project concept defines the high-level responsibilities, but the production manual requires these engineering decisions to be explicit before implementation is considered final.

- [ ] Token ID convention/start value.
- [ ] Burn policy.
- [ ] Public max-per-tx policy.
- [ ] Lifetime/per-phase wallet-cap semantics.
- [ ] Reserve/admin mint policy.
- [ ] GTD Merkle root update/freeze policy.
- [ ] Reveal/base URI mutability policy.
- [ ] Metadata freeze policy.
- [ ] Royalty policy and receiver.
- [ ] Treasury/withdraw model.
- [ ] Ownership/admin model.
- [ ] Upgradeable vs non-upgradeable architecture.
- [ ] Emergency pause semantics.
- [ ] Required frontend-readable contract views/events/errors.

These are not permissions to add complexity. Default should remain the simplest architecture that satisfies the actual requirements.

---

## D. WHITELIST / CHECKER DATA PATH

The prototype currently demonstrates UX only.

Still required:
- [ ] Decide the production submission destination/workflow.
- [ ] Decide whether Google Sheets remains the v1 curation workbench or a backend is justified.
- [ ] Define canonical final applicant record fields.
- [ ] Produce final GTD wallet list.
- [ ] Generate Merkle tree/root/proofs from the approved GTD list.
- [ ] Define allocation-checker data source and unknown-wallet behavior.
- [ ] Keep admin/curation UI inaccessible to ordinary public users.

---

## E. FRONTEND / WEB3 PRODUCTIONIZATION

The current Vercel site is a **production preview**, not the final dapp.

Already improved in preview:
- Internal lifecycle switcher hidden from normal public view.
- Internal lifecycle testing available only through explicit internal mode.
- No fake wallet transaction or fake mint transaction.
- Demo wallet/genome data visibly identified as non-canonical.
- Full 4,096-cell supply/genome matrices instead of the earlier 1,024-cell approximation.
- Unknown checker wallets no longer silently default to Public.
- Whitelist inputs survive question navigation and preview validation is local-only.
- Public homepage now explains identity architecture, collector journey, art system and fairness.
- Preview is marked `noindex` while unfinished.

Still required for the final dapp:
- [ ] Select/pin final frontend framework and dependency stack.
- [ ] Centralize chain/contract/RPC/runtime config.
- [ ] Real browser wallet connection.
- [ ] Exact-chain enforcement and switch UX.
- [ ] GTD proof retrieval/verification flow.
- [ ] Live onchain mint state.
- [ ] Transaction simulation/preflight.
- [ ] Receipt tracking and minted token-ID extraction.
- [ ] Real My Candlekin ownership source.
- [ ] IPFS metadata resolver with fallback/error handling.
- [ ] Sealed/revealed metadata behavior from authoritative `tokenURI()`.
- [ ] Mobile wallet/deep-link testing.
- [ ] Accessibility and production E2E tests.

---

## F. INFRASTRUCTURE / RELEASE

- [ ] Verify current official Robinhood Chain parameters immediately before integration/release.
- [ ] Configure dedicated production RPC + official fallback.
- [ ] Configure staging vs production environments.
- [ ] Configure domain and provider restrictions.
- [ ] Complete clean testnet release-candidate deployment.
- [ ] Run full GTD → Public → Reveal rehearsal with multiple wallets.
- [ ] Test RPC and IPFS degradation.
- [ ] Complete mainnet readiness gate.
- [ ] Obtain explicit owner approval before mainnet deployment/activation/reveal/freeze/fund movement.
- [ ] Run one real mainnet collector mint E2E before declaring public traffic ready.
- [ ] Verify marketplace recognition pre- and post-Reveal.

---

## G. ADDITIONAL PRODUCT/LAUNCH GAPS — RECOMMENDED, NOT DEFINED BY THE CONCEPT

These are recommendations from a production-web perspective and are **not currently defined as Candlekin source-of-truth decisions**:

- [ ] Canonical public domain.
- [ ] Official X/social links and footer destinations.
- [ ] Final logo/favicon/social preview assets.
- [ ] Public Terms / Privacy language if whitelist data is collected.
- [ ] Public disclosure copy for admin powers, metadata mutability and randomness/mapping method.
- [ ] Monitoring/analytics policy if desired.
- [ ] Launch support/incident communication channel.

Do not add or promise these as product features without an explicit project decision.

---

## NEXT MATERIAL DECISION

**Lock the Market Genome model before encoding canonical metadata or contract assumptions.**

Current recommended candidate:

```text
12-BIT MARKET GENOME
MMMM VVVV CCCC

Momentum   = 4 bits / 0–15
Volatility = 4 bits / 0–15
Conviction = 4 bits / 0–15
```

The deterministic shuffled token ↔ genome assignment remains a strong proposed direction but is not canonical until explicitly approved.
