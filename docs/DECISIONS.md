# CANDLEKIN DECISION REGISTER

This register separates locked project decisions from items that still require a final production lock.

## LOCKED

| Decision | Value |
|---|---|
| Project name | Candlekin |
| Collection standard | ERC-721 / ERC721A implementation |
| Total supply | 4,096 |
| Family split | 2,048 Bullkin / 2,048 Bearkin |
| Chain | Robinhood Chain |
| Art direction | Hard-pixel modular candlestick characters |
| Visual identity layer | Visual DNA |
| Genesis Signal role | Whitelist participant identity only |
| Genesis Signal → NFT outcome | No influence |
| Market Genome role | Separate post-Reveal collectible identity / lore |
| Market Genome | Not a trading signal, prediction, or ranking |
| Whitelist model | Application pool |
| Curation statuses | GTD / FCFS / NOT_SELECTED |
| GTD and FCFS | Mutually exclusive |
| Public | Mint stage, not application outcome |
| Primary mint execution | OpenSea / canonical SeaDrop |
| Website price display | Do not hard-code sale price in public lifecycle copy |
| Reveal model | Blind / delayed |
| Reveal direction | One-way SEALED → REVEALED |
| Token continuity | Same token ID / owner / contract through Reveal |
| Max supply | Permanently fixed at 4,096 |
| Metadata correction | Owner may correct hidden/final URI while sealed; locked after reveal |
| Public mint bypass | None; mintSeaDrop is canonical SeaDrop-only |
| Collection product direction | My Candlekin, not a raw 4,096-token RPC gallery |
| Token dependency | None for Candlekin NFT v1 |

## CURRENT / NOT FINAL LOCK

| Decision | Current direction |
|---|---|
| Market Genome structure | `MMMM VVVV CCCC` |
| Momentum | 4 bits / 0–15 |
| Volatility | 4 bits / 0–15 |
| Conviction | 4 bits / 0–15 |
| Market Profile | Four state bands per axis |
| Market Lab | Decoder + profile + anatomy + compare + share + atlas |
| Market Genome assignment | One-to-one shuffled token↔state assignment direction |
| Production owner | Dedicated production owner / safer ownership setup to be finalized |
| Royalty configuration | ERC-2981 supported; final policy TBD |
| GTD stage parameters | Configure in SeaDrop; exact price/count/window TBD |
| FCFS stage parameters | Configure in SeaDrop; exact price/count/window TBD |
| Public stage parameters | Configure in SeaDrop; exact price/limit/window TBD |

## IMPLEMENTED / VERIFIED ON TESTNET

Robinhood Chain Testnet contract:

```text
0x3D8A54bdee95791D4AE9D9D5163bf6ddA3c607f8
```

Verified:

- chain ID 46630;
- source verified on explorer;
- runtime bytecode matched local build;
- `MAX_SUPPLY = 4096`;
- canonical SeaDrop-only mint path;
- real public SeaDrop mint while sealed;
- shared hidden `tokenURI` before reveal;
- owner correction of hidden metadata while sealed;
- real one-way reveal at partial supply;
- token-specific final metadata after reveal;
- second reveal simulation reverts `AlreadyRevealed()`.

This testnet deployment is validation infrastructure only and is not the mainnet mint contract.

## STILL TBD

- Exact GTD wallet count / allocation parameters
- GTD timing and price
- FCFS timing, allocation and price
- Public wallet limit, timing and price
- Reveal timing on mainnet
- Final lock of Market Genome assignment process
- Final Market Profile vocabulary
- Production owner / treasury setup
- Final royalty policy
- Mainnet deployment address
- Final OpenSea collection / drop URL
- Production RPC / wallet connector configuration
- Overall rarity ranking policy, if any

## Approval rule

A CURRENT or TBD item becomes LOCKED only after an explicit project decision. Prototype demo data, testnet parameters and temporary SeaDrop settings are not production promises.
