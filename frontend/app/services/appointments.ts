import { api } from './api';

export interface Appointment {
  id: number;
  patient_id: number;
  patient_name?: string;
  time: string;
  type: string;
  duration: number;
  payment_amount?: number;
}

export interface AppointmentCreate {
  patient_name: string;
  phone_number: string;
  time: string;
  type: string;
  duration: number;
  payment_amount?: number;
  patient_id?: number;
}

export interface AppointmentUpdate {
  date?: string;
  time?: string;
  type?: string;
  status?: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  notes?: string;
}

export class AppointmentsService {
  private apiClient: any;

  constructor() {
    this.apiClient = api;
  }

  // Get all appointments
  async getAppointments() {
    return this.apiClient.request('/api/appointments/all');
  }

  // Get specific appointment - not available in backend
  // async getAppointment(id: number) {
  //   return this.apiClient.request(`/api/appointments/${id}`);
  // }

  // Create new appointment
  async createAppointment(appointmentData: AppointmentCreate) {
    return this.apiClient.request('/api/appointments/create', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  // Update appointment - not available in backend
  // async updateAppointment(id: number, appointmentData: AppointmentUpdate) {
  //   return this.apiClient.request(`/api/appointments/${id}`, {
  //     method: 'PATCH',
  //     body: JSON.stringify(appointmentData),
  //   });
  // }

  // Delete appointment
  async deleteAppointment(id: number) {
    return this.apiClient.request(`/api/appointments/${id}`, {
      method: 'DELETE',
    });
  }

  // Get today's appointments
  async getTodayAppointments() {
    const appointments = await this.getAppointments();
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter((apt: any) => apt.time && apt.time.startsWith(today));
  }

  // Get upcoming appointments
  async getUpcomingAppointments(days: number = 7) {
    const appointments = await this.getAppointments();
    const today = new Date();
    const endDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));
    const todayStr = today.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];
    
    return appointments.filter((apt: any) => {
      if (!apt.time) return false;
      const aptDate = apt.time.split('T')[0];
      return aptDate >= todayStr && aptDate <= endStr;
    });
  }

  // Get appointments by patient
  async getPatientAppointments(patientId: number) {
    const appointments = await this.getAppointments();
    return (appointments || []).filter((apt: any) => apt.patient_id === patientId);
  }
}

// Create singleton instance
export const appointmentsService = new AppointmentsService();
