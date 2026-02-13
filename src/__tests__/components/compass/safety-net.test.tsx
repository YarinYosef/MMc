import React from 'react';
import { render, screen } from '@testing-library/react';
import { SocialSentiment } from '@/components/compass/safety-net/SocialSentiment';
import { FearGreed } from '@/components/compass/safety-net/FearGreed';
import { StructureSR } from '@/components/compass/safety-net/StructureSR';
import { GammaCompass } from '@/components/compass/safety-net/GammaCompass';
import { ShortInterest } from '@/components/compass/safety-net/ShortInterest';
import { BreadthParticipation } from '@/components/compass/safety-net/BreadthParticipation';
import { TrendQuality } from '@/components/compass/safety-net/TrendQuality';
import { ETFPassiveFlow } from '@/components/compass/safety-net/ETFPassiveFlow';
import { FuturesPositioning } from '@/components/compass/safety-net/FuturesPositioning';
import { SectorOverheat } from '@/components/compass/safety-net/SectorOverheat';
import { makeState } from './helpers';

// Mock useOnionStore for Gamma, ShortInterest, SectorOverheat
jest.mock('@/stores/useOnionStore', () => ({
  useOnionStore: (selector: (s: { selectedSegment: string | null }) => unknown) =>
    selector({ selectedSegment: 'AAPL' }),
}));

// ─── SocialSentiment ────────────────────────────────────────────────────────

