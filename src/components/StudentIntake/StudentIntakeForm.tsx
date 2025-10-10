// components/StudentIntake/StudentIntakeForm.tsx
import React, { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';

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
    if (submitting) return;
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
      // (Do not reset yet—only after payment success in parent)
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error starting payment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Student Intake — Quiz / Questionnaire</h2>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 "
        >
          {showForm ? 'Close Form' : 'Show Form'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full name *</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="e.g. María García"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact phone</label>
              <input
                type="tel"
                value={form.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                placeholder="+34 600 000 000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nationality *</label>
              <select
                required
                value={form.nationality}
                onChange={(e) => handleChange('nationality', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select nationality</option>
                {['Spanish','French','German','Italian','British','American','Other'].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Target country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country where you want services</label>
              <select
                value={form.targetCountry}
                onChange={(e) => handleChange('targetCountry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a country</option>
                {['Spain','France','Germany','Italy','UK'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Current situation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current situation</label>
              <select
                value={form.currentSituation}
                onChange={(e) => handleChange('currentSituation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose</option>
                {['Prospective student','Current student','Graduate','Working professional'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Visa expiry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Visa / Permit expiry date (if applicable)</label>
              <input
                type="date"
                value={form.visaExpiryDate}
                onChange={(e) => handleChange('visaExpiryDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Residence card */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Do you have TIE/NIE/Residence card?</label>
              <select
                value={form.hasResidenceCard}
                onChange={(e) => handleChange('hasResidenceCard', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {['','Yes','No','In process'].map(v => (
                  <option key={v} value={v}>{v || 'Select'}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Which services do you need? (choose all that apply)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['Legal advice','Accommodation search','Documentation support','Student visa assistance','Job / internship support','Other'].map(svc => (
                <label key={svc} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={form.servicesNeeded.includes(svc)}
                    onChange={() => toggleService(svc)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{svc}</span>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Future plans */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Future plans — what would you like to do next?</label>
            <select
              value={form.futurePlans}
              onChange={(e) => handleChange('futurePlans', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              Upload supporting documents (ID, visa, enrolment) — PDF/JPG/PNG, max 5MB each
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 "
              >
                <Upload className="h-4 w-4" />
                Choose Files
              </label>
              <p className="text-sm text-gray-500 mt-2">
                {form.documents.length > 0 ? `${form.documents.length} file(s) selected` : 'No files selected'}
              </p>
            </div>

            {form.documents.length > 0 && (
              <div className="mt-3 space-y-2">
                {form.documents.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <button type="button" onClick={() => removeDocument(idx)} className="text-red-500 hover:text-red-700">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-60"
            >
              {submitting ? 'Starting payment…' : 'Submit & Pay'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default StudentIntakeForm;
