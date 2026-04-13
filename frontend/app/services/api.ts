// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000';

// Type definitions
export interface Consultation {
  id?: number;
  patient_id?: number;
  doctor_id?: number;
  consultation_date?: string;
  date?: string;
  chief_complaint?: string;
  complaint?: string;
  main_complaint?: string;
  symptoms?: string;
  symptoms_checklist?: string[] | string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  follow_up_date?: string;
  medical_history?: string;
  family_medical_history?: string;
  doctor?: string | number;
}

// API Client
export class ApiClient {
  protected baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => headers.append(key, value));
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => headers.append(key, value));
      } else {
        Object.entries(options.headers).forEach(([key, value]) => {
          if (typeof value === 'string') {
            headers.append(key, value);
          }
        });
      }
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    // Add authorization header if token exists
    const token = localStorage.getItem('access_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { detail: errorText };
        }
        
        console.error('API Error:', {
          endpoint,
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        
        throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Success:', { endpoint, data });
      return data;
    } catch (error) {
      console.error('Request failed:', { endpoint, error });
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async forgotPassword(email: string) {
    return this.request('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string) {
    return this.request('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, new_password: newPassword }),
    });
  }

  // Patient endpoints
  async getPatients(page: number = 1, pageSize: number = 10, filters?: any) {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
      ...(filters && Object.keys(filters).reduce((acc, key) => {
        if (filters[key]) acc[key] = filters[key];
        return acc;
      }, {} as any)),
    });
    
    return this.request(`/api/patients?${params}`);
  }

  async getPatient<T = any>(id: number): Promise<T> {
    return this.request<T>(`/api/patients/${id}`);
  }

  async createPatient(patientData: any) {
    return this.request('/api/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  }

  async updatePatient(id: number, patientData: any) {
    return this.request(`/api/patients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patientData),
    });
  }

  async deletePatient(id: number) {
    return this.request(`/api/patients/${id}`, {
      method: 'DELETE',
    });
  }

  // Consultation endpoints
  async getPatientConsultations(patientId: number): Promise<Consultation[] | { data: Consultation[] }> {
    return this.request<Consultation[] | { data: Consultation[] }>(`/api/patients/${patientId}/consultations`);
  }

  async createConsultation(patientId: number, consultationData: any) {
    return this.request(`/api/patients/${patientId}/consultations`, {
      method: 'POST',
      body: JSON.stringify(consultationData),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/api/health');
  }
}

// Create singleton instance
export const api = new ApiClient();


//files endpoint
export class FileApiClient extends ApiClient {
  async uploadFile(file: File, patientId: number) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${this.baseURL}/api/patients/${patientId}/files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { detail: errorText };
        }
        
        console.error('File Upload Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        
        throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json(); 
      console.log('File Upload Success:', data);
      return data;
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }

  async getPatientFiles(patientId: number) {
    try {
      const response = await fetch(`${this.baseURL}/api/patients/${patientId}/files`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { detail: errorText };
        }
        
        throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch patient files:', error);
      throw error;
    }
  }

  async deletePatientFile(patientId: number, fileId: number) {
    try {
      const response = await fetch(`${this.baseURL}/api/patients/${patientId}/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { detail: errorText };
        }
        
        throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to delete patient file:', error);
      throw error;
    }
  }
}

export const fileApi = new FileApiClient();
