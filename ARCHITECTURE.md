# Project Architecture: MMC Dashboard

> Auto-generated architecture reference. Last updated: 2026-02-18

## Quick Stats
- **Total folders:** 46 (inside `src/`)
- **Total files:** 167 (inside `src/`) + 15 root config files
- **Primary language(s):** TypeScript, TSX
- **Key frameworks:** Next.js 16 (App Router), React 19, Zustand 5, D3 7, Recharts 3, ECharts 6, Framer Motion 12, Radix UI, dnd-kit, TailwindCSS 4
- **Architecture pattern:** Client-side SPA with mock data engines, Zustand global stores, multi-window BroadcastChannel sync

---

## Overview

MMC Dashboard is a **real-time stock market trading dashboard** featuring:
- **Onion Chart** — interactive multi-ring D3 navigation (sectors → sub-sectors → tickers)
- **Compass Bar** — 18 drag-sortable market signal compasses across 3 layers
- **Money Maps** — rotation heatmaps, insider flow, hedge maps, sentiment overlays
- **Details Panel** — fundamentals, financials, volume, options, order book, insider, & news/price
- **News Feed** — multi-column configurable news with detachable windows
- **Watchlist Panel** — multi-group drag-sortable watchlists with notifications
- **Stock Screener** — filterable/sortable stock table
- **Managing Panel** — notes, to-do list, scheduled alerts, developer feedback
- **Layout system** — resizable panels, saveable presets, keyboard shortcuts, detachable windows

---

## Root `/`

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `package.json` | Project manifest — defines scripts, deps, and devDeps | — | `npm`, `next`, `jest` |
| `next.config.ts` | Next.js config (currently empty/default) | `next` | Next.js build pipeline |
| `tsconfig.json` | TypeScript config with `@/*` path alias to `./src/*` | — | TypeScript compiler |
| `eslint.config.mjs` | ESLint flat config using `eslint-config-next` | `eslint`, `eslint-config-next` | `npm run lint` |
| `postcss.config.mjs` | PostCSS config enabling Tailwind v4 via `@tailwindcss/postcss` | `@tailwindcss/postcss` | Next.js CSS pipeline |
| `jest.config.ts` | Jest config with `ts-jest`, jsdom, module name mappers | `jest`, `ts-jest`, `jest-environment-jsdom` | `npm run test` |
| `jest.setup.ts` | Jest setup with mocks for `matchMedia`, `ResizeObserver`, `BroadcastChannel` | `@testing-library/jest-dom` | Jest test runner |
| `playwright.config.ts` | Playwright E2E test config | `@playwright/test` | `npm run test:e2e` |
| `README.md` | Project readme | — | — |
| `WEBMCP_SETUP.md` | Guide for integrating Google WebMCP with Chrome Canary | — | — |
| `changes.html` | HTML changelog document | — | — |

---

## `/public/`
**Purpose:** Static assets served at the web root.

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `favicon.ico` | (in `src/app/`) App favicon | — | Browser |
| `file.svg` | File icon SVG | — | UI |
| `globe.svg` | Globe icon SVG | — | UI |
| `next.svg` | Next.js logo SVG | — | UI |
| `vercel.svg` | Vercel logo SVG | — | UI |
| `window.svg` | Window icon SVG | — | UI |

---

## `/src/app/`
**Purpose:** Next.js App Router pages and global styles — defines the route tree and root layout.

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `layout.tsx` | Root layout — applies Inter font, dark theme, TooltipProvider, ToastContainer, WebMCPProvider | `next/font`, `react-toastify`, `ui/Tooltip`, `WebMCPProvider`, `globals.css` | All pages |
| `page.tsx` | Main dashboard page — composes all widget components inside `DashboardLayout` | `useMarketUpdates`, `useKeyboardShortcuts`, `DashboardLayout`, all widget components | — (entry point) |
| `globals.css` | Global CSS — Tailwind imports, CSS custom properties, theme tokens, scrollbar styles, animations | `tailwindcss` | `layout.tsx` |
| `favicon.ico` | App favicon | — | Browser |

### `/src/app/detached/`
**Purpose:** Standalone pop-out pages for multi-window support via `BroadcastChannel`.

#### `/src/app/detached/news/`

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `page.tsx` | Detached news feed window — syncs state with main window via BroadcastChannel | `useMarketStore`, `useCompassStore`, `useNewsStore`, `useDetailsStore`, `useBroadcastChannel`, `syncEngine`, `NewsFeed` | Window manager |

#### `/src/app/detached/watchlist/`

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `page.tsx` | Detached watchlist window — syncs state with main window via BroadcastChannel | `useMarketUpdates`, `useWatchlistStore`, `useDetailsStore`, `useBroadcastChannel`, `syncEngine`, `WatchlistPanel` | Window manager |

---

## `/src/components/`
**Purpose:** All React UI components, organized by feature domain.

### `/src/components/` (root)

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `WebMCPProvider.tsx` | Registers MCP tools (navigate_ticker, get_watchlist, etc.) for AI agent integration | `react`, `useWatchlistStore` | `layout.tsx` |

