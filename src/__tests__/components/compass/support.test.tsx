import React from 'react';
import { render, screen } from '@testing-library/react';
import { AnalystsCompass } from '@/components/compass/support/AnalystsCompass';
import { TimeCompass } from '@/components/compass/support/TimeCompass';
import { TechnicalAnomalies } from '@/components/compass/support/TechnicalAnomalies';
import { makeState } from './helpers';

// ─── AnalystsCompass ────────────────────────────────────────────────────────

describe('AnalystsCompass', () => {
  const upFastState = makeState('analysts', {
    details: { revisionDirection: 'Up', revisionSpeed: 'Fast', coverage: 35, dispersion: 20 },
  });

  const downSlowState = makeState('analysts', {
    details: { revisionDirection: 'Down', revisionSpeed: 'Slow', coverage: 8, dispersion: 65 },
  });

  const flatState = makeState('analysts', {
    details: { revisionDirection: 'Flat', revisionSpeed: 'Moderate', coverage: 20, dispersion: 40 },
  });

  it('renders closed mode with direction and speed', () => {
    const { container } = render(<AnalystsCompass state={upFastState} expanded={false} />);
    expect(screen.getByText('Analysts')).toBeInTheDocument();
    expect(screen.getByText('Up')).toBeInTheDocument();
    expect(screen.getByText('Fast')).toBeInTheDocument();
    // Direction arrow SVG
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('renders Down direction in closed mode', () => {
    render(<AnalystsCompass state={downSlowState} expanded={false} />);
    expect(screen.getByText('Down')).toBeInTheDocument();
    expect(screen.getByText('Slow')).toBeInTheDocument();
  });

  it('renders Flat direction in closed mode', () => {
    render(<AnalystsCompass state={flatState} expanded={false} />);
    expect(screen.getByText('Flat')).toBeInTheDocument();
    expect(screen.getByText('Moderate')).toBeInTheDocument();
  });

  it('renders expanded mode with direction/speed visual', () => {
    render(<AnalystsCompass state={upFastState} expanded={true} />);
    expect(screen.getByText('Analyst Revisions')).toBeInTheDocument();
    expect(screen.getByText('Revision Direction')).toBeInTheDocument();
    expect(screen.getByText('Speed')).toBeInTheDocument();
  });

  it('renders coverage and dispersion bars', () => {
    render(<AnalystsCompass state={upFastState} expanded={true} />);
    expect(screen.getByText('Coverage')).toBeInTheDocument();
    expect(screen.getByText('35 analysts')).toBeInTheDocument();
    expect(screen.getByText('Dispersion')).toBeInTheDocument();
    expect(screen.getByText('20%')).toBeInTheDocument();
  });

  it('renders dispersion scale labels', () => {
    render(<AnalystsCompass state={upFastState} expanded={true} />);
    expect(screen.getByText('Consensus')).toBeInTheDocument();
    expect(screen.getByText('Dispersed')).toBeInTheDocument();
  });
});

// ─── TimeCompass ────────────────────────────────────────────────────────────

describe('TimeCompass', () => {
  const favorableState = makeState('time', {
    details: {
      seasonality: 75,
      calendarRisk: 20,
      multiTf: 70,
      timeColor: 'green',
      dayOfWeek: 'Tue',
      monthName: 'Feb',
      isOpex: 'No',
      earningsWeek: 'Yes',
      fomc: 'None',
    },
  });

  const unfavorableState = makeState('time', {
    details: {
      seasonality: 25,
      calendarRisk: 80,
      multiTf: 30,
      timeColor: 'red',
      dayOfWeek: 'Fri',
      monthName: 'Sep',
      isOpex: 'Yes',
      earningsWeek: 'No',
      fomc: 'Upcoming',
    },
  });

  it('renders closed mode with clock SVG and time label', () => {
    const { container } = render(<TimeCompass state={favorableState} expanded={false} />);
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Favorable')).toBeInTheDocument();
    // Clock SVG
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('renders Unfavorable time correctly in closed mode', () => {
    render(<TimeCompass state={unfavorableState} expanded={false} />);
    expect(screen.getByText('Unfavorable')).toBeInTheDocument();
  });

  it('renders expanded mode with metric bars', () => {
    render(<TimeCompass state={favorableState} expanded={true} />);
    expect(screen.getByText('Time Compass')).toBeInTheDocument();
    expect(screen.getByText('Seasonality')).toBeInTheDocument();
    expect(screen.getByText('Calendar Risk')).toBeInTheDocument();
    expect(screen.getByText('Multi-Timeframe')).toBeInTheDocument();
  });

  it('renders calendar events', () => {
    render(<TimeCompass state={favorableState} expanded={true} />);
    expect(screen.getByText('Calendar Events')).toBeInTheDocument();
    expect(screen.getByText('Day')).toBeInTheDocument();
    expect(screen.getByText('OPEX')).toBeInTheDocument();
    expect(screen.getByText('Earnings')).toBeInTheDocument();
    expect(screen.getByText('FOMC')).toBeInTheDocument();
  });

  it('renders day and month info', () => {
    render(<TimeCompass state={favorableState} expanded={true} />);
    expect(screen.getByText('Tue, Feb')).toBeInTheDocument();
  });

  it('shows OPEX/Earnings/FOMC values', () => {
    render(<TimeCompass state={favorableState} expanded={true} />);
    expect(screen.getByText('No')).toBeInTheDocument(); // OPEX
    expect(screen.getByText('Yes')).toBeInTheDocument(); // Earnings
    expect(screen.getByText('None')).toBeInTheDocument(); // FOMC
  });

  it('renders highlighted OPEX and FOMC Upcoming', () => {
    render(<TimeCompass state={unfavorableState} expanded={true} />);
    expect(screen.getByText('Upcoming')).toBeInTheDocument(); // FOMC
  });

  it('renders neutral time color correctly', () => {
    const neutralState = makeState('time', {
      details: {
        seasonality: 50, calendarRisk: 50, multiTf: 50, timeColor: 'gray',
        dayOfWeek: 'Wed', monthName: 'Jun', isOpex: 'No', earningsWeek: 'No', fomc: 'None',
      },
    });
    render(<TimeCompass state={neutralState} expanded={false} />);
    expect(screen.getByText('Neutral')).toBeInTheDocument();
  });
});

// ─── TechnicalAnomalies ─────────────────────────────────────────────────────

describe('TechnicalAnomalies', () => {
  const normalState = makeState('technical-anomalies', {
    confidence: 80,
    signal: 'neutral',
    details: { anomalyCount: 0, detected: 'None', isNormal: 'Normal' },
  });

  const alertState = makeState('technical-anomalies', {
    confidence: 65,
    signal: 'bearish',
    details: { anomalyCount: 3, detected: 'Volume Divergence, Price Gap, RSI Divergence', isNormal: 'Alert' },
  });

  it('renders closed mode with checkmark when normal', () => {
    const { container } = render(<TechnicalAnomalies state={normalState} expanded={false} />);
    expect(screen.getByText('Anomaly')).toBeInTheDocument();
    // Should have checkmark SVG (path with "M2 5 L4 7 L8 3")
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBe(1);
  });

  it('renders closed mode with warning icon and count when alert', () => {
    render(<TechnicalAnomalies state={alertState} expanded={false} />);
    expect(screen.getByText('Anomaly')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders expanded mode with "All Clear" when normal', () => {
    const { container } = render(<TechnicalAnomalies state={normalState} expanded={true} />);
    expect(screen.getByText('Technical Anomalies')).toBeInTheDocument();
    expect(screen.getByText('Clear')).toBeInTheDocument();
    expect(screen.getByText('All Clear')).toBeInTheDocument();
    expect(screen.getByText('No anomalies detected')).toBeInTheDocument();
    // Large checkmark SVG
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('renders expanded mode with anomaly list when alert', () => {
    render(<TechnicalAnomalies state={alertState} expanded={true} />);
    expect(screen.getByText('Technical Anomalies')).toBeInTheDocument();
    expect(screen.getByText('3 Alerts')).toBeInTheDocument();
    expect(screen.getByText('Volume Divergence')).toBeInTheDocument();
    expect(screen.getByText('Price Gap')).toBeInTheDocument();
    expect(screen.getByText('RSI Divergence')).toBeInTheDocument();
  });

  it('renders severity labels for anomalies', () => {
    render(<TechnicalAnomalies state={alertState} expanded={true} />);
    // Volume Divergence = Medium, Price Gap = High, RSI Divergence = Medium
    const mediumLabels = screen.getAllByText('Medium');
    expect(mediumLabels.length).toBe(2);
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('renders confidence and signal in footer', () => {
    render(<TechnicalAnomalies state={alertState} expanded={true} />);
    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByText('bearish')).toBeInTheDocument();
  });

  it('renders single alert correctly', () => {
    const singleAlert = makeState('technical-anomalies', {
      details: { anomalyCount: 1, detected: 'Bollinger Break', isNormal: 'Alert' },
    });
    render(<TechnicalAnomalies state={singleAlert} expanded={true} />);
    expect(screen.getByText('1 Alert')).toBeInTheDocument();
    expect(screen.getByText('Bollinger Break')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
  });
});
