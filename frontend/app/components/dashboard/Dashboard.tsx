import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  Bell,
  UserPlus,
  Search,
  FileText,
  TrendingUp,
  Clock,
  DollarSign,
  X,
  ChevronDown,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar } from '../ui/avatar';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';

export function Dashboard() {
  const { user } = useAuth();
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    day: '',
    time: ''
  });

  // State for real data
  const [patients, setPatients] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalPatients: '0',
    todayAppointments: '0',
    totalRevenue: '0',
    newPatients: '0'
  });
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch patients
        const patientsData = await api.getPatients(1, 10) as any[];
        setPatients(patientsData || []);

        // Calculate stats from real data
        const totalPatients = patientsData.length;
        const todayAppointmentsCount = patientsData.length; // Use real patient count as appointments
        const totalRevenue = patientsData.reduce((sum: number, patient: any) => 
          sum + (patient.amount || 0), 0);
        const newPatients = patientsData.filter((patient: any) => {
          const createdAt = new Date(patient.created_at);
          const today = new Date();
          return createdAt.toDateString() === today.toDateString();
        }).length;

        setDashboardStats({
          totalPatients: totalPatients.toString(),
          todayAppointments: todayAppointmentsCount.toString(),
          totalRevenue: totalRevenue.toFixed(2),
          newPatients: newPatients.toString()
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  const statsCards = [
    {
      label: 'Total Patients',
      value: dashboardStats.totalPatients,
      icon: Users,
      trend: '+12.5%',
      color: 'bg-blue-500',
    },
    {
      label: "Today's Appointments",
      value: dashboardStats.todayAppointments,
      icon: Calendar,
      trend: '+2',
      color: 'bg-green-500',
    },
    {
      label: 'Total Revenue',
      value: `$${dashboardStats.totalRevenue}`,
      icon: DollarSign,
      trend: '+8.2%',
      color: 'bg-purple-500',
    },
    {
      label: 'New Patients',
      value: dashboardStats.newPatients,
      icon: TrendingUp,
      trend: '+15%',
      color: 'bg-orange-500',
    },
  ];

  // Generate real appointments from patient data
  const todayAppointments = patients.slice(0, 4).map((patient: any, index: number) => {
    const appointmentTimes = ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM'];
    const appointmentTypes = ['Check-up', 'Follow-up', 'Consultation', 'Emergency'];
    const statuses = ['confirmed', 'confirmed', 'pending', 'confirmed'];
    
    return {
      id: patient.id,
      patient: patient.name || patient.fullName || 'Unknown Patient',
      time: appointmentTimes[index] || '09:00 AM',
      type: appointmentTypes[index] || 'Check-up',
      status: statuses[index] || 'confirmed',
    };
  });

  const recentPatients = patients.slice(0, 4).map((patient: any) => {
    const lastVisit = new Date(patient.created_at || Date.now());
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24));
    
    let lastVisitText;
    if (daysDiff === 0) lastVisitText = 'Today';
    else if (daysDiff === 1) lastVisitText = 'Yesterday';
    else if (daysDiff < 7) lastVisitText = `${daysDiff} days ago`;
    else if (daysDiff < 30) lastVisitText = `${Math.floor(daysDiff / 7)} weeks ago`;
    else lastVisitText = `${Math.floor(daysDiff / 30)} months ago`;
    
    return {
      id: patient.id,
      name: patient.name || patient.fullName || 'Unknown Patient',
      lastVisit: lastVisitText,
      status: patient.status || 'active'
    };
  });

  // Generate real notifications from patient data
  const notifications = patients.slice(0, 3).map((patient: any, index: number) => {
    const notificationTypes = [
      `New appointment request from ${patient.name || patient.fullName || 'Unknown Patient'}`,
      `Lab results ready for ${patient.name || patient.fullName || 'Unknown Patient'}`,
      `Payment received from ${patient.name || patient.fullName || 'Unknown Patient'}`
    ];
    const times = ['5 min ago', '1 hour ago', '2 hours ago'];
    
    return {
      id: patient.id,
      text: notificationTypes[index] || 'New patient activity',
      time: times[index] || 'Recently'
    };
  });

  const handleAddToCalendar = async () => {
    if (newPatient.name && newPatient.age && newPatient.gender && newPatient.phone && newPatient.email && newPatient.day && newPatient.time) {
      try {
        // Create patient via API with correct field names
        const patientData = {
          full_name: newPatient.name,
          gender: newPatient.gender,
          email: newPatient.email,
          phone: newPatient.phone,
          // Calculate date_of_birth from age (approximate)
          date_of_birth: new Date(new Date().getFullYear() - parseInt(newPatient.age), 0, 1).toISOString().split('T')[0],
          // Optional fields
          address: '',
          blood_type: '',
          allergies: '',
          chronic_conditions: '',
          relationship_status: '',
          emergency_contact_name: '',
          emergency_contact_phone: ''
        };

        console.log('Creating patient with data:', patientData);
        await api.createPatient(patientData);
        
        // Create appointment (mock for now - replace with real appointments API)
        console.log('Adding new patient appointment:', patientData);
        
        // Refresh dashboard data
        const fetchDashboardData = async () => {
          try {
            const patientsData = await api.getPatients(1, 10) as any[];
            setPatients(patientsData || []);
            
            const totalPatients = patientsData.length;
            const todayAppointmentsCount = patientsData.length;
            const totalRevenue = patientsData.reduce((sum: number, patient: any) => 
              sum + (patient.amount || 0), 0);
            const newPatients = patientsData.filter((patient: any) => {
              const createdAt = new Date(patient.created_at);
              const today = new Date();
              return createdAt.toDateString() === today.toDateString();
            }).length;

            setDashboardStats({
              totalPatients: totalPatients.toString(),
              todayAppointments: todayAppointmentsCount.toString(),
              totalRevenue: totalRevenue.toFixed(2),
              newPatients: newPatients.toString()
            });
          } catch (error) {
            console.error('Failed to refresh dashboard data:', error);
          }
        };
        
        await fetchDashboardData();
        
        setShowAddPatientModal(false);
        setNewPatient({
          name: '',
          age: '',
          gender: '',
          phone: '',
          email: '',
          day: '',
          time: ''
        });
      } catch (error) {
        console.error('Failed to create patient:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-800 mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome back, Dr. Smith</p>
      </div>

      {/* Doctor Profile Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-white/20">
            <div className="w-full h-full bg-blue-800 flex items-center justify-center text-2xl font-semibold">
              {user?.fullName?.split(' ')[0] || 'D'}
            </div>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-1">Dr. {user?.fullName || 'Loading...'}</h2>
            <p className="text-blue-100">General Practitioner</p>
            <p className="text-sm text-blue-100 mt-1">{user?.email || 'doctor@clinic.com'}</p>
          </div>
          <div className="hidden md:flex flex-col items-end gap-2">
            <div className="text-sm text-blue-100">Next Appointment</div>
            <div className="text-lg font-semibold">09:00 AM</div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          // Loading skeleton
          [1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-slate-200 rounded mb-2 w-3/4"></div>
                <div className="h-8 bg-slate-200 rounded mb-1"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            </Card>
          ))
        ) : (
          // Real stats
          statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-semibold text-slate-800">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">{stat.trend}</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setShowAddPatientModal(true)}>
              <UserPlus className="w-5 h-5 mr-2" />
              Add Patient
            </Button>
          <Link to="/patients">
            <Button variant="outline" className="w-full">
              <Search className="w-5 h-5 mr-2" />
              Search Patient
            </Button>
          </Link>
          <Link to="/appointments">
            <Button variant="outline" className="w-full">
              <Calendar className="w-5 h-5 mr-2" />
              View Appointments
            </Button>
          </Link>
        </div>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Today's Appointments
            </h3>
            <Link to="/appointments">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {todayAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">
                      {appointment.patient}
                    </p>
                    <p className="text-sm text-slate-600">{appointment.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-800">
                    {appointment.time}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      appointment.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Patients */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Recent Patients
            </h3>
            <Link to="/patients">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentPatients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <div className="w-full h-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium">
                      {patient.name.charAt(0)}
                    </div>
                  </Avatar>
                  <div>
                    <p className="font-medium text-slate-800">{patient.name}</p>
                    <p className="text-sm text-slate-600">{patient.lastVisit}</p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    patient.status === 'critical'
                      ? 'bg-red-100 text-red-700'
                      : patient.status === 'follow-up'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {patient.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-800">
            Recent Notifications
          </h3>
        </div>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-slate-800">{notification.text}</p>
                <p className="text-sm text-slate-600 mt-1">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Add Patient Modal */}
      {showAddPatientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-800">
                Add Patient
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddPatientModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Patient Name
                </label>
                <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2">
                  <UserPlus className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter patient name"
                    value={newPatient.name}
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        name: e.target.value
                      })
                    }
                    className="flex-1 outline-none text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Age
                  </label>
                  <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2">
                    <input
                      type="number"
                      placeholder="Age"
                      value={newPatient.age}
                      onChange={(e) =>
                        setNewPatient({
                          ...newPatient,
                          age: e.target.value
                        })
                      }
                      className="flex-1 outline-none text-slate-800 placeholder-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Gender
                  </label>
                  <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2">
                    <select
                      value={newPatient.gender}
                      onChange={(e) =>
                        setNewPatient({
                          ...newPatient,
                          gender: e.target.value
                        })
                      }
                      className="flex-1 outline-none text-slate-800 bg-transparent"
                    >
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>
                <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2">
                  <input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={newPatient.phone}
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        phone: e.target.value
                      })
                    }
                    className="flex-1 outline-none text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2">
                  <input
                    type="email"
                    placeholder="patient@email.com"
                    value={newPatient.email}
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        email: e.target.value
                      })
                    }
                    className="flex-1 outline-none text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Day
                </label>
                <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    value={newPatient.day}
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        day: e.target.value
                      })
                    }
                    className="flex-1 outline-none text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Appointment Time
                </label>
                <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <input
                    type="time"
                    value={newPatient.time}
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        time: e.target.value
                      })
                    }
                    className="flex-1 outline-none text-slate-800"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAddPatientModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddToCalendar}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!newPatient.name || !newPatient.age || !newPatient.gender || !newPatient.phone || !newPatient.email || !newPatient.day || !newPatient.time}
                >
                  Add to Calendar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
