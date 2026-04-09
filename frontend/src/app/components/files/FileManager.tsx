import { useState } from 'react';
import {
  Upload,
  Search,
  FileText,
  Image,
  Download,
  Eye,
  Trash2,
  Filter,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function FileManager() {
  const [searchQuery, setSearchQuery] = useState('');

  const files = [
    {
      id: 1,
      name: 'Lab Results - Blood Test.pdf',
      patient: 'Sarah Johnson',
      type: 'pdf',
      size: '245 KB',
      date: 'April 3, 2026',
      category: 'Lab Results',
    },
    {
      id: 2,
      name: 'X-Ray Report.pdf',
      patient: 'Michael Chen',
      type: 'pdf',
      size: '1.2 MB',
      date: 'April 2, 2026',
      category: 'Radiology',
    },
    {
      id: 3,
      name: 'Patient Photo.jpg',
      patient: 'Emma Davis',
      type: 'image',
      size: '842 KB',
      date: 'April 1, 2026',
      category: 'Photos',
    },
    {
      id: 4,
      name: 'MRI Scan Report.pdf',
      patient: 'James Wilson',
      type: 'pdf',
      size: '3.5 MB',
      date: 'March 31, 2026',
      category: 'Radiology',
    },
    {
      id: 5,
      name: 'Prescription Document.pdf',
      patient: 'Lisa Anderson',
      type: 'pdf',
      size: '128 KB',
      date: 'March 30, 2026',
      category: 'Prescriptions',
    },
    {
      id: 6,
      name: 'Consultation Notes.pdf',
      patient: 'Robert Brown',
      type: 'pdf',
      size: '95 KB',
      date: 'March 29, 2026',
      category: 'Consultations',
    },
  ];

  const filteredFiles = files.filter(
    (file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.patient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpload = () => {
    // Simulate file upload
    alert('File upload functionality would open file picker here');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800 mb-2">
            Files & Documents
          </h1>
          <p className="text-slate-600">{files.length} files stored</p>
        </div>
        <Button onClick={handleUpload} className="bg-blue-600 hover:bg-blue-700">
          <Upload className="w-5 h-5 mr-2" />
          Upload File
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-slate-600 mb-1">Total Files</p>
          <p className="text-2xl font-semibold text-slate-800">{files.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-600 mb-1">PDFs</p>
          <p className="text-2xl font-semibold text-slate-800">
            {files.filter((f) => f.type === 'pdf').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-600 mb-1">Images</p>
          <p className="text-2xl font-semibold text-slate-800">
            {files.filter((f) => f.type === 'image').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-600 mb-1">Storage Used</p>
          <p className="text-2xl font-semibold text-slate-800">6.2 MB</p>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search files by name or patient..."
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

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <Card key={file.id} className="p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  file.type === 'pdf'
                    ? 'bg-red-100'
                    : 'bg-blue-100'
                }`}
              >
                {file.type === 'pdf' ? (
                  <FileText className="w-6 h-6 text-red-600" />
                ) : (
                  <Image className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-800 mb-1 truncate">
                  {file.name}
                </h3>
                <p className="text-sm text-slate-600">{file.patient}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Category:</span>
                <span className="font-medium text-slate-800">{file.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Size:</span>
                <span className="font-medium text-slate-800">{file.size}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Date:</span>
                <span className="font-medium text-slate-800">{file.date}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-slate-600">No files found</p>
        </Card>
      )}
    </div>
  );
}
