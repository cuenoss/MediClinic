import { useState } from 'react';
import { Link } from 'react-router';
import {
  ArrowLeft,
  Clock,
  User,
  Phone,
  Calendar,
  Plus,
  CheckCircle,
  AlertCircle,
  XCircle,
  X,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

export function AppointmentSchedule() {
  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    name: '',
    phone: '',
    time: '',
    type: 'Check-up',
    duration: '30 min'
  });

  const todayAppointments = [
    {
      id: 1,
      time: '09:00 AM',
      patient: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      type: 'Check-up',
      status: 'confirmed',
      duration: '30 min',
    },
    {
      id: 2,
      time: '09:30 AM',
      patient: 'Michael Chen',
      phone: '+1 (555) 234-5678',
      type: 'Follow-up',
      status: 'confirmed',
      duration: '20 min',
    },
    {
      id: 3,
      time: '10:30 AM',
      patient: 'Emma Davis',
      phone: '+1 (555) 345-6789',
      type: 'Consultation',
      status: 'pending',
      duration: '45 min',
    },
    {
      id: 4,
      time: '02:00 PM',
      patient: 'James Wilson',
      phone: '+1 (555) 456-7890',
      type: 'Emergency',
      status: 'confirmed',
      duration: '1 hour',
    },
    {
      id: 5,
      time: '03:30 PM',
      patient: 'Lisa Anderson',
      phone: '+1 (555) 567-8901',
      type: 'Check-up',
      status: 'pending',
      duration: '30 min',
    },
    {
      id: 6,
      time: '04:30 PM',
      patient: 'Robert Brown',
      phone: '+1 (555) 678-9012',
      type: 'Follow-up',
      status: 'cancelled',
      duration: '20 min',
    },
  ];

  
  const handleAddAppointment = () => {
    if (newAppointment.name && newAppointment.phone && newAppointment.time) {
      console.log('Adding appointment:', newAppointment);
      setShowAddAppointmentModal(false);
      setNewAppointment({
        name: '',
        phone: '',
        time: '',
        type: 'Check-up',
        duration: '30 min'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to="/appointments">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Calendar
        </Button>
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800 mb-2">
            Daily Schedule
          </h1>
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-5 h-5" />
            <span>Friday, April 3, 2026</span>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAddAppointmentModal(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Add Appointment
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-slate-600 mb-1">Total</p>
          <p className="text-2xl font-semibold text-slate-800">
            {todayAppointments.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-600 mb-1">Confirmed</p>
          <p className="text-2xl font-semibold text-green-600">
            {todayAppointments.filter((a) => a.status === 'confirmed').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-600 mb-1">Pending</p>
          <p className="text-2xl font-semibold text-yellow-600">
            {todayAppointments.filter((a) => a.status === 'pending').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-600 mb-1">Cancelled</p>
          <p className="text-2xl font-semibold text-red-600">
            {todayAppointments.filter((a) => a.status === 'cancelled').length}
          </p>
        </Card>
      </div>

      {/* Timeline */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">
          Today's Timeline
        </h3>
        <div className="space-y-4">
          {todayAppointments.map((appointment, index) => (
            <div
              key={appointment.id}
              className={`flex flex-col md:flex-row gap-4 p-5 rounded-lg border-2 transition-all ${
                appointment.status === 'cancelled'
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              {/* Time */}
              <div className="flex items-center gap-3 md:w-32 flex-shrink-0">
                <Clock className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="font-semibold text-slate-800">
                    {appointment.time}
                  </p>
                  <p className="text-xs text-slate-500">{appointment.duration}</p>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-slate-200"></div>

              {/* Appointment Details */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-slate-400" />
                      <h4 className="font-semibold text-slate-800">
                        {appointment.patient}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4" />
                      <span>{appointment.phone}</span>
                    </div>
                  </div>
                                  </div>
                <div className="flex items-center justify-between">
                  <div className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                    {appointment.type}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => console.log('Confirm appointment', appointment.id)}
                    >
                      Confirm
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => console.log('Cancel appointment', appointment.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Google Calendar Integration Suggestion */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800 mb-2">
              Google Calendar Integration
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Sync your appointments with Google Calendar to manage your schedule
              across all devices and receive reminders.
            </p>
            <Button variant="outline" size="sm">
              Connect Google Calendar
            </Button>
          </div>
        </div>
      </Card>

      {/* Add Appointment Modal */}
      {showAddAppointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-800">
                Add Daily Appointment
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddAppointmentModal(false)}
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
                  <User className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter patient name"
                    value={newAppointment.name}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        name: e.target.value
                      })
                    }
                    className="flex-1 outline-none text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>
                <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={newAppointment.phone}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        phone: e.target.value
                      })
                    }
                    className="flex-1 outline-none text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Time
                  </label>
                  <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <input
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          time: e.target.value
                        })
                      }
                      className="flex-1 outline-none text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Type
                  </label>
                  <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2">
                    <select
                      value={newAppointment.type}
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          type: e.target.value
                        })
                      }
                      className="flex-1 outline-none text-slate-800 bg-transparent"
                    >
                      <option value="Check-up">Check-up</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Consultation">Consultation</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Duration
                </label>
                <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <select
                    value={newAppointment.duration}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        duration: e.target.value
                      })
                    }
                    className="flex-1 outline-none text-slate-800 bg-transparent"
                  >
                    <option value="15 min">15 minutes</option>
                    <option value="20 min">20 minutes</option>
                    <option value="30 min">30 minutes</option>
                    <option value="45 min">45 minutes</option>
                    <option value="1 hour">1 hour</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAddAppointmentModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddAppointment}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!newAppointment.name || !newAppointment.phone || !newAppointment.time}
                >
                  Add Appointment
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
