import React from 'react';
import { render, screen } from '@testing-library/react';
import { MarketRegime } from '@/components/compass/decision-maker/MarketRegime';
import { DollarLiquidity } from '@/components/compass/decision-maker/DollarLiquidity';
import { MicrosoftProxy } from '@/components/compass/decision-maker/MicrosoftProxy';
import { VIXCompass } from '@/components/compass/decision-maker/VIXCompass';
import { VolumeCompass } from '@/components/compass/decision-maker/VolumeCompass';
import { makeState } from './helpers';

// ─── MarketRegime ───────────────────────────────────────────────────────────

describe('MarketRegime', () => {
  const riskOnState = makeState('market-regime', {
    signal: 'bullish',
    value: 50,
    confidence: 80,
    details: {
      regime: 'Risk-On',
      trendStrength: 65,
      daysInRegime: 12,
      subLiquidity: 40,
      subInterestRates: 20,
      subCreditStress: -15,
      subMacro: 30,
      subCrossAsset: 55,
      subCorrelation: 45,
    },
  });

  const riskOffState = makeState('market-regime', {
    signal: 'bearish',
    value: -50,
    details: {
      regime: 'Risk-Off',
      trendStrength: 70,
      daysInRegime: 5,
      subLiquidity: -40,
      subInterestRates: -20,
      subCreditStress: 30,
      subMacro: -25,
      subCrossAsset: -45,
      subCorrelation: 70,
    },
  });

  it('renders closed mode with regime label and trend strength', () => {
    const { container } = render(<MarketRegime state={riskOnState} expanded={false} />);
    expect(screen.getByText('Regime')).toBeInTheDocument();
    expect(screen.getByText('Risk-On')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
    // Mini sub-compass dots (5 directional sub-compasses, excluding correlation)
    const dots = container.querySelectorAll('.rounded-full.w-1.h-1');
    expect(dots.length).toBe(5);
  });

  it('renders Risk-Off regime correctly in closed mode', () => {
    render(<MarketRegime state={riskOffState} expanded={false} />);
    expect(screen.getByText('Risk-Off')).toBeInTheDocument();
    expect(screen.getByText('70%')).toBeInTheDocument();
  });

  it('renders expanded mode with all sub-compasses', () => {
    render(<MarketRegime state={riskOnState} expanded={true} />);
    expect(screen.getByText('Market Regime')).toBeInTheDocument();
    expect(screen.getByText('Risk-On')).toBeInTheDocument();
    expect(screen.getByText('Liquidity')).toBeInTheDocument();
    expect(screen.getByText('Interest Rates')).toBeInTheDocument();
    expect(screen.getByText('Credit Stress')).toBeInTheDocument();
    expect(screen.getByText('Macro Regime')).toBeInTheDocument();
    expect(screen.getByText('Cross-Asset')).toBeInTheDocument();
    expect(screen.getByText('Correlation')).toBeInTheDocument();
  });

  it('shows bullish/bearish counts in expanded mode', () => {
    const { container } = render(<MarketRegime state={riskOnState} expanded={true} />);
    // Sub-compass values: 40 > 10 (bullish), 20 > 10 (bullish), -15 < -10 (bearish), 30 > 10 (bullish), 55 > 10 (bullish)
    // So bullishCount = 4, bearishCount = 1
    expect(container.textContent).toContain('4');
    expect(container.textContent).toContain('1');
  });

  it('displays confidence and signal in expanded footer', () => {
    render(<MarketRegime state={riskOnState} expanded={true} />);
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('bullish')).toBeInTheDocument();
  });

  it('renders Transition regime correctly', () => {
    const transState = makeState('market-regime', {
      details: {
        regime: 'Transition',
        trendStrength: 15,
        daysInRegime: 3,
        subLiquidity: 5,
        subInterestRates: -5,
        subCreditStress: 0,
        subMacro: 8,
        subCrossAsset: -3,
        subCorrelation: 50,
      },
    });
    render(<MarketRegime state={transState} expanded={false} />);
    expect(screen.getByText('Transition')).toBeInTheDocument();
  });
});

// ─── DollarLiquidity ────────────────────────────────────────────────────────

