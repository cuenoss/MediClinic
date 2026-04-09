import { useState } from 'react';
import { Link } from 'react-router';
import { Search, UserPlus, Filter, Phone, Mail } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar } from '../ui/avatar';

export function PatientList() {
  const [searchQuery, setSearchQuery] = useState('');

  const patients = [
    {
      id: 1,
      name: 'Sarah Johnson',
      age: 32,
      gender: 'Female',
      phone: '+1 (555) 123-4567',
      email: 'sarah.j@email.com',
      lastVisit: 'April 1, 2026',
      status: 'active',
    },
    {
      id: 2,
      name: 'Michael Chen',
      age: 45,
      gender: 'Male',
      phone: '+1 (555) 234-5678',
      email: 'michael.c@email.com',
      lastVisit: 'March 28, 2026',
      status: 'active',
    },
    {
      id: 3,
      name: 'Emma Davis',
      age: 28,
      gender: 'Female',
      phone: '+1 (555) 345-6789',
      email: 'emma.d@email.com',
      lastVisit: 'March 30, 2026',
      status: 'follow-up',
    },
    {
      id: 4,
      name: 'James Wilson',
      age: 56,
      gender: 'Male',
      phone: '+1 (555) 456-7890',
      email: 'james.w@email.com',
      lastVisit: 'April 3, 2026',
      status: 'critical',
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      age: 38,
      gender: 'Female',
      phone: '+1 (555) 567-8901',
      email: 'lisa.a@email.com',
      lastVisit: 'March 25, 2026',
      status: 'active',
    },
    {
      id: 6,
      name: 'Robert Brown',
      age: 62,
      gender: 'Male',
      phone: '+1 (555) 678-9012',
      email: 'robert.b@email.com',
      lastVisit: 'March 29, 2026',
      status: 'chronic',
    },
  ];

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800 mb-2">Patients</h1>
          <p className="text-slate-600">{patients.length} total patients</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
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
        {filteredPatients.map((patient) => (
          <Link key={patient.id} to={`/patients/${patient.id}`}>
            <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <Avatar className="w-14 h-14 flex-shrink-0">
                  <div className="w-full h-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-semibold">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">
                        {patient.name}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {patient.age} years • {patient.gender}
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
                      {patient.status}
                    </span>
                  </div>
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4" />
                      <span>{patient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{patient.email}</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    Last visit: {patient.lastVisit}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-slate-600">No patients found</p>
        </Card>
      )}
    </div>
  );
}
