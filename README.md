# Pharaoh's Liquidity Kingdom

A risk-free, 60-second browser strategy game about concentrated liquidity. You play as a Market Keeper competing against the passive **Idle LP** across ten deterministic trader-caravan waves.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. For a production build:

```bash
npm run build
npm run preview
```

## How to play

1. Choose Stable Market, Volatile Market, or New Pool.
2. Cast an incentive vote to define the round's reward bonus.
3. Read each caravan's three-second warning: direction, size, price move, and fee value.
4. Stage a range with the on-screen controls or keyboard, then deploy it. You have three deployments per round.
5. Catch trades inside the active range and finish ahead of Idle LP.

### Controls

- `←` / `→`: move the staged range
- `↑` / `↓`: narrow or widen the staged range
- `Space`: deploy the staged range
- `1`–`3`: select pools and vote choices
- `Enter`: start after voting

## Learning goal

Tight ranges amplify fee capture but are easier for price to escape. Wide ranges remain productive more often but use capital less efficiently. The score race makes that tradeoff visible against a passive full-range rival.

## Architecture

- `src/game/` contains deterministic TypeScript rules, events, scoring, balance, and rival behavior.
- `src/components/` contains the React game screens and play-surface components.
- `src/audio/` contains the synthesized Web Audio sound system.
- `src/data/` contains pool, event, vote, and copy definitions.
- `src/styles/` contains global responsive styling and theme tokens.

No wallet, blockchain connection, live price feed, or real asset is used.
