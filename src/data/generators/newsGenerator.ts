import { v4 as uuidv4 } from 'uuid';
import { type NewsItem, type NewsSentiment, type NewsSource, type NewsFeedType } from '@/data/types/news';
import { TICKER_UNIVERSE } from '@/data/constants/tickers';
import { SECTORS } from '@/data/constants/sectors';

const HEADLINES_POSITIVE = [
  '{ticker} beats Q4 earnings estimates, stock surges',
  '{ticker} announces $2B share buyback program',
  '{sector} sector rallies on strong economic data',
  'Fed signals pause in rate hikes, markets cheer',
  '{ticker} upgrades to Buy at Goldman Sachs',
  '{ticker} reports record revenue, raises guidance',
  'Institutional investors increase {sector} exposure',
  '{ticker} CEO sees accelerating growth ahead',
  'Bullish options flow detected in {ticker}',
  '{sector} ETF sees record inflows this week',
];

const HEADLINES_NEGATIVE = [
  '{ticker} misses revenue estimates, shares drop',
  '{ticker} faces regulatory scrutiny, stock falls',
  '{sector} sector sells off on recession fears',
  'Rising yields pressure {sector} valuations',
  '{ticker} downgrades to Sell at Morgan Stanley',
  '{ticker} warns of slowing demand in key markets',
  'Insider selling detected at {ticker}',
  '{ticker} cuts full-year guidance below consensus',
  'Short interest surges in {ticker}',
  '{sector} faces headwinds from trade tensions',
];

const HEADLINES_NEUTRAL = [
  '{ticker} to present at Morgan Stanley conference',
  '{sector} rotation continues as investors rebalance',
  '{ticker} announces new product launch timeline',
  'Market awaits {ticker} earnings next week',
  'Options expiry drives unusual volume in {sector}',
  '{ticker} hires new CFO from industry rival',
  'Analysts divided on {ticker} outlook',
  '{sector} sector consolidation expected to continue',
];

const GLOBAL_HEADLINES = [
  'Treasury yields climb as inflation data comes in hot',
  'Fed minutes reveal divided views on rate path',
  'Global markets mixed amid geopolitical uncertainty',
  'Dollar strengthens against major currencies',
  'Oil prices surge on OPEC+ supply cut extension',
  'Bitcoin breaks through key resistance level',
  'China PMI data signals manufacturing recovery',
  'European markets close higher on ECB dovish tone',
  'VIX drops to multi-month low as volatility eases',
  'Bond market signals potential recession concerns',
  'US GDP growth beats expectations at 3.1%',
  'Jobs report shows resilient labor market',
];

const TREND_HEADLINES = [
  'AI-related stocks continue multi-week rally',
  '{sector} rotation accelerates into safe havens',
  'Growth-to-value rotation enters third week',
  'Small caps outperform large caps in broadening rally',
  'Momentum factor dominates as trend continues',
  'Risk-on sentiment drives cyclical sectors higher',
  'Flight to quality pushes defensive sectors up',
  '{sector} sector trend strengthens on fund flows',
  'Market breadth improves as rally broadens',
  'Sector rotation signals new market leadership',
];

const SOURCES: NewsSource[] = ['reuters', 'bloomberg', 'wsj', 'cnbc', 'ft', 'social'];

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateHeadline(sentiment: NewsSentiment, ticker: string, sector: string): string {
  const templates =
    sentiment === 'positive'
      ? HEADLINES_POSITIVE
      : sentiment === 'negative'
        ? HEADLINES_NEGATIVE
        : HEADLINES_NEUTRAL;

  return pickRandom(templates).replace('{ticker}', ticker).replace('{sector}', sector);
}

function generateSummary(headline: string, sentiment: NewsSentiment): string {
  const suffixes = {
    positive: [
      'Analysts are raising price targets in response.',
      'Market participants see further upside potential.',
      'Institutional buying has picked up significantly.',
    ],
    negative: [
      'Analysts are revising estimates downward.',
      'Market participants are monitoring for further downside.',
      'Risk managers are flagging increased volatility.',
    ],
    neutral: [
      'Analysts are monitoring the situation closely.',
      'Market impact expected to be limited in the near term.',
      'Traders are positioning ahead of the next catalyst.',
    ],
  };
  return `${headline}. ${pickRandom(suffixes[sentiment])}`;
}

