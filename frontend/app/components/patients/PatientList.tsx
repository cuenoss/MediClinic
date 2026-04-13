import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserPlus, Filter, Phone, Mail, Trash2, Edit, X } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar } from '../ui/avatar';
import { api } from '../../services/api';

export function PatientList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: ''
  });

  // Fetch patients from API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await api.getPatients(currentPage, 10, { name: searchQuery }) as any;
        const result = Array.isArray(response) ? response : response.data || [];
        setPatients(result);
        setTotalPages(Math.ceil(result.length / 10));
      } catch (error) {
        console.error('Failed to fetch patients:', error);
        setPatients([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [currentPage, searchQuery]);

  const handleAddPatient = async () => {
    if (newPatient.name && newPatient.age && newPatient.gender && newPatient.phone && newPatient.email) {
      try {
        const patientData = {
          full_name: newPatient.name,
          gender: newPatient.gender,
          email: newPatient.email,
          phone: newPatient.phone,
          date_of_birth: new Date(new Date().getFullYear() - parseInt(newPatient.age), 0, 1).toISOString().split('T')[0],
          address: '',
          blood_type: '',
          allergies: '',
          chronic_conditions: '',
          relationship_status: '',
          emergency_contact_name: '',
          emergency_contact_phone: ''
        };

        await api.createPatient(patientData);
        
        // Refresh patient list
        const response = await api.getPatients(1, 10) as any;
        const result = Array.isArray(response) ? response : response.data || [];
        setPatients(result);
        setTotalPages(Math.ceil(result.length / 10));
        
        setShowAddPatientModal(false);
        setNewPatient({ name: '', age: '', gender: '', phone: '', email: '' });
      } catch (error) {
        console.error('Failed to create patient:', error);
      }
    }
  };

  const filteredPatients = patients.filter((patient) =>
    (patient.name || patient.fullName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800 mb-2">Patients</h1>
          <p className="text-slate-600">{patients.length} total patients</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAddPatientModal(true)}>
          <UserPlus className="w-5 h-5 mr-2" />
          Add New Patient
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search patients by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-5 h-5 mr-2" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Patient Cards - Mobile Optimized */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
          // Loading skeleton
          [1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-5">
              <div className="animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-slate-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-slate-200 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded mb-1 w-1/2"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          filteredPatients.map((patient) => (
          <Link key={patient.id} to={`/patients/${patient.id}`}>
            <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <Avatar className="w-14 h-14 flex-shrink-0">
                  <div className="w-full h-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-semibold">
                    {(patient.name || patient.fullName || 'P').split(' ').map((n: string) => n[0]).join('')}
                  </div>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">
                        {patient.name || patient.fullName || 'Unknown Patient'}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {patient.age || 'N/A'} years • {patient.gender || 'N/A'}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                        patient.status === 'critical'
                          ? 'bg-red-100 text-red-700'
                          : patient.status === 'follow-up'
                          ? 'bg-yellow-100 text-yellow-700'
                          : patient.status === 'chronic'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {patient.status || 'active'}
                    </span>
                  </div>
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4" />
                      <span>{patient.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{patient.email || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    Last visit: {patient.lastVisit || new Date(patient.created_at || Date.now()).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))
        )}
      </div>

      {!loading && filteredPatients.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-slate-600">No patients found</p>
        </Card>
      )}

      {/* Add Patient Modal */}
      {showAddPatientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-800">
                Add Patient
              </h3>
              <button
                onClick={() => setShowAddPatientModal(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
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

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAddPatientModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddPatient}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!newPatient.name || !newPatient.age || !newPatient.gender || !newPatient.phone || !newPatient.email}
                >
                  Add Patient
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="p-4">
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
