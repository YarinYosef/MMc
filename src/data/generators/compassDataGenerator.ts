import { type CompassState, type CompassSignal, type CompassId } from '@/data/types/compass';
import { COMPASS_CONFIGS } from '@/data/constants/compassConfig';

function gaussianRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function valueToSignal(value: number): CompassSignal {
  if (value > 60) return 'strong-bullish';
  if (value > 20) return 'bullish';
  if (value > -20) return 'neutral';
  if (value > -60) return 'bearish';
  return 'strong-bearish';
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function walkValue(prev: number, volatility: number = 8): number {
  const meanReversion = -prev * 0.02;
  const shock = gaussianRandom() * volatility;
  return clamp(prev + meanReversion + shock, -100, 100);
}

function walkNumeric(prev: number, center: number, vol: number, min: number, max: number): number {
  const reversion = (center - prev) * 0.05;
  return clamp(prev + reversion + gaussianRandom() * vol, min, max);
}

export function generateCompassState(id: CompassId, previous?: CompassState): CompassState {
  const prevValue = previous?.value ?? gaussianRandom() * 40;
  const newValue = walkValue(prevValue);

  const confidence = clamp(50 + Math.abs(newValue) * 0.4 + gaussianRandom() * 10, 0, 100);

  return {
    id,
    signal: valueToSignal(newValue),
    value: Math.round(newValue * 10) / 10,
    confidence: Math.round(confidence),
    lastUpdated: Date.now(),
    details: generateDetails(id, newValue, previous?.details),
  };
}

function generateDetails(
  id: CompassId,
  value: number,
  prevDetails?: Record<string, number | string>
): Record<string, number | string> {
  const pd = prevDetails || {};

  switch (id) {
    case 'market-regime': {
      const regime = value > 30 ? 'Risk-On' : value < -30 ? 'Risk-Off' : 'Transition';
      const subLiquidity = walkNumeric(Number(pd.subLiquidity) || value * 0.8, value * 0.8, 5, -100, 100);
      const subInterestRates = walkNumeric(Number(pd.subInterestRates) || value * 0.6, value * 0.6, 5, -100, 100);
      const subCreditStress = walkNumeric(Number(pd.subCreditStress) || -value * 0.7, -value * 0.7, 5, -100, 100);
      const subMacro = walkNumeric(Number(pd.subMacro) || value * 0.5, value * 0.5, 5, -100, 100);
      const subCrossAsset = walkNumeric(Number(pd.subCrossAsset) || value * 0.9, value * 0.9, 5, -100, 100);
      const subCorrelation = walkNumeric(Number(pd.subCorrelation) || 50, 50, 5, 0, 100);
      return {
        regime,
        trendStrength: Math.round(Math.abs(value)),
        daysInRegime: Math.floor(Math.random() * 30) + 1,
        subLiquidity: Math.round(subLiquidity * 10) / 10,
        subInterestRates: Math.round(subInterestRates * 10) / 10,
        subCreditStress: Math.round(subCreditStress * 10) / 10,
        subMacro: Math.round(subMacro * 10) / 10,
        subCrossAsset: Math.round(subCrossAsset * 10) / 10,
        subCorrelation: Math.round(subCorrelation * 10) / 10,
      };
    }

    case 'dollar-liquidity': {
      const fedBalance = walkNumeric(Number(pd.fedBalance) || 7.5, 7.5, 0.05, 6.5, 8.5);
      const rrpFacility = walkNumeric(Number(pd.rrpFacility) || 500, 500, 15, 100, 1200);
      const tgaBalance = walkNumeric(Number(pd.tgaBalance) || 700, 700, 10, 300, 1000);
      const dxyIndex = walkNumeric(Number(pd.dxyIndex) || 104, 104, 0.3, 95, 115);
      const trendAcceleration = walkNumeric(Number(pd.trendAcceleration) || 0, 0, 5, -50, 50);
      const signalCompression = walkNumeric(Number(pd.signalCompression) || 50, 50, 3, 10, 90);
      const liquidityState = value > 20 ? 'Expanding' : value < -20 ? 'Contracting' : 'Stable';
      const directionalBias = value > 10 ? 'Bullish' : value < -10 ? 'Bearish' : 'Neutral';
      return {
        fedBalance: Math.round(fedBalance * 100) / 100,
        rrpFacility: Math.round(rrpFacility),
        tgaBalance: Math.round(tgaBalance),
        dxyIndex: Math.round(dxyIndex * 100) / 100,
        trendAcceleration: Math.round(trendAcceleration * 10) / 10,
        signalCompression: Math.round(signalCompression),
        liquidityState,
        directionalBias,
        corrEquity: Math.round(walkNumeric(Number(pd.corrEquity) || 0.3, 0.3, 0.05, -1, 1) * 100) / 100,
        corrBonds: Math.round(walkNumeric(Number(pd.corrBonds) || -0.2, -0.2, 0.05, -1, 1) * 100) / 100,
        corrGold: Math.round(walkNumeric(Number(pd.corrGold) || -0.4, -0.4, 0.05, -1, 1) * 100) / 100,
        corrCrypto: Math.round(walkNumeric(Number(pd.corrCrypto) || 0.5, 0.5, 0.05, -1, 1) * 100) / 100,
      };
    }

    case 'microsoft-proxy': {
      const msftPrice = walkNumeric(Number(pd.msftPrice) || 420, 420, 2, 350, 500);
      const ath = 468;
      const athDistance = Math.round(((ath - msftPrice) / ath) * 10000) / 100;
      const breakoutStatus = athDistance < 2 ? 'Breakout' : athDistance < 5 ? 'Near ATH' : athDistance < 10 ? 'Pullback' : 'Rejection';
      const indexComparison = walkNumeric(Number(pd.indexComparison) || 0, 0, 1, -10, 10);
      return {
        msftPrice: Math.round(msftPrice * 100) / 100,
        ath,
        athDistance,
        breakoutStatus,
        gapDirection: value > 0 ? 'green' : 'red',
        indexComparison: Math.round(indexComparison * 100) / 100,
        liquidityBehavior: Math.abs(value) > 40 ? 'Strong' : Math.abs(value) > 20 ? 'Moderate' : 'Weak',
        priceHistory: generateMiniSeries(Number(pd.msftPrice) || 420, 30, 2),
      };
    }

    case 'vix': {
      const spotVix = walkNumeric(Number(pd.spotVix) || 15, 15, 0.5, 9, 50);
      const skew = walkNumeric(Number(pd.skew) || 130, 130, 2, 100, 170);
      const vvix = walkNumeric(Number(pd.vvix) || 90, 90, 2, 60, 140);
      const volRegime = spotVix < 15 ? 'Low' : spotVix < 20 ? 'Normal' : spotVix < 30 ? 'Elevated' : 'Extreme';
      const tailBid = skew > 145 ? 'High' : skew > 125 ? 'Normal' : 'Low';
      const systematicPressure = vvix > 110 ? 'High' : vvix > 85 ? 'Normal' : 'Low';
      const combinedStress = Math.round(
        ((clamp((spotVix - 12) / 30, 0, 1) * 40) +
        (clamp((skew - 110) / 50, 0, 1) * 30) +
        (clamp((vvix - 70) / 60, 0, 1) * 30))
      );
      return {
        spotVix: Math.round(spotVix * 100) / 100,
        skew: Math.round(skew * 100) / 100,
        vvix: Math.round(vvix * 100) / 100,
        vix9d: Math.round(walkNumeric(Number(pd.vix9d) || 14, 14, 0.5, 8, 50) * 100) / 100,
        vix3m: Math.round(walkNumeric(Number(pd.vix3m) || 17, 17, 0.3, 10, 40) * 100) / 100,
        termStructure: spotVix < Number(pd.vix3m || 17) ? 'Contango' : 'Backwardation',
        volRegime,
        tailBid,
        systematicPressure,
        combinedStress,
        vixMomentum: Math.round(walkNumeric(Number(pd.vixMomentum) || 0, 0, 2, -30, 30) * 10) / 10,
        skewMomentum: Math.round(walkNumeric(Number(pd.skewMomentum) || 0, 0, 1, -15, 15) * 10) / 10,
        vvixMomentum: Math.round(walkNumeric(Number(pd.vvixMomentum) || 0, 0, 1.5, -20, 20) * 10) / 10,
      };
    }

    case 'volume': {
      const relativeVolume = walkNumeric(Number(pd.relativeVolume) || 1.0, 1.0, 0.1, 0.3, 3.0);
      const expansion = walkNumeric(Number(pd.expansion) || 0, 0, 3, -50, 100);
      const followThrough = relativeVolume > 1.5 ? 'High' : relativeVolume > 0.8 ? 'Moderate' : 'Low';
      return {
        relativeVolume: Math.round(relativeVolume * 100) / 100,
        expansion: Math.round(expansion * 10) / 10,
        followThrough,
        distributionDays: Math.floor(Math.random() * 6),
        accumulationDays: Math.floor(Math.random() * 6),
        priceHistory: generateMiniSeries(450, 20, 3),
        volumeHistory: generateMiniVolumeSeries(20),
      };
    }

    case 'social-sentiment': {
      const idx = clamp(50 + value * 0.5, 0, 100);
      let mood: string;
      if (idx < 20) mood = 'Panic';
      else if (idx < 35) mood = 'Afraid';
      else if (idx < 65) mood = 'Neutral';
      else if (idx < 80) mood = 'Greedy';
      else mood = 'Euphoric';
      return {
        sentimentIndex: Math.round(idx),
        mood,
        twitterScore: Math.round(walkNumeric(Number(pd.twitterScore) || 50, 50, 5, 0, 100)),
        redditScore: Math.round(walkNumeric(Number(pd.redditScore) || 50, 50, 5, 0, 100)),
        newsScore: Math.round(walkNumeric(Number(pd.newsScore) || 50, 50, 5, 0, 100)),
      };
    }

    case 'fear-greed': {
      const index = Math.round(clamp(50 + value * 0.5, 0, 100));
      let label: string;
      if (index < 25) label = 'Extreme Fear';
      else if (index > 75) label = 'Extreme Greed';
      else label = 'Neutral';
      return {
        index,
        label,
        previous: Math.round(clamp(50 + value * 0.4, 0, 100)),
        weekAgo: Math.round(50 + gaussianRandom() * 20),
      };
    }

    case 'structure-sr': {
      const balance = Math.abs(value);
      let status: string;
      if (balance < 25) status = 'Balanced';
      else if (balance < 60) status = 'Imbalanced';
      else status = 'Extreme';
      return {
        status,
        nearestSupport: Math.round(walkNumeric(Number(pd.nearestSupport) || 440, 440, 2, 400, 460) * 100) / 100,
        nearestResistance: Math.round(walkNumeric(Number(pd.nearestResistance) || 460, 460, 2, 450, 490) * 100) / 100,
        distanceToSupport: Math.round(Math.abs(value * 0.05) * 100) / 100,
        distanceToResistance: Math.round(Math.abs((100 - value) * 0.03) * 100) / 100,
      };
    }

    case 'gamma': {
      const gex = walkNumeric(Number(pd.gex) || 0, 0, 200, -3000, 3000);
      const isPositive = gex > 0;
      return {
        gex: Math.round(gex),
        isPositive: isPositive ? 'Positive' : 'Negative',
        spxGex: Math.round(walkNumeric(Number(pd.spxGex) || 500, 500, 100, -2000, 3000)),
        qqqGex: Math.round(walkNumeric(Number(pd.qqqGex) || 200, 200, 80, -1500, 2000)),
        iwmGex: Math.round(walkNumeric(Number(pd.iwmGex) || 50, 50, 40, -500, 800)),
        onionAssetGex: Math.round(walkNumeric(Number(pd.onionAssetGex) || 100, 100, 50, -800, 1200)),
        flipLevel: Math.round(walkNumeric(Number(pd.flipLevel) || 4500, 4500, 10, 4300, 4700)),
      };
    }

    case 'short-interest': {
      const siRatio = walkNumeric(Number(pd.siRatio) || 5, 5, 0.3, 1, 30);
      let level: string;
      if (siRatio < 5) level = 'Low';
      else if (siRatio < 15) level = 'Moderate';
      else level = 'High';
      return {
        siRatio: Math.round(siRatio * 100) / 100,
        level,
        daysTocover: Math.round(walkNumeric(Number(pd.daysTocover) || 3, 3, 0.3, 0.5, 15) * 10) / 10,
        costToBorrow: Math.round(walkNumeric(Number(pd.costToBorrow) || 2, 2, 0.5, 0.5, 50) * 100) / 100,
        utilization: Math.round(walkNumeric(Number(pd.utilization) || 40, 40, 3, 5, 100)),
        onionAssetSI: Math.round(walkNumeric(Number(pd.onionAssetSI) || 8, 8, 0.5, 1, 40) * 100) / 100,
      };
    }

    case 'breadth-participation': {
      const confirming = value > 10;
      const aboveSMA20 = walkNumeric(Number(pd.aboveSMA20) || 55, 55, 3, 10, 95);
      const aboveSMA50 = walkNumeric(Number(pd.aboveSMA50) || 50, 50, 2, 10, 90);
      const aboveSMA200 = walkNumeric(Number(pd.aboveSMA200) || 60, 60, 1.5, 15, 90);
      return {
        status: confirming ? 'Confirming' : 'Diverging',
        aboveSMA20: Math.round(aboveSMA20),
        aboveSMA50: Math.round(aboveSMA50),
        aboveSMA200: Math.round(aboveSMA200),
        newHighs: Math.round(walkNumeric(Number(pd.newHighs) || 50, 50, 10, 0, 200)),
        newLows: Math.round(walkNumeric(Number(pd.newLows) || 30, 30, 8, 0, 150)),
        advanceDecline: Math.round(walkNumeric(Number(pd.advanceDecline) || 1.2, 1.2, 0.1, 0.3, 3) * 100) / 100,
        weightingCheck: value > 20 ? 'Healthy' : value < -20 ? 'Unhealthy' : 'Mixed',
        shortTermBreadth: Math.round(aboveSMA20),
        intermediateBreadth: Math.round(aboveSMA50),
      };
    }

    case 'trend-quality': {
      const quality = clamp(50 + value * 0.5, 0, 100);
      return {
        quality: Math.round(quality),
        trendLine: value > 0 ? 'Up' : value < 0 ? 'Down' : 'Flat',
        maAlignment: quality > 60 ? 'Bullish' : quality < 40 ? 'Bearish' : 'Mixed',
      };
    }

    case 'etf-passive-flow': {
      let flowStatus: string;
      if (value > 20) flowStatus = 'Amplifying';
      else if (value < -20) flowStatus = 'Draining';
      else flowStatus = 'Neutral';
      return {
        flowStatus,
        netFlow: Math.round(walkNumeric(Number(pd.netFlow) || 0, 0, 500, -5000, 5000)),
        spyFlow: Math.round(walkNumeric(Number(pd.spyFlow) || 0, 0, 300, -3000, 3000)),
        qqqFlow: Math.round(walkNumeric(Number(pd.qqqFlow) || 0, 0, 200, -2000, 2000)),
      };
    }

    case 'futures-positioning': {
      const crowding = walkNumeric(Number(pd.crowding) || 50, 50, 3, 0, 100);
      const stretching = walkNumeric(Number(pd.stretching) || 50, 50, 3, 0, 100);
      return {
        crowding: Math.round(crowding),
        stretching: Math.round(stretching),
        netSpeculative: Math.round(walkNumeric(Number(pd.netSpeculative) || 0, 0, 5000, -100000, 100000)),
        commercialHedging: Math.round(walkNumeric(Number(pd.commercialHedging) || 0, 0, 3000, -80000, 80000)),
        riskLabel: crowding > 70 ? 'Crowded' : stretching > 70 ? 'Stretched' : 'Normal',
      };
    }

    case 'sector-overheat': {
      const sectors = ['XLK', 'XLF', 'XLE', 'XLV', 'XLI'];
      const details: Record<string, number | string> = {};
      let totalTemp = 0;
      for (const s of sectors) {
        const temp = walkNumeric(Number(pd[`${s}_temp`]) || 50, 50, 3, 0, 100);
        details[`${s}_temp`] = Math.round(temp);
        details[`${s}_participation`] = Math.round(walkNumeric(Number(pd[`${s}_participation`]) || 60, 60, 3, 10, 100));
        details[`${s}_volatility`] = Math.round(walkNumeric(Number(pd[`${s}_volatility`]) || 20, 20, 1, 5, 60) * 10) / 10;
        details[`${s}_speed`] = Math.round(walkNumeric(Number(pd[`${s}_speed`]) || 50, 50, 3, 0, 100));
        details[`${s}_status`] = temp > 70 ? 'Extended' : 'Stable';
        totalTemp += temp;
      }
      const avgTemp = totalTemp / sectors.length;
      details.avgStatus = avgTemp > 70 ? 'Extended' : 'Stable';
      details.avgTemp = Math.round(avgTemp);
      return details;
    }

    case 'analysts': {
      const revisionDirection = value > 15 ? 'Up' : value < -15 ? 'Down' : 'Flat';
      const revisionSpeed = Math.abs(value) > 40 ? 'Fast' : Math.abs(value) > 15 ? 'Moderate' : 'Slow';
      const coverage = Math.round(walkNumeric(Number(pd.coverage) || 25, 25, 1, 5, 50));
      const dispersion = Math.round(walkNumeric(Number(pd.dispersion) || 30, 30, 2, 5, 80));
      return { revisionDirection, revisionSpeed, coverage, dispersion };
    }

    case 'time': {
      const seasonality = walkNumeric(Number(pd.seasonality) || 50, 50, 3, 0, 100);
      const calendarRisk = walkNumeric(Number(pd.calendarRisk) || 30, 30, 3, 0, 100);
      const multiTf = walkNumeric(Number(pd.multiTf) || 50, 50, 3, 0, 100);
      let timeColor: string;
      const avg = (seasonality + (100 - calendarRisk) + multiTf) / 3;
      if (avg > 65) timeColor = 'green';
      else if (avg > 45) timeColor = 'yellow';
      else if (avg > 25) timeColor = 'red';
      else timeColor = 'gray';
      const now = new Date();
      const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];
      const monthName = now.toLocaleString('en-US', { month: 'short' });
      const isOpex = now.getDate() >= 15 && now.getDate() <= 21 && now.getDay() === 5;
      const earningsWeek = Math.random() > 0.7;
      return {
        seasonality: Math.round(seasonality),
        calendarRisk: Math.round(calendarRisk),
        multiTf: Math.round(multiTf),
        timeColor,
        dayOfWeek,
        monthName,
        isOpex: isOpex ? 'Yes' : 'No',
        earningsWeek: earningsWeek ? 'Yes' : 'No',
        fomc: Math.random() > 0.85 ? 'Upcoming' : 'None',
      };
    }

    case 'technical-anomalies': {
      const anomalyCount = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0;
      const anomalyTypes = ['Volume Divergence', 'Price Gap', 'RSI Divergence', 'MACD Cross', 'Bollinger Break'];
      const detected = anomalyCount > 0
        ? anomalyTypes.slice(0, anomalyCount).join(', ')
        : 'None';
      return {
        anomalyCount,
        detected,
        isNormal: anomalyCount === 0 ? 'Normal' : 'Alert',
      };
    }

    default:
      return {
        primary: Math.round(value * 10) / 10,
        secondary: Math.round(gaussianRandom() * 30 * 10) / 10,
      };
  }
}

function generateMiniSeries(center: number, count: number, vol: number): string {
  const points: number[] = [];
  let v = center;
  for (let i = 0; i < count; i++) {
    v = v + gaussianRandom() * vol;
    points.push(Math.round(v * 100) / 100);
  }
  return points.join(',');
}

function generateMiniVolumeSeries(count: number): string {
  const points: number[] = [];
  for (let i = 0; i < count; i++) {
    points.push(Math.round(50 + Math.random() * 100));
  }
  return points.join(',');
}

export function generateAllCompassStates(previous?: Map<CompassId, CompassState>): Map<CompassId, CompassState> {
  const states = new Map<CompassId, CompassState>();
  for (const config of COMPASS_CONFIGS) {
    states.set(config.id, generateCompassState(config.id, previous?.get(config.id)));
  }
  return states;
}
