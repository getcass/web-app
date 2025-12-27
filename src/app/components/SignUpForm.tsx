import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Check } from 'lucide-react';

export function SignUpForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    inviteCode: ['', '', '', '', '', ''],
    gender: '',
    dateOfBirth: '',
    livesInLondon: false,
    deviceType: '',
    osVersion: '',
    consent: false
  });

  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', {
      ...formData,
      inviteCode: formData.inviteCode.join('')
    });
    // Handle form submission
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleCodeChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...formData.inviteCode];
    newCode[index] = value;
    setFormData(prev => ({ ...prev, inviteCode: newCode }));

    // Auto-focus next input
    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !formData.inviteCode[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const digits = pastedData.match(/\d/g) || [];
    
    const newCode = [...formData.inviteCode];
    digits.forEach((digit, i) => {
      if (i < 6) newCode[i] = digit;
    });
    
    setFormData(prev => ({ ...prev, inviteCode: newCode }));
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newCode.findIndex(d => !d);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    codeInputRefs.current[focusIndex]?.focus();
  };

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl border-purple-500/30 p-8 md:p-12">
      <h3 className="text-2xl md:text-3xl mb-2 text-white">Join the Alpha Program</h3>
      <p className="text-white/70 mb-8">Complete the form below to apply for early access.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Invite Code */}
        <div>
          <label className="block text-white mb-2">
            Invite Code <span className="text-red-400">*</span>
          </label>
          <div className="flex gap-2 justify-center md:justify-start" onPaste={handleCodePaste}>
            {formData.inviteCode.map((digit, index) => (
              <input
                key={index}
                ref={el => codeInputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                required
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleCodeKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              />
            ))}
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-white mb-2">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-white mb-2">
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
            placeholder="john@example.com"
          />
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="gender" className="block text-white mb-2">
            Gender <span className="text-red-400">*</span>
          </label>
          <select
            id="gender"
            name="gender"
            required
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-gray-900">Select gender</option>
            <option value="male" className="bg-gray-900">Male</option>
            <option value="female" className="bg-gray-900">Female</option>
            <option value="non-binary" className="bg-gray-900">Non-binary</option>
            <option value="prefer-not-to-say" className="bg-gray-900">Prefer not to say</option>
          </select>
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dateOfBirth" className="block text-white mb-2">
            Date of Birth <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            required
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all [color-scheme:dark]"
          />
        </div>

        {/* Device Type */}
        <div>
          <label htmlFor="deviceType" className="block text-white mb-2">
            Device Type <span className="text-red-400">*</span>
          </label>
          <select
            id="deviceType"
            name="deviceType"
            required
            value={formData.deviceType}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-gray-900">Select device type</option>
            <option value="iphone" className="bg-gray-900">iPhone</option>
            <option value="ipad" className="bg-gray-900">iPad</option>
          </select>
        </div>

        {/* OS Version */}
        <div>
          <label htmlFor="osVersion" className="block text-white mb-2">
            iOS Version <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="osVersion"
            name="osVersion"
            required
            value={formData.osVersion}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
            placeholder="e.g., 17.2"
          />
        </div>

        {/* Lives in London */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex-shrink-0 mt-1">
              <input
                type="checkbox"
                name="livesInLondon"
                required
                checked={formData.livesInLondon}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-6 h-6 bg-white/5 border-2 border-white/20 rounded flex items-center justify-center peer-checked:bg-purple-500 peer-checked:border-purple-500 transition-all group-hover:border-white/40">
                <Check className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex-1">
              <span className="text-white">
                I confirm that I currently live in London <span className="text-red-400">*</span>
              </span>
            </div>
          </label>
        </div>

        {/* Consent to follow-up */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex-shrink-0 mt-1">
              <input
                type="checkbox"
                name="consent"
                required
                checked={formData.consent}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-6 h-6 bg-white/5 border-2 border-white/20 rounded flex items-center justify-center peer-checked:bg-purple-500 peer-checked:border-purple-500 transition-all group-hover:border-white/40">
                <Check className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex-1">
              <span className="text-white">
                I consent to being contacted for follow-up surveys and feedback <span className="text-red-400">*</span>
              </span>
            </div>
          </label>
        </div>

        {/* Submit Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="pt-4"
        >
          <Button 
            type="submit"
            size="lg"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-6 text-lg shadow-lg shadow-purple-500/25"
          >
            Submit Application
          </Button>
        </motion.div>

        <p className="text-white/50 text-sm text-center">
          By submitting this form, you agree to participate in the Alpha testing program and provide honest feedback.
        </p>
      </form>
    </Card>
  );
}