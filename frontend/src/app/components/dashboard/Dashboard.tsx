import { useState } from 'react';
import { Link } from 'react-router';
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

export function Dashboard() {
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    amount: '',
    day: '',
    time: ''
  });

  // Existing patients data
  const patients = [
    { id: 1, name: 'Sarah Johnson', age: 32, gender: 'Female', phone: '+1 (555) 123-4567', email: 'sarah.j@email.com', lastVisit: 'April 1, 2026', status: 'active' },
    { id: 2, name: 'Michael Chen', age: 45, gender: 'Male', phone: '+1 (555) 234-5678', email: 'michael.c@email.com', lastVisit: 'March 28, 2026', status: 'active' },
    { id: 3, name: 'Emma Davis', age: 28, gender: 'Female', phone: '+1 (555) 345-6789', email: 'emma.d@email.com', lastVisit: 'March 30, 2026', status: 'follow-up' },
    { id: 4, name: 'James Wilson', age: 56, gender: 'Male', phone: '+1 (555) 456-7890', email: 'james.w@email.com', lastVisit: 'April 3, 2026', status: 'critical' },
    { id: 5, name: 'Lisa Anderson', age: 38, gender: 'Female', phone: '+1 (555) 567-8901', email: 'lisa.a@email.com', lastVisit: 'March 25, 2026', status: 'active' },
    { id: 6, name: 'Robert Brown', age: 62, gender: 'Male', phone: '+1 (555) 678-9012', email: 'robert.b@email.com', lastVisit: 'March 29, 2026', status: 'chronic' },
  ];
  const stats = [
    {
      label: 'Total Patients',
      value: '1,234',
      icon: Users,
      trend: '+12.5%',
      color: 'bg-blue-500',
    },
    {
      label: "Today's Appointments",
      value: '18',
      icon: Calendar,
      trend: '+3',
      color: 'bg-green-500',
    },
    {
      label: 'Pending Payments',
      value: '$4,320',
      icon: DollarSign,
      trend: '-8.2%',
      color: 'bg-yellow-500',
    },
    {
      label: 'Consultations',
      value: '42',
      icon: FileText,
      trend: '+5',
      color: 'bg-purple-500',
    },
  ];

  const todayAppointments = [
    {
      id: 1,
      patient: 'Sarah Johnson',
      time: '09:00 AM',
      type: 'Check-up',
      status: 'confirmed',
    },
    {
      id: 2,
      patient: 'Michael Chen',
      time: '10:30 AM',
      type: 'Follow-up',
      status: 'confirmed',
    },
    {
      id: 3,
      patient: 'Emma Davis',
      time: '02:00 PM',
      type: 'Consultation',
      status: 'pending',
    },
    {
      id: 4,
      patient: 'James Wilson',
      time: '03:30 PM',
      type: 'Emergency',
      status: 'confirmed',
    },
  ];

  const recentPatients = [
    { id: 1, name: 'Sarah Johnson', lastVisit: '2 days ago', status: 'stable' },
    { id: 2, name: 'Michael Chen', lastVisit: '1 week ago', status: 'follow-up' },
    { id: 3, name: 'Emma Davis', lastVisit: '3 days ago', status: 'stable' },
    { id: 4, name: 'James Wilson', lastVisit: 'Today', status: 'critical' },
  ];

  const notifications = [
    { id: 1, text: 'New appointment request from Lisa Anderson', time: '5 min ago' },
    { id: 2, text: 'Lab results ready for Patient #1234', time: '1 hour ago' },
    { id: 3, text: 'Payment received from Michael Chen', time: '2 hours ago' },
  ];

  const handleAddToCalendar = () => {
    if (newPatient.name && newPatient.age && newPatient.gender && newPatient.phone && newPatient.email && newPatient.amount && newPatient.day && newPatient.time) {
      console.log('Adding new patient appointment:', newPatient);
      setShowAddPatientModal(false);
      setNewPatient({
        name: '',
        age: '',
        gender: '',
        phone: '',
        email: '',
        amount: '',
        day: '',
        time: ''
      });
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
              DS
            </div>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-1">Dr. John Smith</h2>
            <p className="text-blue-100">General Practitioner</p>
            <p className="text-sm text-blue-100 mt-1">License: MD-123456</p>
          </div>
          <div className="hidden md:flex flex-col items-end gap-2">
            <div className="text-sm text-blue-100">Next Appointment</div>
            <div className="text-lg font-semibold">09:00 AM</div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
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
        })}
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
                  Amount Paid
                </label>
                <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    placeholder="0.00"
                    value={newPatient.amount}
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        amount: e.target.value
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
                  disabled={!newPatient.name || !newPatient.age || !newPatient.gender || !newPatient.phone || !newPatient.email || !newPatient.amount || !newPatient.day || !newPatient.time}
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
