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
    <Card className="p-8 md:p-12">
      <h3 className="text-2xl md:text-3xl mb-2 text-foreground font-semibold tracking-tight">Join the Alpha Programme</h3>
      <p className="text-foreground mb-5">Complete the form below to apply for early access.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Invite Code */}
        <div>
          <label className="block text-foreground mb-2">
            Invite Code <span className="text-destructive">*</span>
          </label>
          <div
            className="grid w-full grid-cols-6 gap-2 md:flex md:justify-start"
            onPaste={handleCodePaste}
          >
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
                className="h-12 w-full min-w-0 text-center text-lg bg-input-background border border-border/60 rounded-[var(--radius)] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all md:w-12 md:flex-none"
              />
            ))}
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-foreground mb-2">
            Full Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-[var(--radius)] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all"
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-foreground mb-2">
            Email Address <span className="text-destructive">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-[var(--radius)] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all"
            placeholder="john@example.com"
          />
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="gender" className="block text-foreground mb-2">
            Gender <span className="text-destructive">*</span>
          </label>
          <select
            id="gender"
            name="gender"
            required
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-[var(--radius)] text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all appearance-none cursor-pointer"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dateOfBirth" className="block text-foreground mb-2">
            Date of Birth <span className="text-destructive">*</span>
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            required
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="block w-full max-w-full min-w-0 px-4 py-3 bg-input-background border border-border/60 rounded-[var(--radius)] text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all"
          />
        </div>

        {/* Device Type */}
        <div>
          <label htmlFor="deviceType" className="block text-foreground mb-2">
            Device Type <span className="text-destructive">*</span>
          </label>
          <select
            id="deviceType"
            name="deviceType"
            required
            value={formData.deviceType}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-[var(--radius)] text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all appearance-none cursor-pointer"
          >
            <option value="">Select device type</option>
            <option value="iphone">iPhone</option>
            <option value="ipad">iPad</option>
          </select>
        </div>

        {/* OS Version */}
        <div>
          <label htmlFor="osVersion" className="block text-foreground mb-2">
            iOS Version <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            id="osVersion"
            name="osVersion"
            required
            value={formData.osVersion}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-input-background border border-border/60 rounded-[var(--radius)] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all"
            placeholder="e.g., 17.2"
          />
        </div>

        {/* Lives in London */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                name="livesInLondon"
                required
                checked={formData.livesInLondon}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-6 h-6 bg-input-background border-2 border-border/60 rounded-[calc(var(--radius)-8px)] flex items-center justify-center peer-checked:bg-primary peer-checked:border-primary transition-all group-hover:border-border group-active:scale-95 peer-focus-visible:ring-4 peer-focus-visible:ring-ring/20">
                <Check className="w-4 h-4 text-primary-foreground opacity-0 scale-75 peer-checked:opacity-100 peer-checked:scale-100 transition-[opacity,transform]" />
              </div>
            </div>
            <div className="flex-1">
              <span className="mt-3 block text-foreground">
                I confirm that I currently live in London <span className="text-destructive">*</span>
              </span>
            </div>
          </label>
        </div>

        {/* Consent to follow-up */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                name="consent"
                required
                checked={formData.consent}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-6 h-6 bg-input-background border-2 border-border/60 rounded-[calc(var(--radius)-8px)] flex items-center justify-center peer-checked:bg-primary peer-checked:border-primary transition-all group-hover:border-border group-active:scale-95 peer-focus-visible:ring-4 peer-focus-visible:ring-ring/20">
                <Check className="w-4 h-4 text-primary-foreground opacity-0 scale-75 peer-checked:opacity-100 peer-checked:scale-100 transition-[opacity,transform]" />
              </div>
            </div>
            <div className="flex-1">
              <span className="block text-foreground">
                I consent to being contacted for follow-up surveys and feedback <span className="text-destructive">*</span>
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
            className="w-full"
          >
            Submit Application
          </Button>
        </motion.div>

        <p className="text-foreground text-sm text-center">
          By submitting this form, you agree to participate in the Alpha testing Programme and provide honest feedback.
        </p>
      </form>
    </Card>
  );
}
