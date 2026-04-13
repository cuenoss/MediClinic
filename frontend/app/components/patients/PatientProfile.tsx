import { useEffect, useState, ChangeEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Edit,
  FileText,
  CreditCard,
  FolderOpen,
  AlertCircle,
  X,
  Upload,
  File,
  Trash2,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { api, fileApi, Consultation } from '../../services/api';

interface PatientData {
  id?: number;
  name?: string;
  full_name?: string;
  fullName?: string;
  age?: number;
  gender?: string;
  date_of_birth?: string;
  phone?: string;
  email?: string;
  address?: string;
  blood_type?: string;
  allergies?: string;
  chronic_conditions?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export function PatientProfile() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('information');
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showOrdonnanceModal, setShowOrdonnanceModal] = useState(false);
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [ordonnanceContent, setOrdonnanceContent] = useState('');
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [editProfileForm, setEditProfileForm] = useState<any>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [patientFiles, setPatientFiles] = useState<Array<{id: number; file_name: string; created_at: string; file_type: string; file_path?: string}>>([]);
  const [newConsultation, setNewConsultation] = useState({
    // Basic Personal Information
    name: '',
    age: '',
    sex: '',
    weight: '',
    height: '',
    contact: '',
    
    // Main Complaint
    complaint: '',
    
    // History of the problem
    whenStarted: '',
    howOften: '',
    gettingBetter: '',
    triggers: '',
    makesBetter: '',
    problemHistory: '',
    
    // Current Medications
    medications: '',
    
    // Symptoms Checklist
    fever: false,
    pain: false,
    nausea: false,
    cough: false,
    dizziness: false,
    fatigue: false,
    
    // Medical History
    allergies: '',
    chronicConditions: '',
    surgeries: '',
    
    // Family Medical History
    familyHistory: '',
    
    // Consultation Details
    diagnosis: '',
    date: '',
    doctor: ''
  });

  const [patient, setPatient] = useState<any>({
    id: Number(id) || 0,
    name: 'Loading patient...',
    age: 0,
    gender: '',
    dateOfBirth: '',
    phone: '',
    email: '',
    address: '',
    bloodType: 'N/A',
    ordonnance: '',
    allergies: [] as string[],
    chronicDiseases: [] as string[],
    emergencyContact: { name: '', relation: '', phone: '' },
  });
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const handleEditProfile = () => {
    setEditProfileForm({
      full_name: patient.name,
      email: patient.email,
      phone: patient.phone,
      address: patient.address,
      gender: patient.gender,
      date_of_birth: patient.dateOfBirth,
      blood_type: patient.bloodType,
      allergies: patient.allergies?.join(', ') || '',
      chronic_conditions: patient.chronicDiseases?.join(', ') || '',
      emergency_contact_name: patient.emergencyContact?.name || '',
      emergency_contact_phone: patient.emergencyContact?.phone || '',
    });
    setShowEditProfileModal(true);
  };

  const handleSaveEditProfile = async () => {
    if (!id || !editProfileForm) return;
    setSavingProfile(true);
    try {
      await api.updatePatient(Number(id), editProfileForm);
      // Refresh patient data
      const patientData = await api.getPatient<PatientData>(Number(id));
      setPatient({
        id: Number(id),
        name: patientData.name || patientData.full_name || patientData.fullName || 'Unknown Patient',
        age: patientData.age || 0,
        gender: patientData.gender || '',
        dateOfBirth: patientData.date_of_birth ? new Date(patientData.date_of_birth).toLocaleDateString() : '',
        phone: patientData.phone || '',
        email: patientData.email || '',
        address: patientData.address || '',
        bloodType: patientData.blood_type || 'N/A',
        ordonnance: '',
        allergies: patientData.allergies ? patientData.allergies.split(',').map((item: string) => item.trim()) : [],
        chronicDiseases: patientData.chronic_conditions ? patientData.chronic_conditions.split(',').map((item: string) => item.trim()) : [],
        emergencyContact: {
          name: patientData.emergency_contact_name || '',
          relation: '',
          phone: patientData.emergency_contact_phone || '',
        },
      });
      setShowEditProfileModal(false);
      setEditProfileForm(null);
      // Show success feedback
      alert('Patient profile updated successfully!');
    } catch (error) {
      console.error('Failed to update patient:', error);
      alert('Failed to update patient profile. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleViewConsultationDetails = (consultation: any) => {
    setSelectedConsultation(consultation);
    setShowViewDetailsModal(true);
  };
  useEffect(() => {
    const fetchPatientData = async () => {
      if (!id) return;
      setLoadingPatient(true);
      try {
        const patientData = await api.getPatient<PatientData>(Number(id));
        setPatient({
          id: Number(id),
          name: patientData.name || patientData.full_name || patientData.fullName || 'Unknown Patient',
          age: patientData.age || 0,
          gender: patientData.gender || '',
          dateOfBirth: patientData.date_of_birth ? new Date(patientData.date_of_birth).toLocaleDateString() : '',
          phone: patientData.phone || '',
          email: patientData.email || '',
          address: patientData.address || '',
          bloodType: patientData.blood_type || 'N/A',
          ordonnance: '',
          allergies: patientData.allergies 
            ? (Array.isArray(patientData.allergies) 
                ? patientData.allergies 
                : (patientData.allergies as string).split(',').map((item: string) => item.trim()))
            : [],
          chronicDiseases: patientData.chronic_conditions ? patientData.chronic_conditions.split(',').map((item: string) => item.trim()) : [],
          emergencyContact: {
            name: patientData.emergency_contact_name || '',
            relation: '',
            phone: patientData.emergency_contact_phone || '',
          },
        });

        const consultationData = await api.getPatientConsultations(Number(id));
        setConsultations(Array.isArray(consultationData) ? consultationData : consultationData.data || []);

        const fileData = await fileApi.getPatientFiles(Number(id));
        setPatientFiles(Array.isArray(fileData) ? fileData : fileData.data || []);
      } catch (error) {
        console.error('Failed to load patient data:', error);
      } finally {
        setLoadingPatient(false);
      }
    };

    fetchPatientData();
  }, [id]);

  const payments = [
    { id: 1, date: 'April 1, 2026', service: 'Ordonnance #001', amount: 'Prescription', status: 'active' },
    { id: 2, date: 'January 15, 2026', service: 'Ordonnance #002', amount: 'Medical Certificate', status: 'completed' },
    { id: 3, date: 'October 10, 2025', service: 'Ordonnance #003', amount: 'Lab Results', status: 'completed' },
  ];

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || !id) return;

    try {
      for (const file of Array.from(selectedFiles)) {
        await fileApi.uploadFile(file, Number(id));
      }
      const files = await fileApi.getPatientFiles(Number(id));
      setPatientFiles(Array.isArray(files) ? files : files.data || []);
    } catch (error) {
      console.error('File upload failed:', error);
    }
  };

  const handleViewFile = (file: {file_name: string; file_path?: string}) => {
    if (file.file_path) {
      window.open(file.file_path, '_blank');
      return;
    }
    alert(`File: ${file.file_name}`);
  };

  const handleDeleteFile = async (fileId: number) => {
    if (!id) return;
    try {
      await fileApi.deletePatientFile(Number(id), fileId);
      setPatientFiles(prev => prev.filter(file => file.id !== fileId));
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  const handleAddConsultation = async () => {
    if (!id || !newConsultation.complaint || !newConsultation.date || !newConsultation.doctor) {
      return;
    }

    try {
      const payload = {
        date: newConsultation.date ? new Date(newConsultation.date).toISOString() : undefined,
        main_complaint: newConsultation.complaint,
        diagnosis: newConsultation.diagnosis,
        notes: newConsultation.medications || newConsultation.problemHistory || undefined,
        problem_history: newConsultation.whenStarted || newConsultation.howOften || undefined,
        current_medications: newConsultation.medications || undefined,
        symptoms_checklist: [
          newConsultation.fever && 'Fever',
          newConsultation.pain && 'Pain',
          newConsultation.nausea && 'Nausea',
          newConsultation.cough && 'Cough',
          newConsultation.dizziness && 'Dizziness',
          newConsultation.fatigue && 'Fatigue',
        ].filter(Boolean),
        medical_history: newConsultation.allergies || newConsultation.chronicConditions || undefined,
        family_medical_history: newConsultation.familyHistory || undefined,
        doctor_id: Number(newConsultation.doctor) || undefined,
      };

      await api.createConsultation(Number(id), payload);
      const consultationData = await api.getPatientConsultations(Number(id));
      setConsultations(Array.isArray(consultationData) ? consultationData : consultationData.data || []);
      setShowConsultationModal(false);
      setNewConsultation({
        name: '',
        age: '',
        sex: '',
        weight: '',
        height: '',
        contact: '',
        complaint: '',
        whenStarted: '',
        howOften: '',
        gettingBetter: '',
        triggers: '',
        makesBetter: '',
        problemHistory: '',
        medications: '',
        fever: false,
        pain: false,
        nausea: false,
        cough: false,
        dizziness: false,
        fatigue: false,
        allergies: '',
        chronicConditions: '',
        surgeries: '',
        familyHistory: '',
        diagnosis: '',
        date: '',
        doctor: ''
      });
    } catch (error) {
      console.error('Failed to add consultation:', error);
    }
  };

  const handleAddOrdonnance = () => {
    if (ordonnanceContent) {
      console.log('Saving ordonnance:', ordonnanceContent);
      setShowOrdonnanceModal(false);
    }
  };

  const handlePrintOrdonnance = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Ordonnance - ${patient.name}</title>
            <style>
              body { 
                font-family: 'Times New Roman', serif; 
                margin: 40px; 
                background: white;
                line-height: 1.6;
              }
              .header { 
                border-bottom: 2px solid #333; 
                padding-bottom: 20px; 
                margin-bottom: 30px;
                text-align: center;
              }
              .header h1 { 
                font-size: 24px; 
                margin: 0 0 10px 0;
                text-transform: uppercase;
                letter-spacing: 2px;
              }
              .patient-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 30px;
                font-size: 14px;
              }
              .content { 
                margin-bottom: 40px;
                min-height: 400px;
                border: 1px solid #ddd;
                padding: 20px;
                background: #fafafa;
                white-space: pre-wrap;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                line-height: 1.8;
              }
              .footer { 
                margin-top: 50px;
                text-align: right;
                font-size: 12px;
                color: #666;
              }
              .signature {
                margin-top: 80px;
                border-top: 1px solid #333;
                padding-top: 20px;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>ORDONNANCE</h1>
            </div>
            <div class="patient-info">
              <div>
                <strong>Patient:</strong> ${patient.name}<br>
                <strong>Age:</strong> ${patient.age} years<br>
                <strong>Gender:</strong> ${patient.gender}
              </div>
              <div>
                <strong>Date:</strong> ${new Date().toLocaleDateString()}<br>
                <strong>Type:</strong> Prescription
              </div>
            </div>
            <div class="content">
${ordonnanceContent}
            </div>
            <div class="footer">
              <p>Doctor: Dr. Smith</p>
              <p>Generated: ${new Date().toLocaleString()}</p>
            </div>
            <div class="signature">
              <p>_________________________</p>
              <p>Doctor's Signature</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to="/patients">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Patients
        </Button>
      </Link>

      {/* Patient Header Card */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Avatar className="w-24 h-24 flex-shrink-0">
            <div className="w-full h-full bg-blue-100 text-blue-700 flex items-center justify-center text-3xl font-semibold">
              {patient.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-semibold text-slate-800 mb-1">
                  {patient.name}
                </h1>
                <p className="text-slate-600">
                  {patient.age} years • {patient.gender} • Blood Type: {patient.bloodType}
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleEditProfile}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">DOB: {patient.dateOfBirth}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{patient.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{patient.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{patient.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chronic Diseases Alert */}
        {patient.chronicDiseases.length > 0 && (
          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-orange-900 mb-1">Chronic Diseases</p>
                <div className="flex flex-wrap gap-2">
                  {patient.chronicDiseases.map((disease: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-orange-100 text-orange-800 text-sm rounded"
                    >
                      {disease}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-4 h-auto">
          <TabsTrigger value="information" className="py-3">
            Information
          </TabsTrigger>
          <TabsTrigger value="consultations" className="py-3">
            Consultations
          </TabsTrigger>
          <TabsTrigger value="ordonnances" className="py-3">
            Ordonnances
          </TabsTrigger>
          <TabsTrigger value="files" className="py-3">
            Files
          </TabsTrigger>
        </TabsList>

        {/* Information Tab */}
        <TabsContent value="information" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Medical Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-slate-600">Blood Type</label>
                  <p className="font-medium text-slate-800">{patient.bloodType}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Allergies</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {patient.allergies.map((allergy: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Chronic Diseases</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {patient.chronicDiseases.map((disease: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-orange-100 text-orange-800 text-sm rounded"
                      >
                        {disease}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Ordonnance</label>
                  <p className="font-medium text-slate-800">{patient.ordonnance}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Emergency Contact</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-slate-600">Name</label>
                  <p className="font-medium text-slate-800">
                    {patient.emergencyContact.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Relationship</label>
                  <p className="font-medium text-slate-800">
                    {patient.emergencyContact.relation}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Phone</label>
                  <p className="font-medium text-slate-800">
                    {patient.emergencyContact.phone}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Consultations Tab */}
        <TabsContent value="consultations" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-800">Consultation History</h3>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowConsultationModal(true)}>
              <FileText className="w-4 h-4 mr-2" />
              New Consultation
            </Button>
          </div>
          <div className="space-y-3">
            {consultations.length === 0 ? (
              <Card className="p-6 text-center text-slate-600">
                No consultations found for this patient.
              </Card>
            ) : (
              consultations.map((consultation) => (
                <Card key={consultation.id} className="p-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <p className="font-medium text-slate-800">
                          {consultation.main_complaint || consultation.complaint || 'Consultation'}
                        </p>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">
                        {consultation.diagnosis || 'No diagnosis provided'}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <span>{consultation.date ? new Date(consultation.date).toLocaleDateString() : 'Unknown date'}</span>
                        <span>•</span>
                        <span>{consultation.doctor || consultation.doctor_id || 'Doctor'}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleViewConsultationDetails(consultation)}>
                      View Details
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Files Tab */}
        <TabsContent value="files" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-800">Patient Files</h3>
            <div className="relative">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {patientFiles.length === 0 ? (
              <Card className="p-6 text-center text-slate-600">
                No files uploaded for this patient.
              </Card>
            ) : (
              patientFiles.map((file) => (
                <Card key={file.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">{file.file_name}</p>
                      <p className="text-sm text-slate-600">{file.created_at ? new Date(file.created_at).toLocaleDateString() : 'Unknown date'} • {(file.file_type || 'FILE').toUpperCase()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewFile(file)}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteFile(file.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Ordonnances Tab */}
        <TabsContent value="ordonnances" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-800">Ordonnance</h3>
          </div>
          
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ordonnance Content
                </label>
                <div className="border border-slate-300 rounded-lg p-4 min-h-[300px]">
                  <textarea
                    placeholder="Write ordonnance content here..."
                    value={ordonnanceContent}
                    onChange={(e) => setOrdonnanceContent(e.target.value)}
                    className="w-full h-48 outline-none text-slate-800 placeholder-slate-400 resize-none"
                    rows={8}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setOrdonnanceContent('')}
                  className="flex-1"
                >
                  Clear
                </Button>
                <Button
                  onClick={handleAddOrdonnance}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!ordonnanceContent}
                >
                  Save Ordonnance
                </Button>
                <Button
                  onClick={handlePrintOrdonnance}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!ordonnanceContent}
                >
                  Print
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Consultation Details Modal */}
      {showViewDetailsModal && selectedConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-auto shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Consultation Details</h3>
                  <p className="text-blue-100 text-sm mt-1">
                    {selectedConsultation.date ? new Date(selectedConsultation.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'Date not specified'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowViewDetailsModal(false)}
                  className="text-white hover:bg-blue-800 hover:bg-opacity-50"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Doctor Info Card */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">
                      {String(selectedConsultation.doctor || selectedConsultation.doctor_id || 'Dr.').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Attending Doctor</p>
                    <p className="font-semibold text-slate-800">
                      {String(selectedConsultation.doctor || selectedConsultation.doctor_id || 'Unknown Doctor')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Complaint */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Main Complaint
                </h4>
                <p className="text-red-700">
                  {selectedConsultation.main_complaint || 'No main complaint recorded'}
                </p>
              </div>

              {/* Diagnosis */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Diagnosis</h4>
                <p className="text-green-700">
                  {selectedConsultation.diagnosis || 'No diagnosis provided'}
                </p>
              </div>

              {/* Symptoms */}
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Symptoms</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedConsultation.symptoms_checklist ? (
                    Array.isArray(selectedConsultation.symptoms_checklist) 
                      ? selectedConsultation.symptoms_checklist.filter(Boolean).map((symptom: string, idx: number) => (
                          <span key={idx} className="px-3 py-1.5 bg-red-100 text-red-800 text-sm rounded-full border border-red-200">
                            {symptom}
                          </span>
                        ))
                      : typeof selectedConsultation.symptoms_checklist === 'string'
                        ? selectedConsultation.symptoms_checklist.split(',').map((symptom: string, idx: number) => (
                            <span key={idx} className="px-3 py-1.5 bg-red-100 text-red-800 text-sm rounded-full border border-red-200">
                              {symptom.trim()}
                            </span>
                          ))
                        : <span className="text-slate-400 italic">No symptoms recorded</span>
                  ) : (
                    <span className="text-slate-400 italic">No symptoms recorded</span>
                  )}
                </div>
              </div>

              {/* Medications and History Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Current Medications</h4>
                  <p className="text-blue-700">
                    {selectedConsultation.current_medications || 'None prescribed'}
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">Problem History</h4>
                  <p className="text-purple-700">
                    {selectedConsultation.problem_history || 'No history recorded'}
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-800 mb-2">Additional Notes</h4>
                <p className="text-amber-700 whitespace-pre-wrap">
                  {selectedConsultation.notes || 'No additional notes'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && editProfileForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-800">
                Edit Patient Profile
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditProfileModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={editProfileForm.full_name}
                  onChange={(e) => setEditProfileForm({...editProfileForm, full_name: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editProfileForm.email}
                    onChange={(e) => setEditProfileForm({...editProfileForm, email: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={editProfileForm.phone}
                    onChange={(e) => setEditProfileForm({...editProfileForm, phone: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                <input
                  type="text"
                  value={editProfileForm.address}
                  onChange={(e) => setEditProfileForm({...editProfileForm, address: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                  <select
                    value={editProfileForm.gender}
                    onChange={(e) => setEditProfileForm({...editProfileForm, gender: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Blood Type</label>
                  <input
                    type="text"
                    value={editProfileForm.blood_type}
                    onChange={(e) => setEditProfileForm({...editProfileForm, blood_type: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                    placeholder="O+, A+, etc."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Allergies</label>
                <input
                  type="text"
                  value={editProfileForm.allergies}
                  onChange={(e) => setEditProfileForm({...editProfileForm, allergies: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  placeholder="Comma-separated list"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Chronic Conditions</label>
                <input
                  type="text"
                  value={editProfileForm.chronic_conditions}
                  onChange={(e) => setEditProfileForm({...editProfileForm, chronic_conditions: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  placeholder="Comma-separated list"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={editProfileForm.emergency_contact_name}
                    onChange={(e) => setEditProfileForm({...editProfileForm, emergency_contact_name: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    value={editProfileForm.emergency_contact_phone}
                    onChange={(e) => setEditProfileForm({...editProfileForm, emergency_contact_phone: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowEditProfileModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEditProfile}
                  disabled={savingProfile}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Consultation Modal */}
      {showConsultationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-xl font-semibold text-slate-800">
                New Consultation
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConsultationModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="space-y-6">
                {/* 1. Basic Personal Information */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-800 mb-4">1. Basic Personal Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={newConsultation.name || patient.name}
                        onChange={(e) => setNewConsultation({...newConsultation, name: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        placeholder="Patient name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
                      <input
                        type="text"
                        value={newConsultation.age || patient.age.toString()}
                        onChange={(e) => setNewConsultation({...newConsultation, age: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        placeholder="Age"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Sex</label>
                      <select
                        value={newConsultation.sex || patient.gender}
                        onChange={(e) => setNewConsultation({...newConsultation, sex: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Weight</label>
                      <input
                        type="text"
                        value={newConsultation.weight}
                        onChange={(e) => setNewConsultation({...newConsultation, weight: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        placeholder="Weight (kg)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Height</label>
                      <input
                        type="text"
                        value={newConsultation.height}
                        onChange={(e) => setNewConsultation({...newConsultation, height: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        placeholder="Height (cm)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Contact</label>
                      <input
                        type="text"
                        value={newConsultation.contact || patient.phone}
                        onChange={(e) => setNewConsultation({...newConsultation, contact: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Main Complaint */}
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-red-800 mb-4">2. Main Complaint (Reason for the visit)</h4>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">What is bothering you right now?</label>
                    <textarea
                      value={newConsultation.complaint}
                      onChange={(e) => setNewConsultation({...newConsultation, complaint: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 h-20"
                      placeholder="I have a headache / I have stomach pain / I feel tired / I have a cough"
                    />
                  </div>
                </div>

                {/* 3. History of the problem */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-yellow-800 mb-4">3. History of the problem</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">When it started?</label>
                      <input
                        type="text"
                        value={newConsultation.whenStarted}
                        onChange={(e) => setNewConsultation({...newConsultation, whenStarted: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        placeholder="2 days ago / Last week"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">How often it happens?</label>
                      <input
                        type="text"
                        value={newConsultation.howOften}
                        onChange={(e) => setNewConsultation({...newConsultation, howOften: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        placeholder="Daily / Weekly / Sometimes"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Getting better or worse?</label>
                      <select
                        value={newConsultation.gettingBetter}
                        onChange={(e) => setNewConsultation({...newConsultation, gettingBetter: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                      >
                        <option value="">Select</option>
                        <option value="Better">Getting better</option>
                        <option value="Worse">Getting worse</option>
                        <option value="Same">Stays the same</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">What triggers it?</label>
                      <input
                        type="text"
                        value={newConsultation.triggers}
                        onChange={(e) => setNewConsultation({...newConsultation, triggers: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        placeholder="Stress / Food / Activity"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">What makes it better?</label>
                      <input
                        type="text"
                        value={newConsultation.makesBetter}
                        onChange={(e) => setNewConsultation({...newConsultation, makesBetter: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        placeholder="Rest / Medicine / Cold compress"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Current Medications */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-green-800 mb-4">4. Current Medications</h4>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Anything you are taking?</label>
                    <textarea
                      value={newConsultation.medications}
                      onChange={(e) => setNewConsultation({...newConsultation, medications: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 h-20"
                      placeholder="Prescribed medicine / Over-the-counter medicine / Vitamins or supplements"
                    />
                  </div>
                </div>

                {/* 5. Symptoms Checklist */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-purple-800 mb-4">5. Symptoms Checklist</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'fever' as const, label: 'Fever' },
                      { key: 'pain' as const, label: 'Pain' },
                      { key: 'nausea' as const, label: 'Nausea' },
                      { key: 'cough' as const, label: 'Cough' },
                      { key: 'dizziness' as const, label: 'Dizziness' },
                      { key: 'fatigue' as const, label: 'Fatigue' }
                    ].map(symptom => (
                      <label key={symptom.key} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newConsultation[symptom.key]}
                          onChange={(e) => setNewConsultation({...newConsultation, [symptom.key]: e.target.checked})}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{symptom.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 6. Medical History */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-orange-800 mb-4">6. Medical History</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Do you have allergies?</label>
                      <input
                        type="text"
                        value={newConsultation.allergies}
                        onChange={(e) => setNewConsultation({...newConsultation, allergies: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        placeholder="Penicillin, Peanuts, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Do you have chronic conditions?</label>
                      <input
                        type="text"
                        value={newConsultation.chronicConditions}
                        onChange={(e) => setNewConsultation({...newConsultation, chronicConditions: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        placeholder="Asthma, Diabetes, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Have you had recent surgeries?</label>
                      <input
                        type="text"
                        value={newConsultation.surgeries}
                        onChange={(e) => setNewConsultation({...newConsultation, surgeries: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        placeholder="Date and type of surgery"
                      />
                    </div>
                  </div>
                </div>

                {/* 7. Family Medical History */}
                <div className="bg-pink-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-pink-800 mb-4">7. Family Medical History (Optional)</h4>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Does anyone in your family have genetic conditions?</label>
                    <textarea
                      value={newConsultation.familyHistory}
                      onChange={(e) => setNewConsultation({...newConsultation, familyHistory: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 h-16"
                      placeholder="Diabetes, heart disease, etc. in family members"
                    />
                  </div>
                </div>

                {/* Consultation Details */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4">Consultation Details</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                      <input
                        type="date"
                        value={newConsultation.date}
                        onChange={(e) => setNewConsultation({...newConsultation, date: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Doctor</label>
                      <input
                        type="text"
                        value={newConsultation.doctor}
                        onChange={(e) => setNewConsultation({...newConsultation, doctor: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        placeholder="Doctor name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Diagnosis</label>
                      <input
                        type="text"
                        value={newConsultation.diagnosis}
                        onChange={(e) => setNewConsultation({...newConsultation, diagnosis: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                        placeholder="Diagnosis"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={() => setShowConsultationModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddConsultation}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={!newConsultation.complaint || !newConsultation.date || !newConsultation.doctor}
              >
                Add Consultation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