describe('DollarLiquidity', () => {
  const expandingState = makeState('dollar-liquidity', {
    details: {
      liquidityState: 'Expanding',
      directionalBias: 'Bullish',
      fedBalance: 7.65,
      rrpFacility: 450,
      tgaBalance: 720,
      dxyIndex: 103.50,
      trendAcceleration: 12.5,
      signalCompression: 55,
      corrEquity: 0.45,
      corrBonds: -0.25,
      corrGold: -0.35,
      corrCrypto: 0.60,
    },
  });

  const contractingState = makeState('dollar-liquidity', {
    details: {
      liquidityState: 'Contracting',
      directionalBias: 'Bearish',
      fedBalance: 7.10,
      rrpFacility: 800,
      tgaBalance: 500,
      dxyIndex: 108.20,
      trendAcceleration: -8.3,
      signalCompression: 72,
      corrEquity: -0.15,
      corrBonds: 0.10,
      corrGold: 0.50,
      corrCrypto: -0.20,
    },
  });

  it('renders closed mode with liquidity state and bias', () => {
    render(<DollarLiquidity state={expandingState} expanded={false} />);
    expect(screen.getByText('$Liq')).toBeInTheDocument();
    expect(screen.getByText('Expanding')).toBeInTheDocument();
    expect(screen.getByText('Bullish')).toBeInTheDocument();
  });

  it('renders contracting state correctly in closed mode', () => {
    render(<DollarLiquidity state={contractingState} expanded={false} />);
    expect(screen.getByText('Contracting')).toBeInTheDocument();
    expect(screen.getByText('Bearish')).toBeInTheDocument();
  });

  it('renders expanded mode with all metrics', () => {
    render(<DollarLiquidity state={expandingState} expanded={true} />);
    expect(screen.getByText('Dollar & Global Liquidity')).toBeInTheDocument();
    expect(screen.getByText('$7.65T')).toBeInTheDocument();
    expect(screen.getByText('103.5')).toBeInTheDocument();
    expect(screen.getByText('$450B')).toBeInTheDocument();
    expect(screen.getByText('$720B')).toBeInTheDocument();
  });

  it('renders correlation matrix in expanded mode', () => {
    render(<DollarLiquidity state={expandingState} expanded={true} />);
    expect(screen.getByText('USD Cross-Asset Correlation')).toBeInTheDocument();
    expect(screen.getByText('EQ')).toBeInTheDocument();
    expect(screen.getByText('BD')).toBeInTheDocument();
    expect(screen.getByText('AU')).toBeInTheDocument();
    expect(screen.getByText('CR')).toBeInTheDocument();
    expect(screen.getByText('+0.45')).toBeInTheDocument();
    expect(screen.getByText('-0.25')).toBeInTheDocument();
  });

  it('shows compression bar and trend acceleration', () => {
    render(<DollarLiquidity state={expandingState} expanded={true} />);
    expect(screen.getByText('Trend Acceleration')).toBeInTheDocument();
    expect(screen.getByText('Compression')).toBeInTheDocument();
    expect(screen.getByText('55%')).toBeInTheDocument();
  });
});

// ─── MicrosoftProxy ─────────────────────────────────────────────────────────

