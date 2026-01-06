
import React, { useState, useEffect } from 'react';
import { createAppointment } from '../services/appointmentService';

interface FormErrors {
  name?: string;
  phone?: string;
  date?: string;
}

const Appointment: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: ''
  });

  // Get today's date in YYYY-MM-DD format for the 'min' attribute
  const today = new Date().toISOString().split('T')[0];

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Phone validation (basic international format)
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = 'Please select a preferred date';
    } else {
      const selectedDate = new Date(formData.date);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      if (selectedDate < currentDate) {
        newErrors.date = 'Appointment date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        // Post appointment to database
        await createAppointment({
          name: formData.name,
          phone: formData.phone,
          date: formData.date
        });
        
        console.log('✅ Appointment successfully posted to database');
        setIsSubmitted(true);
        
        // Reset form after submission
        setFormData({
          name: '',
          phone: '',
          date: ''
        });
        setErrors({});
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => setIsSubmitted(false), 3000);
      } catch (error) {
        console.error('❌ Failed to create appointment:', error);
        // You could show an error message to the user here
        alert('Failed to create appointment. Please try again.');
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing again
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
              Book Your Professional <span className="text-blue-600">Vision Consultation.</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              Experience the standard in ocular healthcare. Our clinical consultations involve a multi-step diagnostic process ensuring absolute precision for your visual needs.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="flex gap-4 p-6 bg-white rounded-3xl border border-slate-50 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-widest mb-1">Expert Timings</h4>
                <p className="text-slate-500 text-sm font-bold">Mon - Sat: 9:00 - 17:00</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-6 bg-white rounded-3xl border border-slate-50 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-widest mb-1">Location</h4>
                <p className="text-slate-500 text-sm font-bold">Rizal, Philippines</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-[3rem] shadow-2xl border border-blue-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-12 text-center">
            <h1 className="text-5xl font-black text-white mb-4">Book Your Eye Exam</h1>
            <p className="text-xl text-blue-100">Schedule your appointment with our expert optometrists</p>
          </div>

          {/* Success Message */}
          {isSubmitted ? (
            <div className="mx-8 mt-8 p-6 bg-green-50 border-2 border-green-200 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-800">Appointment Requested!</h3>
                  <p className="text-green-600">We'll send you a confirmation shortly.</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-12 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label htmlFor="appointment-name" className="text-sm font-bold text-slate-700 uppercase tracking-wide">Full Name *</label>
                  <input 
                    type="text" 
                    id="appointment-name"
                    name="name"
                    autoComplete="name"
                    placeholder="e.g., John Doe" 
                    className={`w-full px-5 py-4 bg-slate-50 border ${errors.name ? 'border-red-500' : 'border-slate-200'} rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-300`}
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                  {errors.name && <p className="text-red-500 text-[10px] font-black uppercase mt-1">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="appointment-phone" className="text-sm font-bold text-slate-700 uppercase tracking-wide">Phone Number *</label>
                  <input 
                    type="tel" 
                    id="appointment-phone"
                    name="phone"
                    autoComplete="tel"
                    placeholder="e.g., +639123456789" 
                    className={`w-full px-5 py-4 bg-slate-50 border ${errors.phone ? 'border-red-500' : 'border-slate-200'} rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-300`}
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                  {errors.phone && <p className="text-red-500 text-[10px] font-black uppercase mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="appointment-date" className="text-sm font-bold text-slate-700 uppercase tracking-wide">Preferred Consultation Date *</label>
                <input 
                  type="date" 
                  id="appointment-date"
                  name="date"
                  autoComplete="appointment-date"
                  min={today}
                  className={`w-full px-5 py-4 bg-slate-50 border ${errors.date ? 'border-red-500' : 'border-slate-200'} rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all`}
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />
                {errors.date && <p className="text-red-500 text-[10px] font-black uppercase mt-1">{errors.date}</p>}
              </div>

              <div className="flex gap-4 pt-8">
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all"
                >
                  Secure Consultation Slot
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData({ name: '', phone: '', date: '' })}
                  className="flex-1 bg-slate-200 text-slate-700 py-4 rounded-2xl font-bold hover:bg-slate-300 transition-all"
                >
                  Clear Form
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointment;
