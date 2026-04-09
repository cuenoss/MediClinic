import { useState } from 'react';
import { useParams, Link } from 'react-router';
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

export function PatientProfile() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('information');
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showOrdonnanceModal, setShowOrdonnanceModal] = useState(false);
  const [ordonnanceContent, setOrdonnanceContent] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<Array<{id: number; name: string; date: string; type: string}>>([]);
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

  // Mock patient data
  const patient = {
    id,
    name: 'Sarah Johnson',
    age: 32,
    gender: 'Female',
    dateOfBirth: 'January 15, 1994',
    phone: '+1 (555) 123-4567',
    email: 'sarah.j@email.com',
    address: '123 Main Street, New York, NY 10001',
    bloodType: 'A+',
    ordonnance: 'Prescription medication for hypertension',
    allergies: ['Penicillin', 'Peanuts'],
    chronicDiseases: ['Type 2 Diabetes', 'Hypertension'],
    emergencyContact: {
      name: 'John Johnson',
      relation: 'Spouse',
      phone: '+1 (555) 123-4568',
    },
  };

  const consultations = [
    {
      id: 1,
      date: 'April 1, 2026',
      complaint: 'Regular check-up',
      diagnosis: 'Healthy, blood sugar stable',
      doctor: 'Dr. Smith',
    },
    {
      id: 2,
      date: 'January 15, 2026',
      complaint: 'Headache and fatigue',
      diagnosis: 'Migraine, prescribed medication',
      doctor: 'Dr. Smith',
    },
    {
      id: 3,
      date: 'October 10, 2025',
      complaint: 'Annual physical examination',
      diagnosis: 'Overall healthy condition',
      doctor: 'Dr. Smith',
    },
  ];

  const payments = [
    { id: 1, date: 'April 1, 2026', service: 'Ordonnance #001', amount: 'Prescription', status: 'active' },
    { id: 2, date: 'January 15, 2026', service: 'Ordonnance #002', amount: 'Medical Certificate', status: 'completed' },
    { id: 3, date: 'October 10, 2025', service: 'Ordonnance #003', amount: 'Lab Results', status: 'completed' },
  ];

  const files = [
    { id: 1, name: 'Lab Results - Blood Test.pdf', date: 'April 1, 2026', type: 'pdf' },
    { id: 2, name: 'X-Ray Report.pdf', date: 'January 15, 2026', type: 'pdf' },
    { id: 3, name: 'MRI Scan.jpg', date: 'October 10, 2025', type: 'image' },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles).map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        date: new Date().toLocaleDateString(),
        type: file.type.split('/')[1] || 'unknown'
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
      console.log('Uploaded files:', newFiles);
    }
  };

  const handleViewFile = (file: {id: number; name: string; date: string; type: string}) => {
    console.log('Viewing file:', file);
    // In a real app, this would open the file viewer
    alert(`Viewing file: ${file.name}`);
  };

  const handleDeleteFile = (fileId: number) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    console.log('Deleted file:', fileId);
  };

  const handleAddConsultation = () => {
    if (newConsultation.complaint && newConsultation.date && newConsultation.doctor) {
      console.log('Adding consultation:', newConsultation);
      setShowConsultationModal(false);
      setNewConsultation({
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
              {patient.name.split(' ').map(n => n[0]).join('')}
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
              <Button className="bg-blue-600 hover:bg-blue-700">
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
                  {patient.chronicDiseases.map((disease, index) => (
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
                    {patient.allergies.map((allergy, index) => (
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
                    {patient.chronicDiseases.map((disease, index) => (
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
            {consultations.map((consultation) => (
              <Card key={consultation.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <p className="font-medium text-slate-800">
                        {consultation.complaint}
                      </p>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">
                      {consultation.diagnosis}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <span>{consultation.date}</span>
                      <span>•</span>
                      <span>{consultation.doctor}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
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
            {[...files, ...uploadedFiles].map((file) => (
              <Card key={file.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate">{file.name}</p>
                    <p className="text-sm text-slate-600">{file.date} • {file.type?.toUpperCase() || 'FILE'}</p>
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
            ))}
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
