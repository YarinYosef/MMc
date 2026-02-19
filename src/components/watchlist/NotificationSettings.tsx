'use client';

import { useState } from 'react';
import { useWatchlistStore } from '@/stores/useWatchlistStore';
import { type NotificationFrequency } from '@/data/types/watchlist';
import { requestNotificationPermission } from '@/lib/notificationEngine';
import { cn } from '@/lib/utils';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[\d\s\-()]{7,15}$/;

interface NotificationSettingsProps {
  onClose: () => void;
}

export function NotificationSettings({ onClose }: NotificationSettingsProps) {
  const contactInfo = useWatchlistStore((s) => s.contactInfo);
  const setContactInfo = useWatchlistStore((s) => s.setContactInfo);
  const groups = useWatchlistStore((s) => s.groups);
  const notificationPrefs = useWatchlistStore((s) => s.notificationPrefs);
  const setNotificationPref = useWatchlistStore((s) => s.setNotificationPref);

  const [email, setEmail] = useState(contactInfo.emailAddress);
  const [phone, setPhone] = useState(contactInfo.phoneNumber);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [saved, setSaved] = useState(false);

  const validateAndSaveEmail = () => {
    if (email && !EMAIL_REGEX.test(email)) {
      setEmailError('Invalid email format');
      return;
    }
    setEmailError('');
    setContactInfo({ emailAddress: email });
  };

  const validateAndSavePhone = () => {
    if (phone && !PHONE_REGEX.test(phone)) {
      setPhoneError('Invalid phone format');
      return;
    }
    setPhoneError('');
    setContactInfo({ phoneNumber: phone });
  };

  const handleSave = () => {
    let hasError = false;
    if (email && !EMAIL_REGEX.test(email)) {
      setEmailError('Invalid email format');
      hasError = true;
    } else {
      setEmailError('');
    }
    if (phone && !PHONE_REGEX.test(phone)) {
      setPhoneError('Invalid phone format');
      hasError = true;
    } else {
      setPhoneError('');
    }

    if (!hasError) {
      setContactInfo({ emailAddress: email, phoneNumber: phone });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleRequestPermission = async () => {
    await requestNotificationPermission();
  };

  const getGroupPrefs = (groupId: string) => {
    return notificationPrefs.find((p) => p.groupId === groupId);
  };

  const getFrequency = (groupId: string): NotificationFrequency => {
    return getGroupPrefs(groupId)?.frequency ?? 'immediate';
  };

  return (
    <div className="bg-[#131313] border-t border-black">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-black">
        <span className="text-[10px] font-semibold text-[#999999] uppercase tracking-wider">
          Notification Settings
        </span>
        <button
          onClick={onClose}
          className="p-0.5 text-[#777777] hover:text-[#999999] transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      </div>

      <div className="px-3 py-2 space-y-3 max-h-64 overflow-y-auto">
        {/* Contact info section */}
        <div className="space-y-2">
          <span className="text-[10px] text-[#999999] uppercase tracking-wider font-medium">
            Contact Information
          </span>

          {/* Email */}
          <div className="space-y-0.5">
            <label className="text-[10px] text-[#999999]">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
              }}
              onBlur={validateAndSaveEmail}
              placeholder="you@example.com"
              className={cn(
                'w-full bg-white/[0.06] border rounded px-2 py-1 text-[11px] text-white placeholder:text-[#777777] focus:outline-none focus:ring-1',
                emailError
                  ? 'border-[#FF7243] focus:ring-[#FF7243]'
                  : 'border-black focus:ring-[#AB9FF2]'
              )}
            />
            {emailError && (
              <span className="text-[9px] text-[#FF7243]">{emailError}</span>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-0.5">
            <label className="text-[10px] text-[#999999]">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setPhoneError('');
              }}
              onBlur={validateAndSavePhone}
              placeholder="+1 (555) 123-4567"
              className={cn(
                'w-full bg-white/[0.06] border rounded px-2 py-1 text-[11px] text-white placeholder:text-[#777777] focus:outline-none focus:ring-1',
                phoneError
                  ? 'border-[#FF7243] focus:ring-[#FF7243]'
                  : 'border-black focus:ring-[#AB9FF2]'
              )}
            />
            {phoneError && (
              <span className="text-[9px] text-[#FF7243]">{phoneError}</span>
            )}
          </div>

          {/* Browser notifications permission */}
          <button
            onClick={handleRequestPermission}
            className="text-[10px] text-[#AB9FF2] hover:text-[#AB9FF2] underline transition-colors"
          >
            Enable browser notifications
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-black" />

        {/* Per-group settings */}
        <div className="space-y-2">
          <span className="text-[10px] text-[#999999] uppercase tracking-wider font-medium">
            Per-Watchlist Settings
          </span>

          {groups.length === 0 ? (
            <span className="text-[10px] text-[#999999]">No watchlists created yet.</span>
          ) : (
            groups.map((group) => {
              const prefs = getGroupPrefs(group.id);
              return (
                <div key={group.id} className="bg-white/[0.03] rounded px-2 py-1.5 space-y-1.5">
                  {/* Group name with color indicator */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: group.color }}
                    />
                    <span className="text-[10px] font-medium text-[#999999] truncate">
                      {group.name}
                    </span>
                    <span className="text-[10px] text-[#999999] shrink-0">
                      {group.items.filter((i) => i.subscribedToNews).length} subscribed
                    </span>
                  </div>

                  {/* Channel toggles */}
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1 text-[10px] text-[#999999] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prefs?.email ?? false}
                        onChange={(e) => setNotificationPref(group.id, { email: e.target.checked })}
                        className="w-3 h-3 rounded border-black bg-white/[0.06] text-[#AB9FF2] focus:ring-0"
                      />
                      Email
                    </label>
                    <label className="flex items-center gap-1 text-[10px] text-[#999999] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prefs?.phone ?? false}
                        onChange={(e) => setNotificationPref(group.id, { phone: e.target.checked })}
                        className="w-3 h-3 rounded border-black bg-white/[0.06] text-[#AB9FF2] focus:ring-0"
                      />
                      Phone
                    </label>
                    <label className="flex items-center gap-1 text-[10px] text-[#999999] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prefs?.inApp ?? true}
                        onChange={(e) => setNotificationPref(group.id, { inApp: e.target.checked })}
                        className="w-3 h-3 rounded border-black bg-white/[0.06] text-[#AB9FF2] focus:ring-0"
                      />
                      In-App
                    </label>
                  </div>

                  {/* Frequency */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-[#999999] shrink-0">Frequency:</span>
                    {(['immediate', 'hourly', 'daily'] as NotificationFrequency[]).map((freq) => (
                      <button
                        key={freq}
                        onClick={() => setNotificationPref(group.id, { frequency: freq })}
                        className={cn(
                          'px-1.5 py-0.5 text-[9px] rounded transition-colors capitalize',
                          getFrequency(group.id) === freq
                            ? 'bg-[#AB9FF2]/20 text-[#AB9FF2] border border-[#AB9FF2]/30'
                            : 'bg-white/[0.06] text-[#777777] hover:text-[#999999] border border-transparent'
                        )}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end gap-2 pt-1">
          {saved && (
            <span className="text-[10px] text-[#2EC08B]">Saved!</span>
          )}
          <button
            onClick={handleSave}
            className="px-3 py-1 text-[10px] bg-[#AB9FF2] hover:brightness-110 text-white rounded transition-colors"
          >
            Save Contact Info
          </button>
        </div>
      </div>
    </div>
  );
}