---

### `/src/components/compass/`
**Purpose:** Compass bar widget system — displays 18 market signal compasses across 3 configurable layers.

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `CompassBar.tsx` | Horizontal compass bar with drag-to-reorder, layer tabs, summary popover | `@dnd-kit/core`, `@dnd-kit/sortable`, `useCompassStore`, `COMPASS_CONFIGS`, `SIGNAL_COLORS`, `CompassWidget` | `page.tsx` |
| `CompassWidget.tsx` | Individual compass gauge card with expandable detail panel (lazy-loaded) | `react`, `@dnd-kit/sortable`, `framer-motion`, `useCompassStore`, `SIGNAL_COLORS`, `ui/Tooltip`, `shared/Skeleton`, `shared/Portal` | `CompassBar.tsx` |

#### `/src/components/compass/decision-maker/`
**Purpose:** 5 "Decision Maker" layer compass detail panels — core market regime signals.

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `DollarLiquidity.tsx` | Dollar Liquidity compass detail — Fed balance sheet, repo, Treasury flows | `CompassState` type | `CompassWidget` (lazy) |
| `MarketRegime.tsx` | Market Regime compass detail — volatility regimes, correlation matrices | `CompassState`, `SIGNAL_COLORS` | `CompassWidget` (lazy) |
| `MicrosoftProxy.tsx` | Microsoft Proxy compass detail — MSFT as market proxy analysis | `react`, `CompassState` | `CompassWidget` (lazy) |
| `VIXCompass.tsx` | VIX Compass detail — VIX term structure, skew, mean-reversion | `CompassState` | `CompassWidget` (lazy) |
| `VolumeCompass.tsx` | Volume Compass detail — market-wide volume analysis | `react`, `CompassState` | `CompassWidget` (lazy) |

#### `/src/components/compass/safety-net/`
**Purpose:** 10 "Safety Net" layer compass detail panels — risk/positioning signals.

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `BreadthParticipation.tsx` | Market breadth participation metrics | `CompassState` | `CompassWidget` (lazy) |
| `ETFPassiveFlow.tsx` | ETF passive flow tracking | `CompassState` | `CompassWidget` (lazy) |
| `FearGreed.tsx` | Fear & Greed index composite | `CompassState` | `CompassWidget` (lazy) |
| `FuturesPositioning.tsx` | Futures positioning (COT-style) data | `CompassState` | `CompassWidget` (lazy) |
| `GammaCompass.tsx` | Gamma exposure compass | `CompassState`, `useOnionStore` | `CompassWidget` (lazy) |
| `SectorOverheat.tsx` | Sector overheat detection | `CompassState`, `useOnionStore` | `CompassWidget` (lazy) |
| `ShortInterest.tsx` | Short interest monitoring | `CompassState`, `useOnionStore` | `CompassWidget` (lazy) |
| `SocialSentiment.tsx` | Social sentiment analysis | `CompassState` | `CompassWidget` (lazy) |
| `StructureSR.tsx` | Market structure support/resistance levels | `CompassState` | `CompassWidget` (lazy) |
| `TrendQuality.tsx` | Trend quality assessment | `CompassState` | `CompassWidget` (lazy) |

#### `/src/components/compass/support/`
**Purpose:** 3 "Support" layer compass detail panels — supplementary analysis.

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `AnalystsCompass.tsx` | Analyst consensus compass | `CompassState` | `CompassWidget` (lazy) |
| `TechnicalAnomalies.tsx` | Technical anomaly detection | `CompassState` | `CompassWidget` (lazy) |
| `TimeCompass.tsx` | Time-based seasonality compass | `CompassState` | `CompassWidget` (lazy) |

---

### `/src/components/details/`
**Purpose:** Right-side details panel — shows deep-dive financial data for the selected ticker.

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `DetailsPanel.tsx` | Container with drag-sortable sections, expand/collapse controls, chart modals | `@dnd-kit/core`, `@dnd-kit/sortable`, `useDetailsStore`, `useMarketStore`, `useOnionStore`, `shared/ChartModal`, all section components | `page.tsx` |
| `FundamentalsSection.tsx` | Price chart (Recharts) with candlestick, EMA overlays, key stats | `useDetailsStore`, `useMarketStore`, `marketDataEngine`, `CHART_COLORS`, `recharts` | `DetailsPanel` |
| `FinancialsSection.tsx` | Income statement/balance sheet/cash flow with Sankey diagram | `useDetailsStore`, `financialGenerator`, `CHART_COLORS`, `recharts`, `SankeyChart` | `DetailsPanel` |
| `VolumeSection.tsx` | Volume analysis with bar/line charts | `useDetailsStore`, `useMarketStore`, `financialGenerator`, `CHART_COLORS`, `recharts` | `DetailsPanel` |
| `OptionsSection.tsx` | Options chain aggregate with put/call visualization | `useDetailsStore`, `financialGenerator`, `CHART_COLORS` | `DetailsPanel` |
| `OrderBookSection.tsx` | Order book depth with butterfly chart | `useDetailsStore`, `useMarketStore`, `orderBookGenerator`, `ButterflyChart` | `DetailsPanel` |
| `InsiderSection.tsx` | Insider trading timeline with D3 scatter + price overlay | `useDetailsStore`, `useMarketStore`, `orderBookGenerator`, `marketDataEngine`, `recharts`, `tickerGenerator` | `DetailsPanel` |
| `NewsPriceReactionSection.tsx` | News events overlaid on price chart | `useDetailsStore`, `useMarketStore`, `marketDataEngine`, `recharts` | `DetailsPanel` |
| `ButterflyChart.tsx` | Reusable horizontal bid/ask butterfly chart (D3) | `d3`, `market` types | `OrderBookSection` |
| `SankeyChart.tsx` | Reusable Sankey/flow diagram (D3) | `d3`, `financialGenerator` types, `utils` | `FinancialsSection` |

