import { useState } from 'react';
import { Link } from 'react-router';
import { ChevronLeft, ChevronRight, Plus, Clock, User, X, Calendar } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

export function AppointmentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 3)); // April 3, 2026
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    day: '',
    time: ''
  });

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const appointments = [
    { day: 3, count: 5, status: 'confirmed' },
    { day: 4, count: 3, status: 'pending' },
    { day: 5, count: 4, status: 'confirmed' },
    { day: 8, count: 6, status: 'confirmed' },
    { day: 10, count: 2, status: 'pending' },
    { day: 12, count: 4, status: 'confirmed' },
  ];

  const handleAddToCalendar = () => {
    if (newAppointment.patientName && newAppointment.day && newAppointment.time) {
      // Add appointment to calendar logic here
      console.log('Adding appointment:', newAppointment);
      setShowNewAppointmentModal(false);
      setNewAppointment({ patientName: '', day: '', time: '' });
    }
  };

  const getAppointmentForDay = (day: number) => {
    return appointments.find((apt) => apt.day === day);
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800 mb-2">
            Appointments
          </h1>
          <p className="text-slate-600">Manage your appointment schedule</p>
        </div>
        <div className="flex gap-3">
          <Link to="/appointments/schedule">
            <Button variant="outline">
              <Clock className="w-5 h-5 mr-2" />
              Daily Schedule
            </Button>
          </Link>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowNewAppointmentModal(true)}>
            <Plus className="w-5 h-5 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Calendar Card */}
      <Card className="p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-slate-600 py-2"
            >
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {/* Calendar Days */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const appointment = getAppointmentForDay(day);
            const isToday = day === 3; // April 3, 2026

            return (
              <div
                key={day}
                className={`aspect-square p-2 rounded-lg border transition-all cursor-pointer ${
                  isToday
                    ? 'bg-blue-600 text-white border-blue-600'
                    : appointment
                    ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="text-sm font-medium mb-1">{day}</div>
                {appointment && (
                  <div
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      isToday
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {appointment.count} apt
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span className="text-sm text-slate-600">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
            <span className="text-sm text-slate-600">Has Appointments</span>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Confirmed</p>
              <p className="text-2xl font-semibold text-slate-800">24</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Pending</p>
              <p className="text-2xl font-semibold text-slate-800">5</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Patients</p>
              <p className="text-2xl font-semibold text-slate-800">29</p>
            </div>
          </div>
        </Card>
      </div>

      {/* New Appointment Modal */}
      {showNewAppointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-800">
                New Appointment
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewAppointmentModal(false)}
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
                    value={newAppointment.patientName}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        patientName: e.target.value
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
                    value={newAppointment.day}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
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

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowNewAppointmentModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddToCalendar}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!newAppointment.patientName || !newAppointment.day || !newAppointment.time}
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
