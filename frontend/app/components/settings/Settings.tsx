import { useEffect, useState } from 'react';
import {
  Building,
  Clock,
  Bell,
  Database,
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Globe,
} from 'lucide-react';
import { settingsService } from '../../services/settings';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';

export function Settings() {
  const [clinicInfo, setClinicInfo] = useState({
    name: 'MediClinic Health Center',
    address: '123 Medical Plaza, Suite 100, New York, NY 10001',
    phone: '+1 (555) 000-0000',
    email: 'info@mediclinic.com',
    website: 'www.mediclinic.com',
  });

  const [workingHours, setWorkingHours] = useState<{
    [key: string]: string;
  }>({
    monday: '09:00 AM - 05:00 PM',
    tuesday: '09:00 AM - 05:00 PM',
    wednesday: '09:00 AM - 05:00 PM',
    thursday: '09:00 AM - 05:00 PM',
    friday: '09:00 AM - 05:00 PM',
    saturday: '10:00 AM - 02:00 PM',
    sunday: 'Closed',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    paymentAlerts: true,
  });

  const [profile, setProfile] = useState({
    fullName: '',
    specialization: 'General Practitioner',
    license: 'MD-123456',
    email: '',
    phone: '+1 (555) 123-4567',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const results = await Promise.allSettled([
          settingsService.getClinicConfig(),
          settingsService.getAppointmentConfig(),
          settingsService.getNotificationConfig(),
          settingsService.getCurrentUser(),
        ]);

        const clinicConfig = results[0].status === 'fulfilled' ? results[0].value : {};
        const appointmentConfig = results[1].status === 'fulfilled' ? results[1].value : {};
        const notificationConfig = results[2].status === 'fulfilled' ? results[2].value : {};
        const currentUser = results[3].status === 'fulfilled' ? results[3].value : null;

        setClinicInfo((prev) => ({
          ...prev,
          name: clinicConfig.clinic_name || prev.name,
          address: clinicConfig.clinic_address || prev.address,
          phone: clinicConfig.clinic_phone || prev.phone,
          email: clinicConfig.clinic_email || prev.email,
          website: clinicConfig.clinic_website || prev.website,
        }));

        if (appointmentConfig.working_hours && typeof appointmentConfig.working_hours === 'object') {
          setWorkingHours((prev) => ({
            ...prev,
            ...appointmentConfig.working_hours,
          }));
        }

        setNotifications((prev) => ({
          ...prev,
          emailNotifications: notificationConfig.email_notifications ?? prev.emailNotifications,
          smsNotifications: notificationConfig.sms_notifications ?? prev.smsNotifications,
          appointmentReminders: notificationConfig.appointment_reminders ?? prev.appointmentReminders,
        }));

        if (currentUser) {
          setProfile((prev) => ({
            ...prev,
            fullName: currentUser.fullName || prev.fullName,
            email: currentUser.email || prev.email,
          }));
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
        setErrorMessage('Unable to load settings from the server.');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSaveClinic = async () => {
    try {
      setIsSaving(true);
      await settingsService.bulkUpdateSettings({
        clinic_name: clinicInfo.name,
        clinic_address: clinicInfo.address,
        clinic_phone: clinicInfo.phone,
        clinic_email: clinicInfo.email,
        clinic_website: clinicInfo.website,
      });
      alert('Clinic information saved successfully!');
    } catch (error) {
      console.error('Failed to save clinic settings:', error);
      alert('Unable to save clinic settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProfile = () => {
    alert('Profile data is synced from the backend and is read-only in this view.');
  };

  const handleSaveNotifications = async () => {
    try {
      setIsSaving(true);
      await settingsService.bulkUpdateSettings({
        email_notifications: notifications.emailNotifications,
        sms_notifications: notifications.smsNotifications,
        appointment_reminders: notifications.appointmentReminders,
      });
      alert('Notification settings saved successfully!');
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      alert('Unable to save notification settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveWorkingHours = async () => {
    try {
      setIsSaving(true);
      await settingsService.bulkUpdateSettings({
        working_hours: workingHours,
      });
      alert('Working hours saved successfully!');
    } catch (error) {
      console.error('Failed to save working hours:', error);
      alert('Unable to save working hours. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackup = (type: string) => {
    alert(`${type} backup initiated...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-800 mb-2">Settings</h1>
        <p className="text-slate-600">Manage your clinic and account settings</p>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* User Profile */}
      <Card className="overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <h2 className="text-xl font-semibold">User Profile</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profile.fullName}
                onChange={(e) =>
                  setProfile({ ...profile, fullName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                value={profile.specialization}
                onChange={(e) =>
                  setProfile({ ...profile, specialization: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license">Medical License</Label>
              <Input
                id="license"
                value={profile.license}
                onChange={(e) =>
                  setProfile({ ...profile, license: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profileEmail">Email</Label>
              <Input
                id="profileEmail"
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profilePhone">Phone</Label>
              <Input
                id="profilePhone"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSaveProfile}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </Button>
          </div>
        </div>
      </Card>

      {/* Clinic Information */}
      <Card className="overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-4">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Clinic Information</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clinicName">Clinic Name</Label>
            <Input
              id="clinicName"
              value={clinicInfo.name}
              onChange={(e) =>
                setClinicInfo({ ...clinicInfo, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={clinicInfo.address}
              onChange={(e) =>
                setClinicInfo({ ...clinicInfo, address: e.target.value })
              }
              rows={2}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clinicPhone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="clinicPhone"
                  value={clinicInfo.phone}
                  onChange={(e) =>
                    setClinicInfo({ ...clinicInfo, phone: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinicEmail">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="clinicEmail"
                  type="email"
                  value={clinicInfo.email}
                  onChange={(e) =>
                    setClinicInfo({ ...clinicInfo, email: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                id="website"
                value={clinicInfo.website}
                onChange={(e) =>
                  setClinicInfo({ ...clinicInfo, website: e.target.value })
                }
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSaveClinic}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </Card>

      {/* Working Hours */}
      <Card className="overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Working Hours</h2>
          </div>
        </div>
        <div className="p-6 space-y-3">
          {Object.entries(workingHours).map(([day, hours]) => (
            <div key={day} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <span className="font-medium text-slate-700 capitalize w-32">
                {day}
              </span>
              <Input
                value={hours}
                onChange={(e) =>
                  setWorkingHours({ ...workingHours, [day]: e.target.value })
                }
                className="max-w-xs"
              />
            </div>
          ))}
          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveWorkingHours} className="bg-blue-600 hover:bg-blue-700" disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              Save Hours
            </Button>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Notification Settings</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-slate-800">Email Notifications</p>
              <p className="text-sm text-slate-600">
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={notifications.emailNotifications}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, emailNotifications: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-slate-800">SMS Notifications</p>
              <p className="text-sm text-slate-600">
                Receive notifications via text message
              </p>
            </div>
            <Switch
              checked={notifications.smsNotifications}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, smsNotifications: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-slate-800">Appointment Reminders</p>
              <p className="text-sm text-slate-600">
                Get reminders for upcoming appointments
              </p>
            </div>
            <Switch
              checked={notifications.appointmentReminders}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, appointmentReminders: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-slate-800">Payment Alerts</p>
              <p className="text-sm text-slate-600">
                Receive alerts for payment activities
              </p>
            </div>
            <Switch
              checked={notifications.paymentAlerts}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, paymentAlerts: checked })
              }
            />
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveNotifications} className="bg-blue-600 hover:bg-blue-700" disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              Save Notification Settings
            </Button>
          </div>
        </div>
      </Card>

      {/* Data Backup */}
      <Card className="overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Data Backup</h2>
          </div>
        </div>
        <div className="p-6">
          <p className="text-slate-600 mb-6">
            Backup your clinic data to ensure you never lose important information.
            Choose between local backup or cloud storage.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5 border-2 border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-2">Local Backup</h3>
              <p className="text-sm text-slate-600 mb-4">
                Download and save your data locally to your device
              </p>
              <Button
                onClick={() => handleBackup('Local')}
                variant="outline"
                className="w-full"
              >
                <Database className="w-4 h-4 mr-2" />
                Backup Locally
              </Button>
            </Card>
            <Card className="p-5 border-2 border-blue-200 bg-blue-50">
              <h3 className="font-semibold text-slate-800 mb-2">Cloud Backup</h3>
              <p className="text-sm text-slate-600 mb-4">
                Securely backup your data to cloud storage
              </p>
              <Button
                onClick={() => handleBackup('Cloud')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Database className="w-4 h-4 mr-2" />
                Backup to Cloud
              </Button>
            </Card>
          </div>
          <p className="text-sm text-slate-500 mt-4">
            Last backup: March 31, 2026 at 11:30 PM
          </p>
        </div>
      </Card>
    </div>
  );
}