export function generateNewsItem(feedType?: NewsFeedType): NewsItem {
  const tickerDef = pickRandom(TICKER_UNIVERSE);
  const sentiments: NewsSentiment[] = ['positive', 'neutral', 'negative'];
  const sentiment = pickRandom(sentiments);
  const type = feedType ?? pickRandom(['global', 'trend', 'looking-at', 'watchlist'] as NewsFeedType[]);

  let headline: string;

  if (type === 'global') {
    headline = pickRandom(GLOBAL_HEADLINES);
  } else if (type === 'trend') {
    headline = pickRandom(TREND_HEADLINES).replace('{sector}', tickerDef.sector);
  } else {
    headline = generateHeadline(sentiment, tickerDef.symbol, tickerDef.sector);
  }

  return {
    id: uuidv4(),
    headline,
    summary: generateSummary(headline, sentiment),
    source: pickRandom(SOURCES),
    timestamp: Date.now() - Math.floor(Math.random() * 3600000),
    sentiment,
    tickers: [tickerDef.symbol],
    sectors: [tickerDef.sector],
    feedType: type,
    impact: Math.floor(Math.random() * 100),
    relevanceScore: 50 + Math.floor(Math.random() * 50),
  };
}

export function generateGlobalNews(): NewsItem {
  return generateNewsItem('global');
}

export function generateTrendNews(): NewsItem {
  return generateNewsItem('trend');
}

export function generateLookingAtNews(tickers: string[], sectors: string[]): NewsItem {
  const sentiments: NewsSentiment[] = ['positive', 'neutral', 'negative'];
  const sentiment = pickRandom(sentiments);
  const ticker = tickers.length > 0 ? pickRandom(tickers) : pickRandom(TICKER_UNIVERSE).symbol;
  const sector = sectors.length > 0 ? pickRandom(sectors) : pickRandom([...SECTORS]);
  const headline = generateHeadline(sentiment, ticker, sector);

  return {
    id: uuidv4(),
    headline,
    summary: generateSummary(headline, sentiment),
    source: pickRandom(SOURCES),
    timestamp: Date.now() - Math.floor(Math.random() * 1800000),
    sentiment,
    tickers: [ticker],
    sectors: [sector],
    feedType: 'looking-at',
    impact: Math.floor(Math.random() * 100),
    relevanceScore: 70 + Math.floor(Math.random() * 30),
  };
}

export function generateWatchlistNews(subscribedSymbols: string[]): NewsItem {
  const sentiments: NewsSentiment[] = ['positive', 'neutral', 'negative'];
  const sentiment = pickRandom(sentiments);

  let ticker: string;
  let sector: string;

  if (subscribedSymbols.length > 0) {
    ticker = pickRandom(subscribedSymbols);
    const def = TICKER_UNIVERSE.find((t) => t.symbol === ticker);
    sector = def?.sector ?? pickRandom([...SECTORS]);
  } else {
    const def = pickRandom(TICKER_UNIVERSE);
    ticker = def.symbol;
    sector = def.sector;
  }

  const headline = generateHeadline(sentiment, ticker, sector);

  return {
    id: uuidv4(),
    headline,
    summary: generateSummary(headline, sentiment),
    source: pickRandom(SOURCES),
    timestamp: Date.now() - Math.floor(Math.random() * 1800000),
    sentiment,
    tickers: [ticker],
    sectors: [sector],
    feedType: 'watchlist',
    impact: Math.floor(Math.random() * 100),
    relevanceScore: 60 + Math.floor(Math.random() * 40),
  };
}

export function generateNewsBatch(countPerFeed: number): Record<NewsFeedType, NewsItem[]> {
  const global = Array.from({ length: countPerFeed }, () => generateGlobalNews())
    .sort((a, b) => b.timestamp - a.timestamp);
  const trend = Array.from({ length: countPerFeed }, () => generateTrendNews())
    .sort((a, b) => b.timestamp - a.timestamp);
  const lookingAt = Array.from({ length: countPerFeed }, () =>
    generateLookingAtNews([], [])
  ).sort((a, b) => b.timestamp - a.timestamp);
  const watchlist = Array.from({ length: countPerFeed }, () =>
    generateWatchlistNews([])
  ).sort((a, b) => b.timestamp - a.timestamp);

  return { global, trend, 'looking-at': lookingAt, watchlist };
}