---

### `/src/components/layout/`
**Purpose:** Dashboard layout engine — resizable grid, window management, layout presets.

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `DashboardLayout.tsx` | Main responsive grid layout with drag-resizable column dividers | `useLayoutStore`, `useWatchlistStore`, `useNewsStore`, `LayoutManagerPanel`, `RatingOverlay`, `WindowManager`, `NotificationToastBridge` | `page.tsx` |
| `LayoutManager.tsx` | Layout preset selector dropdown (save/load/delete) | `useLayoutStore`, `ui/Button`, `ui/DropdownMenu`, `ui/Dialog` | `DashboardLayout` |
| `LayoutManagerPanel.tsx` | Full layout management overlay — compass ordering, widget visibility, presets | `framer-motion`, `useLayoutStore`, `useCompassStore`, `COMPASS_CONFIGS`, `SIGNAL_COLORS`, `ui/Button` | `DashboardLayout` |
| `RatingOverlay.tsx` | Animated app rating prompt overlay | `framer-motion`, `useLayoutStore`, `storageEngine` | `DashboardLayout` |
| `WidgetContainer.tsx` | Generic widget wrapper with consistent styling | `react`, `utils.cn` | `OnionChart`, `MoneyMaps`, `StockScreener`, `OrderBookButterfly` |
| `WindowManager.tsx` | Manages detached pop-out windows lifecycle | `useLayoutStore`, `useDetailsStore`, `useOnionStore`, `useNewsStore`, `useWatchlistStore`, `syncEngine`, `useWindowManager` | `DashboardLayout` |

---

### `/src/components/manage/`
**Purpose:** Managing/productivity panel — notes, to-do, alerts, and developer feedback.

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `ManagingPanel.tsx` | Tabbed container for Notes, Todo, Alerts, and DevFeedback sub-panels | `useLayoutStore`, `ui/Button`, `NotesEditor`, `TodoList`, `ScheduledAlerts`, `DevFeedback` | `page.tsx` |
| `NotesEditor.tsx` | Rich-text-like notes editor with create/edit/delete and localStorage | `uuid`, `useDetailsStore`, `storageEngine`, `layout` types | `ManagingPanel` |
| `TodoList.tsx` | Checklist to-do manager with localStorage persistence | `uuid`, `storageEngine`, `layout` types | `ManagingPanel` |
| `ScheduledAlerts.tsx` | Ticker price alert scheduler with notification integration | `uuid`, `useDetailsStore`, `useMarketStore`, `storageEngine`, `notificationEngine`, `layout` types | `ManagingPanel` |
| `DevFeedback.tsx` | Developer feedback/bug report form with localStorage | `uuid`, `storageEngine` | `ManagingPanel` |

---

### `/src/components/moneymap/`
**Purpose:** Money Maps panel — financial heatmaps, rotation analysis, insider flows, and overlays.

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `MoneyMaps.tsx` | Tabbed container routing between 9 map/overlay sub-views | `useOnionStore`, `WidgetContainer`, all maps/guidance/support children | `page.tsx` |

#### `/src/components/moneymap/maps/`
**Purpose:** 5 rotation/selection heatmap views.

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `CrossAssetRotation.tsx` | Cross-asset class rotation (bar chart) | `recharts`, `useMarketStore`, `ASSET_CLASSES` | `MoneyMaps` |
| `SectorRotation.tsx` | Sector rotation scatter plot | `recharts`, `sectorGenerator` | `MoneyMaps` |
| `SubSectorRotation.tsx` | Sub-sector treemap (recharts Treemap) | `recharts`, `useOnionStore`, `useMarketStore`, `SECTOR_HIERARCHY`, `TICKER_UNIVERSE` | `MoneyMaps` |
| `FactorStyleRotation.tsx` | Factor/style radar chart | `recharts`, `FACTOR_STYLES`, `useMarketStore` | `MoneyMaps` |
| `StockSelection.tsx` | Individual stock selection table | `useMarketStore`, `useDetailsStore`, `TICKER_UNIVERSE`, `tickerGenerator` | `MoneyMaps` |