describe('MicrosoftProxy', () => {
  const breakoutState = makeState('microsoft-proxy', {
    details: {
      msftPrice: 465.50,
      ath: 468,
      athDistance: 0.53,
      breakoutStatus: 'Near ATH',
      gapDirection: 'green',
      indexComparison: 1.25,
      liquidityBehavior: 'Strong',
      priceHistory: '460,461,462,463,462,464,465,465.5',
    },
  });

  const rejectionState = makeState('microsoft-proxy', {
    details: {
      msftPrice: 395.00,
      ath: 468,
      athDistance: 15.60,
      breakoutStatus: 'Rejection',
      gapDirection: 'red',
      indexComparison: -2.50,
      liquidityBehavior: 'Weak',
      priceHistory: '410,405,400,398,396,395',
    },
  });

  it('renders closed mode with sparkline and ATH distance', () => {
    const { container } = render(<MicrosoftProxy state={breakoutState} expanded={false} />);
    expect(screen.getByText('MSFT')).toBeInTheDocument();
    expect(screen.getByText('0.5%')).toBeInTheDocument();
    expect(screen.getByText('Near ATH')).toBeInTheDocument();
    // Should have an SVG sparkline
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('renders Rejection status with red colors in closed mode', () => {
    render(<MicrosoftProxy state={rejectionState} expanded={false} />);
    expect(screen.getByText('Rejection')).toBeInTheDocument();
    expect(screen.getByText('15.6%')).toBeInTheDocument();
  });

  it('renders expanded mode with price display and ATH bar', () => {
    render(<MicrosoftProxy state={breakoutState} expanded={true} />);
    expect(screen.getByText('Microsoft Proxy')).toBeInTheDocument();
    expect(screen.getByText('$465.50')).toBeInTheDocument();
    expect(screen.getByText('Near ATH')).toBeInTheDocument();
  });

  it('renders price chart when price history is available', () => {
    const { container } = render(<MicrosoftProxy state={breakoutState} expanded={true} />);
    expect(screen.getByText('30-Period Price Action')).toBeInTheDocument();
    // Chart SVG with polyline
    const polylines = container.querySelectorAll('polyline');
    expect(polylines.length).toBeGreaterThan(0);
  });

  it('renders bottom metrics in expanded mode', () => {
    render(<MicrosoftProxy state={breakoutState} expanded={true} />);
    expect(screen.getByText('vs Index')).toBeInTheDocument();
    expect(screen.getByText('+1.25%')).toBeInTheDocument();
    expect(screen.getByText('Strong')).toBeInTheDocument();
  });

  it('handles empty price history gracefully', () => {
    const emptyState = makeState('microsoft-proxy', {
      details: {
        msftPrice: 420,
        ath: 468,
        athDistance: 10.26,
        breakoutStatus: 'Pullback',
        gapDirection: 'red',
        indexComparison: 0,
        liquidityBehavior: 'Moderate',
        priceHistory: '',
      },
    });
    const { container } = render(<MicrosoftProxy state={emptyState} expanded={true} />);
    // No chart should be rendered
    expect(container.querySelector('polyline')).toBeNull();
  });
});

// ─── VIXCompass ─────────────────────────────────────────────────────────────

describe('VIXCompass', () => {
  const calmState = makeState('vix', {
    details: {
      spotVix: 12.50,
      skew: 120.00,
      vvix: 75.00,
      vix9d: 11.80,
      vix3m: 15.20,
      volRegime: 'Low',
      tailBid: 'Low',
      systematicPressure: 'Low',
      combinedStress: 15,
      termStructure: 'Contango',
      vixMomentum: -1.5,
      skewMomentum: 0.3,
      vvixMomentum: -0.8,
    },
  });

  const extremeState = makeState('vix', {
    details: {
      spotVix: 38.00,
      skew: 160.00,
      vvix: 125.00,
      vix9d: 42.00,
      vix3m: 28.00,
      volRegime: 'Extreme',
      tailBid: 'High',
      systematicPressure: 'High',
      combinedStress: 88,
      termStructure: 'Backwardation',
      vixMomentum: 12.5,
      skewMomentum: 5.2,
      vvixMomentum: 8.3,
    },
  });

  it('renders closed mode with semi-gauges and combined stress', () => {
    const { container } = render(<VIXCompass state={calmState} expanded={false} />);
    // "VIX" appears as outer label AND inside a SemiGauge
    const vixElements = screen.getAllByText('VIX');
    expect(vixElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('15')).toBeInTheDocument();
    // Should have semi-gauge SVGs
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBe(3);
  });

  it('renders extreme state in closed mode', () => {
    render(<VIXCompass state={extremeState} expanded={false} />);
    expect(screen.getByText('88')).toBeInTheDocument();
  });

  it('renders expanded mode with all dimensions', () => {
    render(<VIXCompass state={calmState} expanded={true} />);
    expect(screen.getByText('VIX Compass')).toBeInTheDocument();
    expect(screen.getByText('Volatility Regime (VIX)')).toBeInTheDocument();
    expect(screen.getByText('Tail Risk Bid (SKEW)')).toBeInTheDocument();
    expect(screen.getByText('Systematic Pressure (VVIX)')).toBeInTheDocument();
  });

  it('shows stress label with correct text', () => {
    render(<VIXCompass state={calmState} expanded={true} />);
    expect(screen.getByText('Calm (15/100)')).toBeInTheDocument();
  });

  it('shows Extreme stress label for high stress state', () => {
    render(<VIXCompass state={extremeState} expanded={true} />);
    expect(screen.getByText('Extreme (88/100)')).toBeInTheDocument();
  });

  it('renders term structure section', () => {
    render(<VIXCompass state={calmState} expanded={true} />);
    expect(screen.getByText('Term Structure')).toBeInTheDocument();
    expect(screen.getByText('Contango')).toBeInTheDocument();
    expect(screen.getByText('9D')).toBeInTheDocument();
    expect(screen.getByText('Spot')).toBeInTheDocument();
    expect(screen.getByText('3M')).toBeInTheDocument();
  });

  it('renders Backwardation term structure correctly', () => {
    render(<VIXCompass state={extremeState} expanded={true} />);
    expect(screen.getByText('Backwardation')).toBeInTheDocument();
  });

  it('renders dimension row status pills', () => {
    render(<VIXCompass state={calmState} expanded={true} />);
    // "Low" appears as both status pill and threshold label in each of the 3 rows
    const lowElements = screen.getAllByText('Low');
    expect(lowElements.length).toBe(6);
  });
});

// ─── VolumeCompass ──────────────────────────────────────────────────────────

describe('VolumeCompass', () => {
  const highVolState = makeState('volume', {
    details: {
      relativeVolume: 2.15,
      expansion: 35.5,
      followThrough: 'High',
      distributionDays: 1,
      accumulationDays: 4,
      priceHistory: '448,449,450,451,452,453',
      volumeHistory: '80,90,120,150,130,140',
    },
  });

  const lowVolState = makeState('volume', {
    details: {
      relativeVolume: 0.55,
      expansion: -20.3,
      followThrough: 'Low',
      distributionDays: 4,
      accumulationDays: 1,
      priceHistory: '455,453,451,450,449',
      volumeHistory: '40,35,30,38,32',
    },
  });

  it('renders closed mode with RVOL, expansion, and follow-through', () => {
    render(<VolumeCompass state={highVolState} expanded={false} />);
    expect(screen.getByText('Vol')).toBeInTheDocument();
    expect(screen.getByText('2.1x')).toBeInTheDocument();
    expect(screen.getByText('+36%')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('renders low volume state in closed mode', () => {
    render(<VolumeCompass state={lowVolState} expanded={false} />);
    expect(screen.getByText('0.6x')).toBeInTheDocument();
    expect(screen.getByText('-20%')).toBeInTheDocument();
    expect(screen.getByText('Low')).toBeInTheDocument();
  });

  it('renders expanded mode with all metric cards', () => {
    render(<VolumeCompass state={highVolState} expanded={true} />);
    expect(screen.getByText('Volume Compass')).toBeInTheDocument();
    expect(screen.getByText('High Follow-Through')).toBeInTheDocument();
    expect(screen.getByText('RVOL')).toBeInTheDocument();
    expect(screen.getByText('Expansion')).toBeInTheDocument();
    expect(screen.getByText('Follow-Thru')).toBeInTheDocument();
  });

  it('renders distribution/accumulation stats', () => {
    render(<VolumeCompass state={highVolState} expanded={true} />);
    expect(screen.getByText('Distribution')).toBeInTheDocument();
    expect(screen.getByText('Accumulation')).toBeInTheDocument();
  });

  it('renders combined price & volume chart when data available', () => {
    const { container } = render(<VolumeCompass state={highVolState} expanded={true} />);
    expect(screen.getByText('Price & Volume')).toBeInTheDocument();
    // Should have SVG with polyline (price) and rect (volume bars)
    const rects = container.querySelectorAll('rect');
    expect(rects.length).toBeGreaterThan(0);
  });

  it('skips chart when no price/volume data', () => {
    const emptyState = makeState('volume', {
      details: {
        relativeVolume: 1.0,
        expansion: 0,
        followThrough: 'Moderate',
        distributionDays: 2,
        accumulationDays: 2,
        priceHistory: '',
        volumeHistory: '',
      },
    });
    render(<VolumeCompass state={emptyState} expanded={true} />);
    expect(screen.queryByText('Price & Volume')).not.toBeInTheDocument();
  });
});
