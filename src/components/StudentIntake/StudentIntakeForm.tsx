// components/StudentIntake/StudentIntakeForm.tsx
import React, { useState } from 'react';
import { Upload, FileText, X, Euro } from 'lucide-react';

type Props = {
  onPaymentReady: (args: { clientSecret: string; submissionId: number }) => void;
};

const StudentIntakeForm: React.FC<Props> = ({ onPaymentReady }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    contactPhone: '',
    
    // New location field
    currentLocation: '',
    
    nationality: '',
    
    // Updated visa status fields
    visaStatus: '',
    visaExpiryDate: '',
    
    // Updated residence document field
    hasResidenceCard: '',
    
    // New student status fields
    studentStatus: '',
    
    // New accommodation/insurance fields
    hasAccommodation: '',
    hasHealthInsurance: '',
    hasEmpadronamiento: '',
    
    // Updated services needed
    servicesNeeded: [] as string[],
    
    // Updated professional info field
    additionalInfo: '',
    
    documents: [] as File[],
  });
  const [submitting, setSubmitting] = useState(false);
  const [agreeToPay, setAgreeToPay] = useState(false);

  const handleChange = (field: string, value: any) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const toggleService = (service: string) => {
    setForm((p) => ({
      ...p,
      servicesNeeded: p.servicesNeeded.includes(service)
        ? p.servicesNeeded.filter((s) => s !== service)
        : [...p.servicesNeeded, service],
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setForm((p) => ({ ...p, documents: [...p.documents, ...files] }));
  };

  const removeDocument = (index: number) => {
    setForm((p) => ({
      ...p,
      documents: p.documents.filter((_, i) => i !== index),
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !agreeToPay) return;
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();

      // Basic info
      fd.append('fullName', form.fullName);
      fd.append('email', form.email);
      fd.append('contactPhone', form.contactPhone);
      
      // New location field
      fd.append('currentLocation', form.currentLocation);
      
      fd.append('nationality', form.nationality);
      
      // Updated visa fields
      fd.append('visaStatus', form.visaStatus);
      fd.append('visaExpiryDate', form.visaExpiryDate);
      
      // Updated residence document
      fd.append('hasResidenceCard', form.hasResidenceCard);
      
      // New student status
      fd.append('studentStatus', form.studentStatus);
      
      // New accommodation fields
      fd.append('hasAccommodation', form.hasAccommodation);
      fd.append('hasHealthInsurance', form.hasHealthInsurance);
      fd.append('hasEmpadronamiento', form.hasEmpadronamiento);
      
      // Updated services
      fd.append('services_needed', JSON.stringify(form.servicesNeeded));
      
      // Updated additional info
      fd.append('additionalInfo', form.additionalInfo);
      
      // Documents
      form.documents.forEach((file) => fd.append('documents[]', file));

      const res = await fetch('http://127.0.0.1:8000/api/auth/student-intake/initiate', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to initiate intake');
      }

      const data = await res.json();
      const clientSecret = data.clientSecret;
      const submissionId = data.submission_id ?? data.submissionId;

      if (!clientSecret || !submissionId) {
        throw new Error('Missing clientSecret or submissionId from server.');
      }

      onPaymentReady({ clientSecret, submissionId });
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error starting payment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Student Intake — Quiz / Questionnaire</h2>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto"
        >
          {showForm ? 'Close Form' : 'Show Form'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="space-y-6">
          {/* Personal Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Full name */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Full name *</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="e.g. María García"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
              />
            </div>

            {/* Email */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
              />
            </div>

            {/* Phone */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact phone</label>
              <input
                type="tel"
                value={form.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                placeholder="+34 600 000 000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
              />
            </div>

            {/* 1) Where are you right now? */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">1) Where are you right now? *</label>
              <select
                required
                value={form.currentLocation}
                onChange={(e) => handleChange('currentLocation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
              >
                <option value="">Select your location</option>
                <option value="spain">🇪🇸 I'm already in Spain</option>
                <option value="europe_not_spain">🌍 I am in Europe (not Spain)</option>
                <option value="outside_europe">🌎 I am not in Europe</option>
                <option value="not_in_spain_yet">🌍 I'm not in Spain yet</option>
              </select>
            </div>

            {/* 2) What is your nationality? */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">2) What is your nationality? *</label>
              <select
                required
                value={form.nationality}
                onChange={(e) => handleChange('nationality', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
              >
                <option value="">Select nationality</option>
                {['Spanish', 'French', 'German', 'Italian', 'British', 'American', 'Other'].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* 3) What is your current visa status? */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">3) What is your current visa status? *</label>
              <select
                required
                value={form.visaStatus}
                onChange={(e) => handleChange('visaStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
              >
                <option value="">Select visa status</option>
                <option value="valid">✅ I have a valid visa</option>
                <option value="expiring_soon">⏳ My visa expires soon</option>
                <option value="none">❌ I don't have a visa</option>
              </select>
            </div>

            {/* Visa expiry date */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">If you have a valid visa, expiry date (optional)</label>
              <input
                type="date"
                value={form.visaExpiryDate}
                onChange={(e) => handleChange('visaExpiryDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
              />
            </div>

            {/* 4) Do you have a NIE/TIE? */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">4) Do you have a NIE/TIE (Spanish residence document)? *</label>
              <select
                required
                value={form.hasResidenceCard}
                onChange={(e) => handleChange('hasResidenceCard', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="in_process">In process</option>
              </select>
            </div>

            {/* 5) Are you currently a student? */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">5) Are you currently a student? *</label>
              <select
                required
                value={form.studentStatus}
                onChange={(e) => handleChange('studentStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
              >
                <option value="">Select student status</option>
                <option value="current_student">🎓 Yes, I'm a student</option>
                <option value="finished_bachelor">I have finished with my bachelor</option>
                <option value="finished_master">I have finished with my master</option>
                <option value="not_student">🧑‍💼 No, I'm not a student</option>
                <option value="graduate">🎓 I'm a Graduate student (I have finished my studies)</option>
              </select>
            </div>

            {/* Accommodation, Health Insurance, Empadronamiento */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Do you have accommodation?</label>
              <select
                value={form.hasAccommodation}
                onChange={(e) => handleChange('hasAccommodation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Do you have health insurance?</label>
              <select
                value={form.hasHealthInsurance}
                onChange={(e) => handleChange('hasHealthInsurance', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Do you have the empadronamiento?</label>
              <select
                value={form.hasEmpadronamiento}
                onChange={(e) => handleChange('hasEmpadronamiento', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional information</label>
            <textarea
              value={form.additionalInfo}
              onChange={(e) => handleChange('additionalInfo', e.target.value)}
              placeholder="Any extra details we should know (studies, timelines, needs)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base resize-vertical"
            />
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Which services do you need? (choose all that apply)</label>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                'I want to Stay in Spain',
                'I wanna come to Europe', 
                'Legal advice',
                'I want to stay in Europe',
                'Job / internship support',
                'Help booking NIE/TIE appointment',
                'I need a lawyer'
              ].map(svc => (
                <label key={svc} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={form.servicesNeeded.includes(svc)}
                    onChange={() => toggleService(svc)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700 whitespace-nowrap">{svc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Uploads */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Upload supporting documents (ID, visa, enrolment)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="document-upload-intake"
              />
              <label
                htmlFor="document-upload-intake"
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm sm:text-base"
              >
                <Upload className="h-4 w-4" />
                Choose Files
              </label>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                PDF/JPG/PNG, max 5MB each
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {form.documents.length > 0 ? `${form.documents.length} file(s) selected` : 'No files selected'}
              </p>
            </div>

            {form.documents.length > 0 && (
              <div className="mt-3 space-y-2">
                {form.documents.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate">{file.name}</span>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeDocument(idx)} 
                      className="text-red-500 hover:text-red-700 flex-shrink-0 ml-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Agreement Switch */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <label className="flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer gap-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-shrink-0">
                  <div className={`relative inline-block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                    agreeToPay ? 'bg-purple-600' : 'bg-gray-300'
                  }`}>
                    <span className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 ease-in-out ${
                      agreeToPay ? 'transform translate-x-6' : ''
                    }`} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900">
                      I agree to pay the €90 consultation fee for professional guidance and legal advice related to my case.
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    This fee covers the initial assessment and consultation session. You'll be redirected to secure payment after submitting the form.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={agreeToPay}
                onChange={(e) => setAgreeToPay(e.target.checked)}
                className="hidden"
              />
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !agreeToPay}
              className="w-full sm:w-auto px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 text-sm sm:text-base flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Starting payment…
                </>
              ) : (
                <>
                  <Euro className="h-4 w-4" />
                  Submit & Pay €90
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default StudentIntakeForm;