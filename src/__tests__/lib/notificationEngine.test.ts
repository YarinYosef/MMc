import {
  notify,
  notifyPriceAlert,
  setToastCallback,
  queueDigestNotification,
  notifyNewsForSymbol,
  simulateEmailNotification,
  simulatePhoneNotification,
  type NotificationPayload,
} from '@/lib/notificationEngine';

// Mock Notification API
Object.defineProperty(window, 'Notification', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({})),
});
Object.defineProperty(window.Notification, 'permission', {
  writable: true,
  value: 'denied',
});

describe('notificationEngine', () => {
  let toastSpy: jest.Mock;

  beforeEach(() => {
    toastSpy = jest.fn();
    setToastCallback(toastSpy);
  });

  afterEach(() => {
    setToastCallback(null as unknown as (p: NotificationPayload) => void);
  });

  it('notify sends to toast callback', () => {
    const payload: NotificationPayload = {
      type: 'price-alert',
      title: 'Test',
      message: 'Test message',
      timestamp: Date.now(),
    };
    notify(payload);
    expect(toastSpy).toHaveBeenCalledWith(payload);
  });

  it('notifyPriceAlert creates correct payload', () => {
    notifyPriceAlert('AAPL', 150, 'above');
    expect(toastSpy).toHaveBeenCalledTimes(1);
    const call = toastSpy.mock.calls[0][0];
    expect(call.type).toBe('price-alert');
    expect(call.title).toContain('AAPL');
    expect(call.message).toContain('above');
    expect(call.message).toContain('150.00');
    expect(call.ticker).toBe('AAPL');
  });

  it('notifyPriceAlert with below direction', () => {
    notifyPriceAlert('GOOG', 100, 'below');
    const call = toastSpy.mock.calls[0][0];
    expect(call.message).toContain('below');
  });

  it('queueDigestNotification with immediate frequency calls notify directly', () => {
    const payload: NotificationPayload = {
      type: 'news',
      title: 'News',
      message: 'Something happened',
      timestamp: Date.now(),
    };
    queueDigestNotification(payload, 'group-1', 'immediate');
    expect(toastSpy).toHaveBeenCalledWith(payload);
  });

  it('queueDigestNotification with hourly frequency does not call notify immediately', () => {
    const payload: NotificationPayload = {
      type: 'news',
      title: 'News',
      message: 'Something happened',
      timestamp: Date.now(),
    };
    queueDigestNotification(payload, 'group-1', 'hourly');
    expect(toastSpy).not.toHaveBeenCalled();
  });

  it('notifyNewsForSymbol sends news notification', () => {
    notifyNewsForSymbol('TSLA', 'Tesla earnings beat');
    expect(toastSpy).toHaveBeenCalledTimes(1);
    const call = toastSpy.mock.calls[0][0];
    expect(call.type).toBe('news');
    expect(call.title).toContain('TSLA');
    expect(call.message).toBe('Tesla earnings beat');
    expect(call.ticker).toBe('TSLA');
  });

  it('simulateEmailNotification logs to console', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    simulateEmailNotification('user@test.com', 'Alert', 'AAPL above 150');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('user@test.com'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Alert'));
    logSpy.mockRestore();
  });

  it('simulatePhoneNotification logs to console', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    simulatePhoneNotification('+15551234567', 'AAPL above 150');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('+15551234567'));
    logSpy.mockRestore();
  });
});
