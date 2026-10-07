# Pharaoh's Liquidity Kingdom — Game Design Specification (for Codex)

## 1. Project Overview & Objective
- **Title**: Pharaoh's Liquidity Kingdom
- **Format**: Single-page interactive browser simulator & educational mini-game.
- **Core Premise**: A risk-free Web3 liquidity simulator inspired by Pharaoh Exchange (DEX on Avalanche at `phar.gg`). Players take the role of a royal Market Keeper who provisions concentrated liquidity across simulated trading pairs, balancing capital efficiency against out-of-range risk.
- **Key Educational Goal**: Teach players that rewards in concentrated liquidity DEXs come from **productive liquidity** (keeping capital active where trades happen) rather than passive deposit size.
- **Primary Deliverable Target**: Clean, self-contained single-file web app (ready to run, screen-record for contest video submissions, and demo with no backend).

---

## 2. Technical Stack & Execution Constraints
- **Target Environment**: Modern evergreen web browsers (Chromium, Firefox, Safari).
- **Core Framework**: React (with standard hooks) OR self-contained Vanilla HTML5 + CSS + Canvas/SVG. Zero external database or backend required.
- **State Management**: Local client state in memory (optional localStorage for high score persistence).
- **Styling Architecture**: Tailwind CSS or strict CSS tokens matching `phar.gg`:
  - Background Base: `#0d0f12` (rich obsidian / charcoal)
  - Card / Surface Light: `#F6F4EE` (warm off-white / parchment cream)
  - Card / Surface Dark: `#15191E` with border `#262C34`
  - Accent Primary: `#E84142` (Avalanche / Pharaoh fiery red-orange)
  - Accent Secondary: `#D4AF37` / `#F59E0B` (Egyptian Pharaoh gold for yields & achievements)
  - Status Success: `#10B981` (In Range), Status Warning/Danger: `#EF4444` (Out of Range)
  - Typography: Clean neo-grotesque sans (Inter / system sans) with classical serif display accents for titles.

---

## 3. Game Architecture & User Flow

[Start Screen / Welcome]
          │
          ▼
[Phase 1: Pool Selection] ──> Select 1 of 3 simulated pools (AVAX/USDC, BTC.b/AVAX, sAVAX/USDC)
          │
          ▼
[Phase 2: Set Range] ────────> Set Min/Max price boundaries, view capital efficiency meter
          │
          ▼
[Phase 3: Market Simulation] ──> 30s live simulation tick: scarab price moves, trader caravans cross
          │
          ▼
[Phase 4: Results & Vote] ────> Productive Liquidity Scoreboard + xPHAR Incentive Governance Vote

---

## 4. Game Mechanics & Simulation Formulas

### 4.1. Simulated Pairs Configuration
1. **AVAX / USDC (Balanced / High Volume)**
   - Base Price: USD 24.00 | Volatility: Medium (3.5%) | Base Fee Rate: 0.05% | Swap Volume: High
2. **BTC.b / AVAX (Volatile / High Upside)**
   - Base Price: 3,450 AVAX | Volatility: High (7.0%) | Base Fee Rate: 0.30% | Swap Volume: Medium
3. **sAVAX / USDC (Yield-Bearing / Stable Peg)**
   - Base Price: USD 27.50 | Volatility: Low (1.2%) | Base Fee Rate: 0.01% | Swap Volume: Very High

### 4.2. Capital Efficiency Multiplier ($$M$$)
When liquidity is concentrated in range $$[P_{\min}, P_{\max}]$$ around current price $$P_0$$:
$$
\text{Range Width Ratio } W = \frac{P_{\max} - P_{\min}}{P_0}
$$
- Standard full-range equivalent ($$W \ge 2.0$$): $$M = 1.0\times$$
- Tight concentration ($$W = 0.10$$): $$M = 10.0\times$$
- Efficiency Formula:
  $$M = \text{clamp}\left(\frac{1}{\sqrt{P_{\max}/P_0} - \sqrt{P_{\min}/P_0}}, 1.0, 20.0\right)$$

### 4.3. Tick-by-Tick Fee Generation
During each simulation tick ($$dt = 200\text{ms}$$, total 150 ticks = 30 seconds):
- Price moves via random walk with momentum:
  $$P_{t+1} = P_t \times (1 + \mu \cdot dt + \sigma \sqrt{dt} \cdot Z)$$
- If $$P_{\min} \le P_t \le P_{\max}$$:
  - **Status**: `IN_RANGE`
  - Active Volume captured = $$\text{TraderSwapVolume}_t \times \text{PositionShare}$$
  - Fee Earned tick = $$\text{VolumeCaptured} \times \text{FeeTier} \times M$$
  - In-Range duration counter increments ($$+1$$).
