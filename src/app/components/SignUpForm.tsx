import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

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
  const [submitState, setSubmitState] = useState<
    { status: 'idle' } | { status: 'submitting' } | { status: 'success' } | { status: 'error'; message: string }
  >({ status: 'idle' });

  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState({ status: 'submitting' });

    const payload = {
      ...formData,
      inviteCode: formData.inviteCode.join(''),
      submittedAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'signups'), payload);

      setSubmitState({ status: 'success' });
    } catch (err) {
      setSubmitState({
        status: 'error',
        message:
          err instanceof Error
            ? err.message
            : 'Submission failed. Please try again.'
      });
    }
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
    <Card className="p-6 md:p-10">
      <h3 className="text-2xl md:text-3xl mb-2 text-foreground font-semibold tracking-tight">Join the Alpha Programme</h3>
      <p className="text-foreground mb-5">Complete the form below to apply for early access.</p>
      
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        {/* Invite Code */}
        <div className="md:col-span-2">
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
                className="h-12 w-full min-w-0 text-center text-lg bg-white/90 border border-border/80 rounded-[var(--radius)] text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring transition-all md:w-12 md:flex-none"
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
            className="w-full px-4 py-3 bg-white/90 border border-border/80 rounded-[var(--radius)] text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring transition-all"
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
            className="w-full px-4 py-3 bg-white/90 border border-border/80 rounded-[var(--radius)] text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring transition-all"
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
            className="w-full px-4 py-3 bg-white/90 border border-border/80 rounded-[var(--radius)] text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring transition-all appearance-none cursor-pointer"
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
            className="block w-full max-w-full min-w-0 px-4 py-3 bg-white/90 border border-border/80 rounded-[var(--radius)] text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring transition-all"
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
            className="w-full px-4 py-3 bg-white/90 border border-border/80 rounded-[var(--radius)] text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring transition-all appearance-none cursor-pointer"
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
            className="w-full px-4 py-3 bg-white/90 border border-border/80 rounded-[var(--radius)] text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring transition-all"
            placeholder="e.g., 17.2"
          />
        </div>

        {/* Lives in London */}
        <div className="md:col-span-2">
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
              <div className="relative w-6 h-6 bg-white/90 border-2 border-border/70 rounded-full flex items-center justify-center shadow-sm transition-all group-hover:border-border group-active:scale-95 peer-focus-visible:ring-4 peer-focus-visible:ring-ring/25 peer-checked:border-border after:content-[''] after:absolute after:h-3 after:w-3 after:rounded-full after:bg-black after:opacity-0 after:scale-50 after:transition-[opacity,transform] peer-checked:after:opacity-100 peer-checked:after:scale-100" />
            </div>
            <div className="flex-1">
              <span className="mt-3 block text-foreground">
                I confirm that I currently live in London <span className="text-destructive">*</span>
              </span>
            </div>
          </label>
        </div>

        {/* Consent to follow-up */}
        <div className="md:col-span-2">
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
              <div className="relative w-6 h-6 bg-white/90 border-2 border-border/70 rounded-full flex items-center justify-center shadow-sm transition-all group-hover:border-border group-active:scale-95 peer-focus-visible:ring-4 peer-focus-visible:ring-ring/25 peer-checked:border-border after:content-[''] after:absolute after:h-3 after:w-3 after:rounded-full after:bg-black after:opacity-0 after:scale-50 after:transition-[opacity,transform] peer-checked:after:opacity-100 peer-checked:after:scale-100" />
            </div>
            <div className="flex-1">
              <span className="block text-foreground">
                I consent to being contacted for follow-up surveys and feedback <span className="text-destructive">*</span>
              </span>
            </div>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2 md:col-span-2">
          <Button 
            type="submit"
            size="lg"
            className="w-full cass-hover-lift"
            disabled={submitState.status === 'submitting'}
          >
            {submitState.status === 'submitting' ? 'Submitting…' : 'Submit Application'}
          </Button>
        </div>

        {submitState.status === 'success' && (
          <div className="md:col-span-2 rounded-[var(--radius)] border border-border/60 bg-input-background px-4 py-3 text-center">
            <div className="flex items-center justify-center gap-2 text-foreground">
              <span className="font-medium">Thanks!</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              We’ll be in touch shortly if you’re selected.
            </p>
          </div>
        )}
        {submitState.status === 'error' && (
          <p className="md:col-span-2 text-sm text-center text-destructive">
            {submitState.message}
          </p>
        )}

        <p className="md:col-span-2 text-foreground text-sm text-center">
          By submitting this form, you agree to participate in the Alpha testing Programme and provide honest feedback.
        </p>
      </form>
    </Card>
  );
}
