import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, Clock, User, X, Calendar } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { appointmentsService, Appointment } from '../../services/appointments';

type NewAppointmentForm = {
  patientName: string;
  day: string;
  time: string;
  type: string;
  duration: string;
  paymentAmount: string;
};

export function AppointmentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAppointment, setNewAppointment] = useState<NewAppointmentForm>({
    patientName: '',
    day: '',
    time: '',
    type: 'Check-up',
    duration: '30',
    paymentAmount: ''
  });

  const confirmedCount = appointments.filter((apt) => new Date(apt.time) < new Date()).length;
  const pendingCount = appointments.filter((apt) => new Date(apt.time) >= new Date()).length;
  const totalPatients = new Set(appointments.map((apt) => apt.patient_id)).size;

  // Fetch appointments for current month
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const appointmentsData = await appointmentsService.getAppointments() as Appointment[];
        
        // Filter appointments for current month
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const filteredAppointments = (appointmentsData || []).filter(apt => {
          if (!apt.time) return false;
          const aptDate = new Date(apt.time);
          return aptDate >= startDate && aptDate <= endDate;
        });
        
        setAppointments(filteredAppointments);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [currentDate]);

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

  // Calculate appointments for each day of the month
  const getAppointmentsForDay = (day: number) => {
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return appointments.filter(apt => {
      const aptDate = new Date(apt.time);
      return aptDate.getDate() === day && 
             aptDate.getMonth() === currentDate.getMonth() &&
             aptDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const getAppointmentCountForDay = (day: number) => {
    return getAppointmentsForDay(day).length;
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setShowNewAppointmentModal(true);
    setNewAppointment({
      ...newAppointment,
      day: day.toString()
    });
  };

  const handleAddToCalendar = async () => {
    console.log('Form state:', newAppointment);
    console.log('Button disabled:', !newAppointment.patientName || !newAppointment.day || !newAppointment.time);
    
    if (newAppointment.patientName && newAppointment.day && newAppointment.time) {
      try {
        // Create appointment via API
        const appointmentTime = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          parseInt(newAppointment.day),
          parseInt(newAppointment.time.split(':')[0]),
          parseInt(newAppointment.time.split(':')[1])
        ).toISOString();

        const appointmentData = {
          patient_name: newAppointment.patientName,
          phone_number: '000-000-0000', // TODO: Get actual phone from patient
          time: appointmentTime,
          type: newAppointment.type,
          duration: Number(newAppointment.duration),
          payment_amount: newAppointment.paymentAmount ? Number(newAppointment.paymentAmount) : 0,
        };

        await appointmentsService.createAppointment(appointmentData);
        
        // Refresh appointments
        const fetchAppointments = async () => {
          try {
            setLoading(true);
            const appointmentsData = await appointmentsService.getAppointments() as Appointment[];
            
            // Filter appointments for current month
            const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            const filteredAppointments = (appointmentsData || []).filter(apt => {
              if (!apt.time) return false;
              const aptDate = new Date(apt.time);
              return aptDate >= startDate && aptDate <= endDate;
            });
            
            setAppointments(filteredAppointments);
          } catch (error) {
            console.error('Failed to fetch appointments:', error);
          } finally {
            setLoading(false);
          }
        };

        await fetchAppointments();
        
        setShowNewAppointmentModal(false);
        setSelectedDay(null);
        setNewAppointment({
          patientName: '',
          day: '',
          time: '',
          type: 'Check-up',
          duration: '30',
          paymentAmount: ''
        });
      } catch (error) {
        console.error('Failed to create appointment:', error);
        
        // Show user-friendly error message
        const errorMessage = error as Error;
        alert(`Error: ${errorMessage.message || 'Failed to create appointment'}`);
      }
    }
  };

  const getAppointmentForDay = (day: number) => {
    return appointments.find((apt) => {
      const aptDate = new Date(apt.time);
      return aptDate.getDate() === day &&
             aptDate.getMonth() === currentDate.getMonth() &&
             aptDate.getFullYear() === currentDate.getFullYear();
    });
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
            const dayAppointments = getAppointmentsForDay(day);
            const appointmentCount = getAppointmentCountForDay(day);
            const isToday = new Date().getDate() === day && 
                           new Date().getMonth() === currentDate.getMonth() &&
                           new Date().getFullYear() === currentDate.getFullYear();

            return (
              <div
                key={day}
                className={`aspect-square p-2 rounded-lg border transition-all cursor-pointer ${
                  isToday
                    ? 'bg-blue-600 text-white border-blue-600'
                    : dayAppointments.length > 0
                    ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                    : selectedDay === day
                    ? 'bg-green-100 border-green-300 hover:bg-green-200'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
                onClick={() => handleDayClick(day)}
              >
                <div className="text-sm font-medium mb-1">{day}</div>
                {dayAppointments.length > 0 && (
                  <div
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      isToday
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {appointmentCount} {appointmentCount === 1 ? 'apt' : 'apts'}
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
              <p className="text-2xl font-semibold text-slate-800">{confirmedCount}</p>
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
              <p className="text-2xl font-semibold text-slate-800">{pendingCount}</p>
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
              <p className="text-2xl font-semibold text-slate-800">{totalPatients}</p>
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
                {selectedDay ? `Rendez-vous - ${monthNames[currentDate.getMonth()]} ${selectedDay}` : 'New Appointment'}
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
              {selectedDay && (
                <div className="bg-green-50 p-3 rounded-lg mb-4">
                  <p className="text-sm font-medium text-green-800">
                    Selected Date: {monthNames[currentDate.getMonth()]} {selectedDay}, {currentDate.getFullYear()}
                  </p>
                </div>
              )}

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
            
              <div className="grid grid-cols-2 gap-3">
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

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Appointment Type
                  </label>
                  <select
                    value={newAppointment.type}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        type: e.target.value
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  >
                    <option value="Check-up">Check-up</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Duration
                  </label>
                  <select
                    value={newAppointment.duration}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        duration: e.target.value
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  >
                    <option value="15">15 minutes</option>
                    <option value="20">20 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Payment Amount (Optional)
                  </label>
                  <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2">
                    <span className="text-slate-400">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={newAppointment.paymentAmount}
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          paymentAmount: e.target.value
                        })
                      }
                      className="flex-1 outline-none text-slate-800 placeholder-slate-400"
                    />
                  </div>
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
                  title={`Button disabled: ${!newAppointment.patientName ? 'No patient name' : ''} ${!newAppointment.day ? 'No day' : ''} ${!newAppointment.time ? 'No time' : ''}`}
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