#### `/src/components/moneymap/guidance/`
**Purpose:** Insider & buyback flow guidance panel.

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `InsiderBuybackFlow.tsx` | Insider buying/selling + buyback flow timeline (Recharts) | `recharts`, `useDetailsStore`, `useMarketStore`, `orderBookGenerator`, `marketDataEngine`, `tickerGenerator` | `MoneyMaps` |

#### `/src/components/moneymap/support/`
**Purpose:** Overlay support panels (calendar, hedge map, social sentiment).

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `CalendarOverlay.tsx` | Earnings/events calendar overlay | `useDetailsStore` | `MoneyMaps` |
| `HedgeMap.tsx` | Hedge map visualization | `react` | `MoneyMaps` |
| `SocialSentimentOverlay.tsx` | Social sentiment area chart (Recharts) | `recharts`, `useDetailsStore` | `MoneyMaps` |

---

### `/src/components/news/`
**Purpose:** Multi-column news feed with configurable feeds and detachable windows.

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `NewsFeed.tsx` | News feed container — manages feed columns, filters by watchlist/sector | `useNewsStore`, `useOnionStore`, `useWatchlistStore`, `useDetachable`, `useBroadcastChannel`, `NewsFeedColumn` | `page.tsx`, `detached/news/page.tsx` |
| `NewsFeedColumn.tsx` | Single scrollable news column with auto-scroll | `react`, `NewsItem` types, `NewsFeedConfig` types, `NewsItemRow`, `useNewsStore` | `NewsFeed` |
| `NewsItem.tsx` | Individual news card with hover tooltip via portal | `react`, `react-dom/createPortal`, `NewsItem` type, `utils`, `NewsTooltip` | `NewsFeedColumn` |
| `NewsTooltip.tsx` | Floating tooltip for a news item | `NewsItem` type, `utils.formatTime` | `NewsItem` |

---

### `/src/components/onion/`
**Purpose:** Central Onion Chart — interactive concentric ring navigation (indices → sectors → sub-sectors → tickers).

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `OnionChart.tsx` | Main D3 onion chart — handles ring rendering, drill-down, ticker selection | `d3`, `useOnionStore`, `useMarketStore`, `useDetailsStore`, `WidgetContainer`, `OnionTooltip`, `SECTOR_HIERARCHY`, `TICKER_UNIVERSE`, market types | `page.tsx` |
| `OnionControls.tsx` | Timeframe/ring toggle controls | `useOnionStore` | `OnionChart` |
| `OnionPie.tsx` | Helper component for inner pie/donut rendering | `d3`, `react` | `OnionChart` |
| `OnionRing.tsx` | Helper component for individual ring arc rendering | `d3`, `OnionSegment` type | `OnionChart` |
| `OnionTooltip.tsx` | Ticker/segment hover tooltip | `Ticker` type, `utils`, `tickerGenerator.formatVolume` | `OnionChart` |
| `OrderBookButterfly.tsx` | Mini order-book butterfly chart shown within onion drill-down | `d3`, `useMarketStore`, `useDetailsStore`, `orderBookGenerator`, `WidgetContainer` | `OnionChart` |

---

### `/src/components/screener/`
**Purpose:** Stock screener table.

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `StockScreener.tsx` | Filterable, sortable stock screener table with presets | `react`, `utils`, `WidgetContainer`, `useScreenerStore`, `useDetailsStore`, `useMarketStore`, `TICKER_UNIVERSE`, `screener` types | `page.tsx` |

---

### `/src/components/shared/`
**Purpose:** Reusable utility components used across multiple feature domains.

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `ChartModal.tsx` | Fullscreen chart expansion dialog wrapper | `react`, `ui/Dialog`, `ui/Button` | `DetailsPanel` |
| `DragHandle.tsx` | Generic drag-handle icon for sortable lists | `utils.cn` | Various sortable components |
| `Portal.tsx` | React portal component for overlays/tooltips | `react`, `react-dom/createPortal` | `CompassWidget` |
| `Skeleton.tsx` | Loading skeleton with shimmer animation | `utils.cn` | `CompassWidget` |

---

### `/src/components/ui/`
**Purpose:** Low-level Radix UI primitive wrappers — project design system atoms.

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `Button.tsx` | Button component with variant system | `@radix-ui/react-slot`, `utils.cn` | `LayoutManager`, `LayoutManagerPanel`, `ManagingPanel`, `ChartModal` |
| `Dialog.tsx` | Dialog/modal component | `@radix-ui/react-dialog` | `ChartModal`, `LayoutManager` |
| `DropdownMenu.tsx` | Dropdown menu component | `@radix-ui/react-dropdown-menu` | `LayoutManager` |
| `ScrollArea.tsx` | Custom scroll area | `@radix-ui/react-scroll-area` | Various |
| `Tooltip.tsx` | Tooltip component with provider | `@radix-ui/react-tooltip` | `layout.tsx`, `CompassWidget` |

---

