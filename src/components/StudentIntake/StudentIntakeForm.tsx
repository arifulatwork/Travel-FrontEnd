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
    nationality: '',
    targetCountry: '',
    currentSituation: '',
    visaExpiryDate: '',
    hasResidenceCard: '',
    servicesNeeded: [] as string[],
    professionalInfo: '',
    futurePlans: '',
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

      fd.append('fullName', form.fullName);
      fd.append('email', form.email);
      fd.append('contactPhone', form.contactPhone);
      fd.append('nationality', form.nationality);
      fd.append('targetCountry', form.targetCountry);
      fd.append('currentSituation', form.currentSituation);
      fd.append('visaExpiryDate', form.visaExpiryDate);
      fd.append('hasResidenceCard', form.hasResidenceCard);
      fd.append('services_needed', JSON.stringify(form.servicesNeeded));
      fd.append('professionalInfo', form.professionalInfo);
      fd.append('futurePlans', form.futurePlans);
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

            {/* Nationality */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nationality *</label>
              <select
                required
                value={form.nationality}
                onChange={(e) => handleChange('nationality', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
              >
                <option value="">Select nationality</option>
                {['Spanish','French','German','Italian','British','American','Other'].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Target country */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Target country</label>
              <select
                value={form.targetCountry}
                onChange={(e) => handleChange('targetCountry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
              >
                <option value="">Select a country</option>
                {['Spain','France','Germany','Italy','UK'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Current situation */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Current situation</label>
              <select
                value={form.currentSituation}
                onChange={(e) => handleChange('currentSituation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
              >
                <option value="">Choose</option>
                {['Prospective student','Current student','Graduate','Working professional'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Visa expiry */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Visa / Permit expiry date</label>
              <input
                type="date"
                value={form.visaExpiryDate}
                onChange={(e) => handleChange('visaExpiryDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
              />
            </div>

            {/* Residence card */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">TIE/NIE/Residence card?</label>
              <select
                value={form.hasResidenceCard}
                onChange={(e) => handleChange('hasResidenceCard', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
              >
                {['','Yes','No','In process'].map(v => (
                  <option key={v} value={v}>{v || 'Select'}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Which services do you need?</label>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3">
              {['Legal advice','Accommodation search','Documentation support','Student visa assistance','Job / internship support','Other'].map(svc => (
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

          {/* Professional info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Professional / academic information</label>
            <textarea
              value={form.professionalInfo}
              onChange={(e) => handleChange('professionalInfo', e.target.value)}
              placeholder="Briefly list degree, field of study, institution, and current employment or internship"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base resize-vertical"
            />
          </div>

          {/* Future plans */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Future plans</label>
            <select
              value={form.futurePlans}
              onChange={(e) => handleChange('futurePlans', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
            >
              <option value="">Select an option</option>
              {['Continue studies','Find job','Start internship','Start business','Return home country'].map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
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
                      I agree to pay €100 for the student intake consultation
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
                  Submit & Pay €100
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