describe('SocialSentiment', () => {
  const euphState = makeState('social-sentiment', {
    details: { mood: 'Euphoric', sentimentIndex: 85, twitterScore: 80, redditScore: 75, newsScore: 90 },
  });
  const panicState = makeState('social-sentiment', {
    details: { mood: 'Panic', sentimentIndex: 12, twitterScore: 15, redditScore: 10, newsScore: 20 },
  });

  it('renders closed mode with mood and index', () => {
    render(<SocialSentiment state={euphState} expanded={false} />);
    expect(screen.getByText('Social')).toBeInTheDocument();
    expect(screen.getByText('Euphoric')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
  });

  it('renders panic mood correctly in closed mode', () => {
    render(<SocialSentiment state={panicState} expanded={false} />);
    expect(screen.getByText('Panic')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('renders expanded mode with composite gauge and channel breakdown', () => {
    render(<SocialSentiment state={euphState} expanded={true} />);
    expect(screen.getByText('Social Sentiment')).toBeInTheDocument();
    expect(screen.getByText('Composite Index')).toBeInTheDocument();
    expect(screen.getByText('X / Twitter')).toBeInTheDocument();
    expect(screen.getByText('Reddit')).toBeInTheDocument();
    expect(screen.getByText('News Media')).toBeInTheDocument();
  });

  it('renders channel icon badges', () => {
    render(<SocialSentiment state={euphState} expanded={true} />);
    expect(screen.getByText('X')).toBeInTheDocument();
    expect(screen.getByText('R')).toBeInTheDocument();
    expect(screen.getByText('N')).toBeInTheDocument();
  });
});

// ─── FearGreed ──────────────────────────────────────────────────────────────

describe('FearGreed', () => {
  const greedState = makeState('fear-greed', {
    details: { index: 82, label: 'Extreme Greed', previous: 75, weekAgo: 60 },
  });
  const fearState = makeState('fear-greed', {
    details: { index: 15, label: 'Extreme Fear', previous: 22, weekAgo: 40 },
  });

  it('renders closed mode with index and label', () => {
    render(<FearGreed state={greedState} expanded={false} />);
    expect(screen.getByText('F&G')).toBeInTheDocument();
    expect(screen.getByText('82')).toBeInTheDocument();
    // indexLabel(82) = 'Extreme Greed'
    expect(screen.getByText('Extreme Greed')).toBeInTheDocument();
  });

  it('renders fear state in closed mode', () => {
    render(<FearGreed state={fearState} expanded={false} />);
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Extreme Fear')).toBeInTheDocument();
  });

  it('renders expanded mode with semicircle gauge', () => {
    const { container } = render(<FearGreed state={greedState} expanded={true} />);
    expect(screen.getByText('Fear & Greed Index')).toBeInTheDocument();
    // Should have an SVG gauge
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('renders historical comparison in expanded mode', () => {
    render(<FearGreed state={greedState} expanded={true} />);
    expect(screen.getByText('Now')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Week Ago')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
  });

  it('shows change delta in historical comparison', () => {
    render(<FearGreed state={greedState} expanded={true} />);
    // change = 82 - 75 = +7
    expect(screen.getByText('+7')).toBeInTheDocument();
  });
});

// ─── StructureSR ────────────────────────────────────────────────────────────

describe('StructureSR', () => {
  const balancedState = makeState('structure-sr', {
    confidence: 70,
    details: {
      status: 'Balanced',
      nearestSupport: 440.50,
      nearestResistance: 460.25,
      distanceToSupport: 2.50,
      distanceToResistance: 3.10,
    },
  });

  it('renders closed mode with status and distances', () => {
    render(<StructureSR state={balancedState} expanded={false} />);
    expect(screen.getByText('S/R')).toBeInTheDocument();
    expect(screen.getByText('Balanced')).toBeInTheDocument();
    expect(screen.getByText('2.5% / 3.1%')).toBeInTheDocument();
  });

  it('renders expanded mode with price position bar', () => {
    render(<StructureSR state={balancedState} expanded={true} />);
    expect(screen.getByText('Structure S/R')).toBeInTheDocument();
    expect(screen.getByText('Price Position')).toBeInTheDocument();
    expect(screen.getByText('$440.50')).toBeInTheDocument();
    expect(screen.getByText('$460.25')).toBeInTheDocument();
  });

  it('renders distance metrics', () => {
    render(<StructureSR state={balancedState} expanded={true} />);
    expect(screen.getByText('Distance to Support')).toBeInTheDocument();
    expect(screen.getByText('Distance to Resistance')).toBeInTheDocument();
    expect(screen.getByText('2.50%')).toBeInTheDocument();
    expect(screen.getByText('3.10%')).toBeInTheDocument();
  });

  it('shows range and confidence in footer', () => {
    render(<StructureSR state={balancedState} expanded={true} />);
    expect(screen.getByText('$19.75')).toBeInTheDocument(); // range: 460.25 - 440.50
    expect(screen.getByText('70%')).toBeInTheDocument();
  });

  it('renders Extreme status correctly', () => {
    const extremeState = makeState('structure-sr', {
      details: { status: 'Extreme', nearestSupport: 420, nearestResistance: 480, distanceToSupport: 8, distanceToResistance: 1.5 },
    });
    render(<StructureSR state={extremeState} expanded={false} />);
    expect(screen.getByText('Extreme')).toBeInTheDocument();
  });
});

// ─── GammaCompass (with Onion store mock) ───────────────────────────────────

describe('GammaCompass', () => {
  const positiveGex = makeState('gamma', {
    details: {
      gex: 1500,
      isPositive: 'Positive',
      spxGex: 800,
      qqqGex: 400,
      iwmGex: 100,
      onionAssetGex: 200,
      flipLevel: 4500,
    },
  });

  const negativeGex = makeState('gamma', {
    details: {
      gex: -2000,
      isPositive: 'Negative',
      spxGex: -1200,
      qqqGex: -500,
      iwmGex: -100,
      onionAssetGex: -200,
      flipLevel: 4350,
    },
  });

  it('renders closed mode with GEX value', () => {
    render(<GammaCompass state={positiveGex} expanded={false} />);
    expect(screen.getByText('GEX')).toBeInTheDocument();
    expect(screen.getByText('+1,500')).toBeInTheDocument();
  });

  it('renders negative GEX in closed mode', () => {
    render(<GammaCompass state={negativeGex} expanded={false} />);
    // Negative GEX doesn't show + prefix
    const gexText = screen.getByText('-2,000');
    expect(gexText).toBeInTheDocument();
  });

  it('renders expanded mode with index breakdown', () => {
    render(<GammaCompass state={positiveGex} expanded={true} />);
    expect(screen.getByText('Gamma Exposure')).toBeInTheDocument();
    expect(screen.getByText('Positive')).toBeInTheDocument();
    expect(screen.getByText('SPX')).toBeInTheDocument();
    expect(screen.getByText('QQQ')).toBeInTheDocument();
    expect(screen.getByText('IWM')).toBeInTheDocument();
  });

  it('integrates with onion store showing selected segment', () => {
    render(<GammaCompass state={positiveGex} expanded={true} />);
    // The mock returns 'AAPL' as selectedSegment
    expect(screen.getByText('AAPL')).toBeInTheDocument();
  });

  it('renders flip level and regime in footer', () => {
    render(<GammaCompass state={positiveGex} expanded={true} />);
    expect(screen.getByText('Flip Level')).toBeInTheDocument();
    expect(screen.getByText('Regime')).toBeInTheDocument();
    expect(screen.getByText('Dealer Long')).toBeInTheDocument();
  });

  it('shows Dealer Short for negative gamma', () => {
    render(<GammaCompass state={negativeGex} expanded={true} />);
    expect(screen.getByText('Dealer Short')).toBeInTheDocument();
  });
});

// ─── ShortInterest (with Onion store mock) ──────────────────────────────────

describe('ShortInterest', () => {
  const highSI = makeState('short-interest', {
    details: {
      siRatio: 18.50,
      level: 'High',
      daysTocover: 8.5,
      costToBorrow: 25.00,
      utilization: 85,
      onionAssetSI: 22.50,
    },
  });

  const lowSI = makeState('short-interest', {
    details: {
      siRatio: 3.20,
      level: 'Low',
      daysTocover: 1.5,
      costToBorrow: 0.80,
      utilization: 20,
      onionAssetSI: 2.10,
    },
  });

  it('renders closed mode with level and SI ratio', () => {
    render(<ShortInterest state={highSI} expanded={false} />);
    expect(screen.getByText('SI')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('18.5%')).toBeInTheDocument();
  });

  it('renders low SI state in closed mode', () => {
    render(<ShortInterest state={lowSI} expanded={false} />);
    expect(screen.getByText('Low')).toBeInTheDocument();
    expect(screen.getByText('3.2%')).toBeInTheDocument();
  });

  it('renders expanded mode with all metrics', () => {
    render(<ShortInterest state={highSI} expanded={true} />);
    expect(screen.getByText('Short Interest')).toBeInTheDocument();
    expect(screen.getByText('SI Ratio')).toBeInTheDocument();
    expect(screen.getByText('Days to Cover')).toBeInTheDocument();
    expect(screen.getByText('Cost to Borrow')).toBeInTheDocument();
    expect(screen.getByText('Utilization')).toBeInTheDocument();
  });

  it('integrates with onion store for asset-specific SI', () => {
    render(<ShortInterest state={highSI} expanded={true} />);
    // Mock returns AAPL
    expect(screen.getByText('AAPL SI')).toBeInTheDocument();
    expect(screen.getByText('22.50%')).toBeInTheDocument();
  });
});

// ─── BreadthParticipation ───────────────────────────────────────────────────

describe('BreadthParticipation', () => {
  const confirmingState = makeState('breadth-participation', {
    details: {
      status: 'Confirming',
      aboveSMA20: 72,
      aboveSMA50: 65,
      aboveSMA200: 70,
      newHighs: 120,
      newLows: 30,
      advanceDecline: 1.85,
      weightingCheck: 'Healthy',
      shortTermBreadth: 72,
      intermediateBreadth: 65,
    },
  });

  it('renders closed mode with status and mini bars', () => {
    const { container } = render(<BreadthParticipation state={confirmingState} expanded={false} />);
    expect(screen.getByText('Breadth')).toBeInTheDocument();
    expect(screen.getByText('Confirming')).toBeInTheDocument();
    // Mini breadth bars (3)
    const bars = container.querySelectorAll('.rounded-t');
    expect(bars.length).toBe(3);
  });

  it('renders expanded mode with SMA breadth rows', () => {
    render(<BreadthParticipation state={confirmingState} expanded={true} />);
    expect(screen.getByText('Breadth & Participation')).toBeInTheDocument();
    expect(screen.getByText('% Above 20 SMA')).toBeInTheDocument();
    expect(screen.getByText('% Above 50 SMA')).toBeInTheDocument();
    expect(screen.getByText('% Above 200 SMA')).toBeInTheDocument();
    expect(screen.getByText('72%')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByText('70%')).toBeInTheDocument();
  });

  it('renders market internals', () => {
    render(<BreadthParticipation state={confirmingState} expanded={true} />);
    expect(screen.getByText('New Highs')).toBeInTheDocument();
    expect(screen.getByText('New Lows')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('A/D Ratio')).toBeInTheDocument();
    expect(screen.getByText('1.85')).toBeInTheDocument();
    expect(screen.getByText('Healthy')).toBeInTheDocument();
  });

  it('renders Diverging status correctly', () => {
    const divState = makeState('breadth-participation', {
      details: { status: 'Diverging', aboveSMA20: 35, aboveSMA50: 40, aboveSMA200: 55, newHighs: 20, newLows: 80, advanceDecline: 0.6, weightingCheck: 'Unhealthy', shortTermBreadth: 35, intermediateBreadth: 40 },
    });
    render(<BreadthParticipation state={divState} expanded={false} />);
    expect(screen.getByText('Diverging')).toBeInTheDocument();
  });
});

// ─── TrendQuality ───────────────────────────────────────────────────────────

describe('TrendQuality', () => {
  const strongState = makeState('trend-quality', {
    confidence: 85,
    details: { quality: 82, trendLine: 'Up', maAlignment: 'Bullish' },
  });

  it('renders closed mode with quality bar and trend arrow', () => {
    const { container } = render(<TrendQuality state={strongState} expanded={false} />);
    expect(screen.getByText('Trend')).toBeInTheDocument();
    expect(screen.getByText('82%')).toBeInTheDocument();
    // Trend arrow SVG
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('renders expanded mode with gauge and metrics', () => {
    render(<TrendQuality state={strongState} expanded={true} />);
    expect(screen.getByText('Trend Quality')).toBeInTheDocument();
    expect(screen.getByText('Strong')).toBeInTheDocument(); // qualityLabel(82)
    expect(screen.getByText('Trend Direction')).toBeInTheDocument();
    expect(screen.getByText('Up')).toBeInTheDocument();
    expect(screen.getByText('MA Alignment')).toBeInTheDocument();
    expect(screen.getByText('Bullish')).toBeInTheDocument();
  });

  it('shows confidence in footer', () => {
    render(<TrendQuality state={strongState} expanded={true} />);
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('renders Poor quality label for low quality', () => {
    const poorState = makeState('trend-quality', {
      details: { quality: 15, trendLine: 'Down', maAlignment: 'Bearish' },
    });
    render(<TrendQuality state={poorState} expanded={true} />);
    expect(screen.getByText('Poor')).toBeInTheDocument();
    expect(screen.getByText('Down')).toBeInTheDocument();
    expect(screen.getByText('Bearish')).toBeInTheDocument();
  });
});

// ─── ETFPassiveFlow ─────────────────────────────────────────────────────────

describe('ETFPassiveFlow', () => {
  const inflowState = makeState('etf-passive-flow', {
    details: { flowStatus: 'Amplifying', netFlow: 2500, spyFlow: 1500, qqqFlow: 800 },
  });

  it('renders closed mode with status and net flow', () => {
    render(<ETFPassiveFlow state={inflowState} expanded={false} />);
    expect(screen.getByText('ETF')).toBeInTheDocument();
    expect(screen.getByText('Amplifying')).toBeInTheDocument();
    expect(screen.getByText('+2.5B')).toBeInTheDocument();
  });

  it('renders draining state in closed mode', () => {
    const drainState = makeState('etf-passive-flow', {
      details: { flowStatus: 'Draining', netFlow: -3200, spyFlow: -2000, qqqFlow: -1200 },
    });
    render(<ETFPassiveFlow state={drainState} expanded={false} />);
    expect(screen.getByText('Draining')).toBeInTheDocument();
    expect(screen.getByText('-3.2B')).toBeInTheDocument();
  });

  it('renders expanded mode with flow breakdown', () => {
    render(<ETFPassiveFlow state={inflowState} expanded={true} />);
    expect(screen.getByText('ETF Passive Flow')).toBeInTheDocument();
    expect(screen.getByText('Net Flow')).toBeInTheDocument();
    // SPY/QQQ appear as both icon text and label text
    expect(screen.getAllByText('SPY').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('QQQ').length).toBeGreaterThanOrEqual(1);
  });

  it('renders direction and magnitude in footer', () => {
    render(<ETFPassiveFlow state={inflowState} expanded={true} />);
    expect(screen.getByText('Inflow')).toBeInTheDocument();
    expect(screen.getByText('2.50B')).toBeInTheDocument();
  });
});

// ─── FuturesPositioning ─────────────────────────────────────────────────────

describe('FuturesPositioning', () => {
  const crowdedState = makeState('futures-positioning', {
    details: { crowding: 78, stretching: 45, netSpeculative: 85000, commercialHedging: -60000, riskLabel: 'Crowded' },
  });

  it('renders closed mode with risk label and mini gauges', () => {
    const { container } = render(<FuturesPositioning state={crowdedState} expanded={false} />);
    expect(screen.getByText('Futures')).toBeInTheDocument();
    expect(screen.getByText('Crowded')).toBeInTheDocument();
    // Mini gauge bars (2)
    const gauges = container.querySelectorAll('.bg-slate-800.rounded-full.overflow-hidden');
    expect(gauges.length).toBeGreaterThanOrEqual(2);
  });

  it('renders expanded mode with crowding and stretching gauges', () => {
    render(<FuturesPositioning state={crowdedState} expanded={true} />);
    expect(screen.getByText('Futures Positioning')).toBeInTheDocument();
    expect(screen.getByText('Crowding')).toBeInTheDocument();
    expect(screen.getByText('Stretching')).toBeInTheDocument();
    expect(screen.getByText('78%')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
  });

  it('renders positioning data in expanded mode', () => {
    render(<FuturesPositioning state={crowdedState} expanded={true} />);
    expect(screen.getByText('Net Speculative')).toBeInTheDocument();
    expect(screen.getByText('Commercial Hedging')).toBeInTheDocument();
    expect(screen.getByText('+85,000')).toBeInTheDocument();
    expect(screen.getByText('-60,000')).toBeInTheDocument();
  });

  it('renders Normal risk label correctly', () => {
    const normalState = makeState('futures-positioning', {
      details: { crowding: 35, stretching: 40, netSpeculative: 10000, commercialHedging: -5000, riskLabel: 'Normal' },
    });
    render(<FuturesPositioning state={normalState} expanded={false} />);
    expect(screen.getByText('Normal')).toBeInTheDocument();
  });
});

// ─── SectorOverheat (with Onion store mock) ─────────────────────────────────

describe('SectorOverheat', () => {
  const extendedState = makeState('sector-overheat', {
    details: {
      avgStatus: 'Extended',
      avgTemp: 75,
      XLK_temp: 85,
      XLK_participation: 70,
      XLK_volatility: 25,
      XLK_speed: 65,
      XLK_status: 'Extended',
      XLF_temp: 72,
      XLF_participation: 60,
      XLF_volatility: 18,
      XLF_speed: 55,
      XLF_status: 'Extended',
      XLE_temp: 68,
      XLE_participation: 55,
      XLE_volatility: 22,
      XLE_speed: 50,
      XLE_status: 'Stable',
      XLV_temp: 78,
      XLV_participation: 65,
      XLV_volatility: 15,
      XLV_speed: 60,
      XLV_status: 'Extended',
      XLI_temp: 70,
      XLI_participation: 58,
      XLI_volatility: 20,
      XLI_speed: 52,
      XLI_status: 'Stable',
    },
  });

  it('renders closed mode with status, temp, and heat dots', () => {
    const { container } = render(<SectorOverheat state={extendedState} expanded={false} />);
    expect(screen.getByText('Heat')).toBeInTheDocument();
    expect(screen.getByText('Extended')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
    // 5 mini sector heat dots
    const dots = container.querySelectorAll('.rounded-full.w-1\\.5.h-1\\.5');
    expect(dots.length).toBe(5);
  });

  it('renders expanded mode with sector cards', () => {
    render(<SectorOverheat state={extendedState} expanded={true} />);
    expect(screen.getByText('Sector Overheat')).toBeInTheDocument();
    expect(screen.getByText('XLK')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('XLF')).toBeInTheDocument();
    expect(screen.getByText('Financials')).toBeInTheDocument();
    expect(screen.getByText('XLE')).toBeInTheDocument();
    expect(screen.getByText('Energy')).toBeInTheDocument();
    expect(screen.getByText('XLV')).toBeInTheDocument();
    expect(screen.getByText('Healthcare')).toBeInTheDocument();
    expect(screen.getByText('XLI')).toBeInTheDocument();
    expect(screen.getByText('Industrials')).toBeInTheDocument();
  });

  it('integrates with onion store showing selected segment context', () => {
    render(<SectorOverheat state={extendedState} expanded={true} />);
    expect(screen.getByText('AAPL')).toBeInTheDocument();
  });

  it('renders Stable state correctly', () => {
    const stableState = makeState('sector-overheat', {
      details: {
        avgStatus: 'Stable',
        avgTemp: 35,
        XLK_temp: 30, XLK_participation: 50, XLK_volatility: 15, XLK_speed: 40, XLK_status: 'Stable',
        XLF_temp: 35, XLF_participation: 55, XLF_volatility: 12, XLF_speed: 45, XLF_status: 'Stable',
        XLE_temp: 38, XLE_participation: 48, XLE_volatility: 18, XLE_speed: 42, XLE_status: 'Stable',
        XLV_temp: 32, XLV_participation: 52, XLV_volatility: 10, XLV_speed: 38, XLV_status: 'Stable',
        XLI_temp: 40, XLI_participation: 50, XLI_volatility: 14, XLI_speed: 44, XLI_status: 'Stable',
      },
    });
    render(<SectorOverheat state={stableState} expanded={false} />);
    expect(screen.getByText('Stable')).toBeInTheDocument();
  });
});