### `/src/components/watchlist/`
**Purpose:** Watchlist panel — multi-group drag-sortable watchlists with search, notifications, and color coding.

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `WatchlistPanel.tsx` | Main watchlist container — groups, search, DnD reordering, detachable | `@dnd-kit/core`, `@dnd-kit/sortable`, `useWatchlistStore`, `useDetachable`, `useBroadcastChannel`, `WatchlistSearch`, `WatchlistGroup`, `NotificationSettings` | `page.tsx`, `detached/watchlist/page.tsx` |
| `WatchlistGroup.tsx` | Single watchlist group — expandable, color-coded, items DnD | `@dnd-kit/core`, `@dnd-kit/sortable`, `useWatchlistStore`, `useMarketStore`, `WatchlistItem`, `WatchlistColorPicker` | `WatchlistPanel` |
| `WatchlistItem.tsx` | Individual watchlist row — price, change, mini sparkline, click-to-select | `useWatchlistStore`, `useDetailsStore`, `useOnionStore`, `market` types, `watchlist` types | `WatchlistGroup` |
| `WatchlistSearch.tsx` | Ticker search input with sector-grouped results | `TICKER_UNIVERSE`, `SECTORS`, `useWatchlistStore`, `watchlist` types | `WatchlistPanel` |
| `WatchlistColorPicker.tsx` | Color swatch picker for watchlist groups | `WATCHLIST_COLORS`, `utils.cn` | `WatchlistGroup` |
| `NotificationSettings.tsx` | Group-level notification settings toggler | `useWatchlistStore`, `watchlist` types, `notificationEngine` | `WatchlistPanel` |
| `NotificationToastBridge.tsx` | Bridge connecting notification engine to react-toastify | `react-toastify`, `useNewsStore`, `useWatchlistStore`, `notificationEngine` | `DashboardLayout` |

---

## `/src/data/`
**Purpose:** Data layer — type definitions, constants, and mock data generators (no real API calls).

### `/src/data/types/`
**Purpose:** TypeScript type/interface definitions for all data models.

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `market.ts` | Core market types — `Ticker`, `PricePoint`, `MarketIndex`, `OrderBook`, `OptionsData`, `FinancialStatement`, `InsiderTrade`, `Timeframe` | — | Stores, generators, components (widely used) |
| `compass.ts` | Compass types — `CompassId`, `CompassState`, `CompassSignal`, `CompassConfig`, `CompassLayer`, `CompassBarState` | — | Compass stores, generators, compass components |
| `news.ts` | News types — `NewsItem`, `NewsFeedConfig`, `NewsFeedState`, `NewsFeedType`, `NewsSentiment`, `NewsSource` | — | News stores, generators, news components |
| `onion.ts` | Onion chart types — `OnionState`, `OnionRingType`, `OnionSegment`, `MoneyMapType` | `./market` (Timeframe) | Onion stores, onion/moneymap components |
| `watchlist.ts` | Watchlist types — `WatchlistGroup`, `WatchlistItem`, `NotificationFrequency` | — | Watchlist stores, components, notification engine |
| `layout.ts` | Layout types — `LayoutPreset`, `DetailsSection`, `WidgetId`, `TodoEntry`, `NoteEntry`, `AlertEntry` | — | Layout store, manage components |
| `screener.ts` | Screener types — `ScreenerSortField`, `ScreenerPreset` | — | Screener store, `StockScreener` |

### `/src/data/constants/`
**Purpose:** Static constant data (tickers, sectors, colors, compass configs).

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `tickers.ts` | ~500 ticker definitions (`TICKER_UNIVERSE`) with sector, price, market cap | — | `marketDataEngine`, `OnionChart`, `StockScreener`, `WatchlistSearch`, `SubSectorRotation`, `StockSelection`, `newsGenerator`, `useScreenerStore` |
| `sectors.ts` | Sector hierarchy (`SECTOR_HIERARCHY`), `SECTORS`, `FACTOR_STYLES`, `ASSET_CLASSES` | — | `OnionChart`, `SectorRotation`, `SubSectorRotation`, `FactorStyleRotation`, `CrossAssetRotation`, `sectorGenerator`, `newsGenerator`, `WatchlistSearch` |
| `colors.ts` | Color constants — `SIGNAL_COLORS`, `CHART_COLORS`, `WATCHLIST_COLORS`, `NEWS_FEED_COLORS` | — | Compass, details, watchlist, news components and stores |
| `compassConfig.ts` | Compass configs (`COMPASS_CONFIGS`) and `DEFAULT_COMPASS_ORDER` for all 18 compasses | `compass` types | `useCompassStore`, `CompassBar`, `LayoutManagerPanel`, `compassDataGenerator` |