- If $$P_t < P_{\min}$$ or $$P_t > P_{\max}$$:
  - **Status**: `OUT_OF_RANGE`
  - Fee Earned tick = USD 0.
  - Position becomes 100% token A or 100% token B (impermanent divergence visual).

### 4.4. Keeper Rebalance Mechanic
- Player can click **"Rebalance Range"** mid-run to center pillars on the current price.
- **Toll/Cost**: Consumes 10% of accrued fees or a fixed keeper energy toll, teaching that frequent rebalancing eats into yield.

### 4.5. Scoring Engine ("Market Keeper Score")
Final score is computed out of 1,000 points:
1. **Time in Range (400 pts max)**: $$(\text{Ticks In Range} / \text{Total Ticks}) \times 400$$
2. **Capital Efficiency (300 pts max)**: $$(M / 20.0) \times 300$$
3. **Volume Serviced (200 pts max)**: Normalized against baseline full-range pool
4. **Rebalance Discipline (100 pts max)**: Penalized for over-frequent rebalancing
- **Comparative Benchmark**: Always displays the player's return vs. a passive "Full Range" benchmark position on the exact same price path.

---

## 5. UI Component Hierarchy & Screens

### 5.1. Global Header
- Brand Mark: Pharaoh Scarab icon + "PHARAOH'S LIQUIDITY KINGDOM"
- Mode Tag: `RISK-FREE SIMULATOR // NO REAL FUNDS`
- Status Pill: Current simulated epoch / test wallet balance (USD 10,000 simulated).

### 5.2. Screen 1: Pool Selection Deck
- 3 interactive cards with 24h volume, volatility tag, base APR, and token pair icons.
- "Select Pool" button leads to Range Builder.

### 5.3. Screen 2: Range Builder & Strategy Cockpit
- Real-time mini SVG/Canvas price chart with:
  - Lower boundary drag handle ($$P_{\min}$$)
  - Upper boundary drag handle ($$P_{\max}$$)
  - Current price line with jeweled Scarab indicator
- Dynamic Stats Gauge:
  - Estimated Efficiency: e.g., `8.4x`
  - Historical probability of remaining in range
  - Expected fee rate preview
- Action CTA: `Start Market Day (30s Simulation) →`

### 5.4. Screen 3: Live Simulation Arena
- Central corridor visual: Price path with current price scarab crawling forward.
- Glowing vertical bounds showing the player's active liquidity range.
- Particle effects: Gold coin showers whenever trader caravans swap while price is in-range.
- Prominent badge: `[IN RANGE: +USD 4.80/s]` vs. `[OUT OF RANGE: EARNINGS PAUSED]`.
- Rebalance Action Button with countdown and cost warning.

### 5.5. Screen 4: Results & Governance Vote
- **Scorecard**:
  - Total Simulated Fees Earned
  - Comparative Performance: "Your concentrated position earned **3.4x** more than Full Range!"
  - Keeper Rank: (e.g., *Grand Vizier of Liquidity*, *Adept Keeper*, *Over-Leveraged Scribe*)
- **xPHAR Governance Module**:
  - Cast earned voting weight toward 1 of 3 incentive gauges to boost next season's emissions.
- Action CTAs: `Play Again` and `Share / Replay Run`.

---

## 6. Implementation Data Structures (Codex Reference)

export interface LiquidityPool {
  id: string;
  name: string;
  token0: string;
  token1: string;
  currentPrice: number;
  volatility: number; // standard deviation per step
  baseFee: number;    // e.g. 0.003 for 0.3%
  volume24h: number;  // USD simulated
}

export interface RangePosition {
  poolId: string;
  minPrice: number;
  maxPrice: number;
  depositUsd: number;
  multiplier: number;
}

export interface SimulationState {
  currentTick: number;
  totalTicks: number; // default 150 (30 seconds at 5hz)
  priceHistory: number[];
  currentPrice: number;
  isInRange: boolean;
  totalFeesEarned: number;
  ticksInRange: number;
  rebalanceCount: number;
  fullRangeBenchmarkFees: number;
}

---

## 7. Demo Video & Screen Recording Strategy (Contest Submission)
- **Target Video Duration**: 15–20 seconds (fits Competition 3 AI/Video and optional Competition 5).
- **Key Capture Moments**:
  1. Quick 2-second pool pick (`AVAX / USDC`).
  2. Dragging range handles tightly (`Efficiency: 12.5x`).
  3. Golden coin particle burst while price crawls between pillars.
  4. Quick cut to End Card: **"840 pts — Productive Liquidity Beat Full Range by 310%"**.
  5. Logo & Call to action: `pharaoh.exchange / phar.gg`.