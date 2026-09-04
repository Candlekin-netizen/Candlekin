# CANDLEKIN DECISION REGISTER

This register tracks project-defining decisions separately from implementation details.

## LOCKED

| Decision | Value |
|---|---|
| Project name | Candlekin |
| Total supply | 4,096 |
| Family split | 2,048 Bullkin / 2,048 Bearkin |
| Chain | Robinhood Chain |
| Art direction | Hard-pixel modular candlestick characters |
| Visual identity layer | Visual DNA |
| Post-Reveal identity layer | 12-bit Market Genome |
| Genesis Signal role | Whitelist participant identity only |
| Genesis Signal → NFT outcome | No influence |
| Whitelist role | Application pool, not paid allocation tier |
| Final curation outcomes | GTD or Public |
| Reveal model | Blind / delayed reveal |
| Token continuity | Same token ID / owner / contract through Reveal |
| Production art source | Approved PNG assets + deterministic generator |
| Collection product direction | My Candlekin, not a raw 4,096-token RPC gallery |

## CURRENT — NOT FINAL LOCK

| Decision | Current direction |
|---|---|
| GTD | 1 guaranteed free mint allocation |
| Public mint | 0.0005 ETH / NFT |
| Mint order | GTD → Public |
| Unclaimed GTD | Returns to public supply |
| Background system | 20 solid + 6 curated legendary worlds |
| Body Accessory | 80% |
| Glasses | 70% |
| Special Trait architecture | 21 special traits; Body 3 Curved Arms rule |
| Generator | V6B current architecture |
| Market Genome split | MMMM VVVV CCCC |
| Market Profile | 4 bands per axis |
| Market Lab | Post-Reveal identity utility |
| Token dependency | None for Candlekin NFT v1 |
| GTD allowlist | Merkle |
| Whitelist curation | Google Sheets workbench |

## PROPOSED DURING BOOTSTRAP — NOT LOCKED

### Market Genome assignment

Proposed:

```text
4096 token IDs
+
4096 unique 12-bit genome states
↓
deterministic shuffle
↓
one unique genome assigned to each token
```

Goals:
- no duplicate genome;
- no missing genome state;
- reproducible mapping;
- no wallet/GTD/Genesis/Visual DNA influence;
- avoid final genome being trivially derived from token ID.

This remains a recommendation until explicitly approved.

## TBD

- Exact GTD wallet count
- GTD claim duration
- Public per-wallet limit
- Public mint start timing
- Reveal timing
- Final lock of 4/4/4 genome model
- Final Market Profile vocabulary
- Exact genome assignment seed/process
- Metadata schema and exact attribute names
- Collection description
- Image CID
- Metadata CID
- Contract architecture details / ABI
- Contract address
- Royalty policy
- Treasury model
- Token ID convention if not already fixed during architecture phase
- Production RPC provider
- Wallet connector
- Domain / hosting
- Marketplace / explorer links
- Overall rarity ranking policy
- Genome Atlas release timing

## Approval rule

A CURRENT or TBD item becomes LOCKED only after an explicit project decision. Do not infer a lock from prototype implementation, mock data, or convenience.