### `/src/data/generators/`
**Purpose:** Mock data generation engines — produce realistic, randomized financial data.

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `marketDataEngine.ts` | Core market data engine — generates/updates tickers, price histories, indices | `market` types, `TICKER_UNIVERSE` | `useMarketStore`, `FundamentalsSection`, `InsiderSection`, `NewsPriceReactionSection`, `InsiderBuybackFlow` |
| `compassDataGenerator.ts` | Generates all 18 compass states with signals and metadata | `compass` types, `COMPASS_CONFIGS` | `useCompassStore` |
| `financialGenerator.ts` | Generates financial statements, volume data, options aggregates, Sankey data | `market` types | `FinancialsSection`, `VolumeSection`, `OptionsSection` |
| `newsGenerator.ts` | Generates realistic news items for all feed types | `uuid`, `news` types, `TICKER_UNIVERSE`, `SECTORS` | `useNewsStore` |
| `orderBookGenerator.ts` | Generates order books, options chains, and insider trade data | `market` types | `OrderBookSection`, `InsiderSection`, `InsiderBuybackFlow`, `OrderBookButterfly` |
| `sectorGenerator.ts` | Generates sector rotation scatter-plot data | `SECTOR_HIERARCHY` | `SectorRotation` |
| `tickerGenerator.ts` | Utility — `formatVolume` helper, ticker lookup | `TICKER_UNIVERSE` | `OnionTooltip`, `InsiderSection`, `StockSelection`, `InsiderBuybackFlow` |

---

## `/src/hooks/`
**Purpose:** Custom React hooks — data lifecycle, keyboard shortcuts, window management, cross-window sync.

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `useMarketUpdates.ts` | Starts interval-based market, compass, and news data refresh cycles | `useMarketStore`, `useCompassStore`, `useNewsStore` | `page.tsx`, `detached/watchlist/page.tsx` |
| `useKeyboardShortcuts.ts` | Global keyboard shortcuts (Ctrl+L, Ctrl+W, 1-8, Esc, etc.) | `useLayoutStore`, `useWatchlistStore` | `page.tsx` |
| `useWindowManager.ts` | Open/close/track detached pop-out windows | `useLayoutStore`, `useNewsStore`, `useWatchlistStore`, `syncEngine` | `WindowManager`, `useDetachable` |
| `useDetachable.ts` | Convenience hook wrapping `useWindowManager` for detach button logic | `useWindowManager` | `NewsFeed`, `WatchlistPanel` |
| `useBroadcastChannel.ts` | Subscribes to `BroadcastChannel` sync messages for cross-window state | `syncEngine` | `NewsFeed`, `WatchlistPanel`, detached pages |
| `useWidgetDrag.ts` | Handles widget drag-start/end for layout rearrangement | `useLayoutStore` | Various widgets |

---

## `/src/lib/`
**Purpose:** Core utility libraries — persistence, sync, notifications, formatting.

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `utils.ts` | Utility functions — `cn`, `formatNumber`, `formatCurrency`, `formatPercent`, `formatTime`, `formatRelativeTime`, `debounce`, `throttle`, `clamp`, `lerp` | — | Almost all components |
| `storageEngine.ts` | localStorage persistence with `mmc-dashboard:` prefix — save/load/export/import | — | `useWatchlistStore`, `useSettingsStore`, `useLayoutStore`, `NotesEditor`, `TodoList`, `ScheduledAlerts`, `DevFeedback`, `RatingOverlay` |
| `syncEngine.ts` | BroadcastChannel-based cross-window state synchronization | — | `useWatchlistStore`, `useNewsStore`, `useWindowManager`, `useBroadcastChannel`, detached pages |
| `notificationEngine.ts` | Browser/in-app notification system with digest batching | `watchlist` types | `NotificationSettings`, `ScheduledAlerts`, `NotificationToastBridge` |

---

