import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, X, Edit2, Trash2, Check, Info, Settings, Bell, Globe } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

interface Activity {
  id: string;
  title: string;
  location: string;
  time: string;
  duration: string;
  description?: string;
  type: 'tour' | 'attraction' | 'restaurant' | 'custom';
}

interface DaySchedule {
  [key: string]: Activity[];
}

interface ScheduleSettings {
  notifications: {
    reminders: boolean;
    dailyDigest: boolean;
    upcomingActivities: boolean;
  };
  display: {
    timeFormat: '12h' | '24h';
    startOfWeek: 'Monday' | 'Sunday';
    showWeekends: boolean;
  };
}

const ScheduleScreen: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings>({
    notifications: {
      reminders: true,
      dailyDigest: true,
      upcomingActivities: true
    },
    display: {
      timeFormat: '24h',
      startOfWeek: 'Monday',
      showWeekends: true
    }
  });

  // ... (keep existing state and handlers)

  const handleSettingsChange = (newSettings: ScheduleSettings) => {
    setScheduleSettings(newSettings);
    // Here you would typically persist these settings
    console.log('Updated schedule settings:', newSettings);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Schedule</h2>
          <p className="text-gray-600">Plan your activities for each day of the week</p>
        </div>
        <button
          onClick={() => setShowSettingsModal(true)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Settings className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Existing schedule grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* ... (keep existing schedule grid code) */}
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Schedule Settings</h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Notification Settings */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-purple-600" />
                  Notifications
                </h4>
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Activity Reminders</span>
                    <input
                      type="checkbox"
                      checked={scheduleSettings.notifications.reminders}
                      onChange={(e) => handleSettingsChange({
                        ...scheduleSettings,
                        notifications: {
                          ...scheduleSettings.notifications,
                          reminders: e.target.checked
                        }
                      })}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Daily Schedule Digest</span>
                    <input
                      type="checkbox"
                      checked={scheduleSettings.notifications.dailyDigest}
                      onChange={(e) => handleSettingsChange({
                        ...scheduleSettings,
                        notifications: {
                          ...scheduleSettings.notifications,
                          dailyDigest: e.target.checked
                        }
                      })}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Upcoming Activities</span>
                    <input
                      type="checkbox"
                      checked={scheduleSettings.notifications.upcomingActivities}
                      onChange={(e) => handleSettingsChange({
                        ...scheduleSettings,
                        notifications: {
                          ...scheduleSettings.notifications,
                          upcomingActivities: e.target.checked
                        }
                      })}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </label>
                </div>
              </div>

              {/* Display Settings */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-purple-600" />
                  Display
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Format
                    </label>
                    <select
                      value={scheduleSettings.display.timeFormat}
                      onChange={(e) => handleSettingsChange({
                        ...scheduleSettings,
                        display: {
                          ...scheduleSettings.display,
                          timeFormat: e.target.value as '12h' | '24h'
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="12h">12-hour (AM/PM)</option>
                      <option value="24h">24-hour</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start of Week
                    </label>
                    <select
                      value={scheduleSettings.display.startOfWeek}
                      onChange={(e) => handleSettingsChange({
                        ...scheduleSettings,
                        display: {
                          ...scheduleSettings.display,
                          startOfWeek: e.target.value as 'Monday' | 'Sunday'
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="Monday">Monday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                  </div>

                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Show Weekends</span>
                    <input
                      type="checkbox"
                      checked={scheduleSettings.display.showWeekends}
                      onChange={(e) => handleSettingsChange({
                        ...scheduleSettings,
                        display: {
                          ...scheduleSettings.display,
                          showWeekends: e.target.checked
                        }
                      })}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keep existing modals */}
      {/* ... */}
    </div>
  );
};

export default ScheduleScreen;