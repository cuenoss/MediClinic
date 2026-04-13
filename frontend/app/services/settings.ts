import { api } from './api';

export interface ClinicConfig {
  clinic_name?: string;
  clinic_address?: string;
  clinic_phone?: string;
  clinic_email?: string;
  clinic_website?: string;
}

export interface AppointmentConfig {
  appointment_duration?: number;
  appointment_buffer?: number;
  max_appointments_per_day?: number;
  working_hours?: Record<string, string> | string;
  auto_confirm?: boolean;
  allow_cancellation_hours?: number;
}

export interface NotificationConfig {
  email_notifications?: boolean;
  sms_notifications?: boolean;
  appointment_reminders?: boolean;
  reminder_hours_before?: number;
}

export interface CurrentUser {
  id: number;
  fullName: string;
  email: string;
}

export class SettingsService {
  private apiClient: any;

  constructor() {
    this.apiClient = api;
  }

  async getClinicConfig(): Promise<ClinicConfig> {
    return this.apiClient.request('/api/settings/config/clinic');
  }

  async getAppointmentConfig(): Promise<AppointmentConfig> {
    return this.apiClient.request('/api/settings/config/appointments');
  }

  async getNotificationConfig(): Promise<NotificationConfig> {
    return this.apiClient.request('/api/settings/config/notifications');
  }

  async getCurrentUser(): Promise<CurrentUser> {
    return this.apiClient.request('/api/auth/me');
  }

  async bulkUpdateSettings(updates: Record<string, any>) {
    return this.apiClient.request('/api/settings/bulk-update', {
      method: 'POST',
      body: JSON.stringify({ updates }),
    });
  }
}

export const settingsService = new SettingsService();