## `/src/stores/`
**Purpose:** Zustand global state stores — single source of truth for all app state.

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `useMarketStore.ts` | Tickers map, market indices, price data, `refreshTickers()` | `zustand`, `market` types, `marketDataEngine` | `OnionChart`, `DetailsPanel` sections, MoneyMap children, `StockScreener`, `WatchlistGroup`, `ScheduledAlerts`, `useMarketUpdates` |
| `useCompassStore.ts` | 18 compass states, compass order, layer visibility, bar state | `zustand`, `compass` types, `compassConfig`, `compassDataGenerator` | `CompassBar`, `CompassWidget`, `LayoutManagerPanel`, `useMarketUpdates`, `useLayoutStore` |
| `useDetailsStore.ts` | Selected ticker symbol, active section, section order/visibility | `zustand` | `DetailsPanel`, all detail sections, `WatchlistItem`, `OnionChart`, MoneyMap children, `StockScreener`, `NotesEditor`, `ScheduledAlerts`, `WindowManager` |
| `useOnionStore.ts` | Onion chart drill-down state, active ring, timeframe, selected MoneyMap | `zustand`, `onion` types, `market` types | `OnionChart`, `OnionControls`, `MoneyMaps`, `SubSectorRotation`, compass safety-net components, `NewsFeed` |
| `useLayoutStore.ts` | Layout presets, column widths, widget visibility, panel toggle states, rating state | `zustand`, `uuid`, `layout` types, `storageEngine`, `react-toastify`, `useCompassStore` | `DashboardLayout`, `LayoutManager`, `LayoutManagerPanel`, `RatingOverlay`, `WindowManager`, `ManagingPanel`, `useKeyboardShortcuts`, `useWidgetDrag` |
| `useNewsStore.ts` | News items, feed configs, feed state, feed generation, feed management | `zustand`, `news` types, `NEWS_FEED_COLORS`, `newsGenerator`, `syncEngine` | `NewsFeed`, `NewsFeedColumn`, `NotificationToastBridge`, `WindowManager`, `detached/news`, `useMarketUpdates` |
| `useWatchlistStore.ts` | Watchlist groups, items, CRUD operations, notification settings, persistence | `zustand`, `uuid`, `watchlist` types, `WATCHLIST_COLORS`, `storageEngine`, `syncEngine`, `react-toastify`, `watchlists.json` | `WatchlistPanel`, `WatchlistGroup`, `WatchlistItem`, `WatchlistSearch`, `NotificationSettings`, `NotificationToastBridge`, `WebMCPProvider`, `DashboardLayout`, `WindowManager`, `NewsFeed`, `useKeyboardShortcuts`, `useWindowManager` |
| `useScreenerStore.ts` | Screener filters, sorts, presets, computed filtered results | `zustand`, `market` types, `screener` types, `useMarketStore`, `TICKER_UNIVERSE` | `StockScreener` |
| `useSettingsStore.ts` | Global settings (theme, animations, data refresh rate) | `zustand`, `storageEngine` | Settings panel (future) |

---

## `/src/json/`
**Purpose:** Static JSON seed data for initial app state.

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `watchlists.json` | Default watchlist groups seed data | — | `useWatchlistStore` |
| `userPreferences.json` | Default user preference settings | — | `useSettingsStore` |
| `managingPane.json` | Managing panel default state | — | Managing components |
| `developerAnalytics.json` | Developer analytics seed data | — | `DevFeedback` |

---

## `/src/__mocks__/`
**Purpose:** Manual Jest mocks for ESM-only packages.

| File | Description | Dependencies | Used By |
|------|-------------|--------------|---------|
| `d3.ts` | Comprehensive D3 mock — all used `d3` APIs return chainable jest.fn() stubs | `jest` | All D3-dependent tests |
| `uuid.ts` | UUID mock returning deterministic values | `jest` | Tests using `uuid` |

---

## `/src/__tests__/`
**Purpose:** Unit and component tests organized mirroring the `src/` structure.

<details>
<summary><strong>39 test files across 9 directories</strong></summary>

### Test coverage by domain:

| Domain | Tests | Coverage |
|--------|-------|----------|
| `components/compass/` | `CompassBar.test.tsx`, `CompassWidget.test.tsx`, `decision-maker.test.tsx`, `safety-net.test.tsx`, `support.test.tsx`, `helpers.ts` | Compass bar rendering, widget states, all 18 detail panels |
| `components/details/` | `DetailsPanel.test.tsx` | Details panel rendering and section toggling |
| `components/layout/` | `DashboardLayout.test.tsx`, `LayoutManagerPanel.test.tsx`, `RatingOverlay.test.tsx` | Layout grid, preset manager, rating overlay |
| `components/manage/` | `DevFeedback.test.tsx`, `ManagingPanel.test.tsx`, `NotesEditor.test.tsx`, `ScheduledAlerts.test.tsx`, `TodoList.test.tsx` | All management sub-panels |
| `components/moneymap/` | `MoneyMaps.test.tsx` | Money maps tab routing |
| `components/news/` | `NewsFeed.test.tsx` | News feed rendering |
| `components/onion/` | `OnionChart.test.tsx` | Onion chart D3 rendering |
| `components/watchlist/` | `NotificationSettings.test.tsx`, `WatchlistPanel.test.tsx` | Watchlist panel & notifications |
| `data/generators/` | 7 test files | All data generators |
| `hooks/` | `useKeyboardShortcuts.test.ts` | Keyboard shortcut bindings |
| `lib/` | `notificationEngine.test.ts`, `storageEngine.test.ts`, `syncEngine.test.ts`, `utils.test.ts` | All lib utilities |
| `stores/` | 7 test files (all stores) | All Zustand stores |

</details>

---

## Dependency Graph (Key Relationships)

```
src/app/page.tsx (main entry)
├── hooks/useMarketUpdates ─────────────┐
│   ├── stores/useMarketStore ──────────┤
│   │   └── data/generators/marketDataEngine
│   │       └── data/constants/tickers
│   ├── stores/useCompassStore ─────────┤
│   │   ├── data/generators/compassDataGenerator
│   │   │   └── data/constants/compassConfig
│   │   └── data/constants/compassConfig
│   └── stores/useNewsStore ────────────┤
│       ├── data/generators/newsGenerator
│       │   ├── data/constants/tickers
│       │   └── data/constants/sectors
│       └── lib/syncEngine
│
├── hooks/useKeyboardShortcuts
│   ├── stores/useLayoutStore
│   │   ├── lib/storageEngine
│   │   └── stores/useCompassStore
│   └── stores/useWatchlistStore
│       ├── lib/storageEngine
│       └── lib/syncEngine
│
├── components/layout/DashboardLayout
│   ├── stores/useLayoutStore
│   ├── components/layout/LayoutManagerPanel
│   ├── components/layout/RatingOverlay
│   ├── components/layout/WindowManager
│   │   └── hooks/useWindowManager
│   └── components/watchlist/NotificationToastBridge
│       └── lib/notificationEngine
│
├── components/compass/CompassBar
│   └── components/compass/CompassWidget
│       └── [lazy] compass/decision-maker/*
│       └── [lazy] compass/safety-net/*
│       └── [lazy] compass/support/*
│
├── components/onion/OnionChart
│   ├── stores/useOnionStore
│   ├── stores/useMarketStore
│   └── stores/useDetailsStore
│
├── components/moneymap/MoneyMaps
│   ├── moneymap/maps/* (5 views)
│   ├── moneymap/guidance/InsiderBuybackFlow
│   └── moneymap/support/* (3 overlays)
│
├── components/details/DetailsPanel
│   └── details/* (7 sections + 2 chart components)
│       └── data/generators/* (financial, orderBook, market)
│
├── components/news/NewsFeed
│   └── news/NewsFeedColumn → news/NewsItem → news/NewsTooltip
│
├── components/watchlist/WatchlistPanel
│   └── watchlist/WatchlistGroup → watchlist/WatchlistItem
│
├── components/screener/StockScreener
│   └── stores/useScreenerStore
│
└── components/manage/ManagingPanel
    ├── manage/NotesEditor
    ├── manage/TodoList
    ├── manage/ScheduledAlerts
    └── manage/DevFeedback
```

### Cross-Cutting Concerns

```
lib/utils ──────────────────── Used by: ~40+ components
lib/storageEngine ──────────── Used by: stores (layout, watchlist, settings), manage components, RatingOverlay
lib/syncEngine ─────────────── Used by: stores (watchlist, news), hooks (windowManager, broadcastChannel), detached pages
lib/notificationEngine ─────── Used by: NotificationSettings, ScheduledAlerts, NotificationToastBridge
data/constants/tickers ─────── Used by: marketDataEngine, OnionChart, StockScreener, WatchlistSearch, newGenerator, MoneyMap children
data/constants/sectors ─────── Used by: OnionChart, SectorRotation, SubSectorRotation, sectorGenerator, newsGenerator, WatchlistSearch
data/constants/colors ──────── Used by: compass components, details sections, watchlist, news stores
data/types/* ────────────────── Used by: corresponding stores, generators, and components
```

---

## External Dependencies

| Package | Version | Used In |
|---------|---------|---------|
| `next` | ^16.1.6 | App framework (routing, SSR, bundling) |
| `react` / `react-dom` | ^19.2.3 | Core UI library |
| `zustand` | ^5.0.11 | All stores (`/src/stores/*`) |
| `d3` | ^7.9.0 | `OnionChart`, `ButterflyChart`, `SankeyChart`, `OnionRing`, `OnionPie`, `OrderBookButterfly` |
| `recharts` | ^3.7.0 | `FundamentalsSection`, `FinancialsSection`, `VolumeSection`, `InsiderSection`, `NewsPriceReactionSection`, `InsiderBuybackFlow`, all MoneyMap charts |
| `echarts` / `echarts-for-react` | ^6.0.0 / ^3.0.6 | Reserved for complex chart scenarios |
| `framer-motion` | ^12.34.0 | `CompassWidget`, `LayoutManagerPanel`, `RatingOverlay` |
| `@dnd-kit/core` / `sortable` / `utilities` | ^6.3.1 / ^10.0.0 / ^3.2.2 | `CompassBar`, `DetailsPanel`, `WatchlistPanel`, `WatchlistGroup` |
| `@radix-ui/react-*` | Various | `ui/Button`, `ui/Dialog`, `ui/DropdownMenu`, `ui/ScrollArea`, `ui/Tooltip` |
| `react-toastify` | ^11.0.5 | `layout.tsx`, `NotificationToastBridge`, stores |
| `uuid` | ^13.0.0 | `useWatchlistStore`, `useLayoutStore`, manage components, `newsGenerator` |
| `zod` | ^4.3.6 | Form validation (available, usage TBD) |
| `react-hook-form` / `@hookform/resolvers` | ^7.71.1 / ^5.2.2 | Form management (available, usage TBD) |
| `tailwindcss` | ^4 | Global CSS via `@tailwindcss/postcss` |
| `typescript` | ^5 | Type system |
| `jest` / `ts-jest` | ^30.2.0 / ^29.4.6 | Unit testing |
| `@playwright/test` | ^1.58.2 | E2E testing |
| `@testing-library/react` / `jest-dom` | ^16.3.2 / ^6.9.1 | Component testing utilities |
