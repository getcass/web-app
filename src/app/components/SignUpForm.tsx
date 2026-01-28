import { useState, useRef } from 'react';
import { Button } from './ui/button';
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

  const fieldClassName =
    'mt-3 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 shadow-[0_1px_0_rgba(255,255,255,0.06)] outline-none backdrop-blur-xl backdrop-saturate-150 transition-[border-color,box-shadow] focus:border-white/30 focus:ring-4 focus:ring-white/10';

  const selectClassName =
    'mt-3 w-full cursor-pointer appearance-none rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white shadow-[0_1px_0_rgba(255,255,255,0.06)] outline-none backdrop-blur-xl backdrop-saturate-150 transition-[border-color,box-shadow] focus:border-white/30 focus:ring-4 focus:ring-white/10';

  return (
    <div className="mx-auto w-full max-w-4xl">
      <form onSubmit={handleSubmit} className="grid gap-y-5 gap-x-7 md:grid-cols-2">
        {/* Invite Code */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium uppercase tracking-[0.22em] text-white/60">
            Invite code <span className="text-red-300">*</span>
          </label>
          <div
            className="mt-3 grid w-full grid-cols-6 gap-2.5 md:flex md:justify-start md:gap-3"
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
                className="h-12 w-full min-w-0 rounded-2xl border border-white/15 bg-white/10 text-center text-xl font-semibold tracking-[0.14em] text-white placeholder:text-white/35 shadow-[0_1px_0_rgba(255,255,255,0.06)] outline-none backdrop-blur-xl backdrop-saturate-150 transition-[border-color,box-shadow,transform] focus:border-white/30 focus:ring-4 focus:ring-white/10 md:w-12 md:flex-none"
              />
            ))}
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-xs font-medium uppercase tracking-[0.22em] text-white/60">
            Full name <span className="text-red-300">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            className={fieldClassName}
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-medium uppercase tracking-[0.22em] text-white/60">
            Email <span className="text-red-300">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={fieldClassName}
            placeholder="john@example.com"
          />
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="gender" className="block text-xs font-medium uppercase tracking-[0.22em] text-white/60">
            Gender <span className="text-red-300">*</span>
          </label>
          <select
            id="gender"
            name="gender"
            required
            value={formData.gender}
            onChange={handleChange}
            className={selectClassName}
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
          <label htmlFor="dateOfBirth" className="block text-xs font-medium uppercase tracking-[0.22em] text-white/60">
            Date of birth <span className="text-red-300">*</span>
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            required
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={fieldClassName}
          />
        </div>

        {/* Device Type */}
        <div>
          <label htmlFor="deviceType" className="block text-xs font-medium uppercase tracking-[0.22em] text-white/60">
            Device <span className="text-red-300">*</span>
          </label>
          <select
            id="deviceType"
            name="deviceType"
            required
            value={formData.deviceType}
            onChange={handleChange}
            className={selectClassName}
          >
            <option value="">Select device type</option>
            <option value="iphone">iPhone</option>
            <option value="ipad">iPad</option>
          </select>
        </div>

        {/* OS Version */}
        <div>
          <label htmlFor="osVersion" className="block text-xs font-medium uppercase tracking-[0.22em] text-white/60">
            iOS version <span className="text-red-300">*</span>
          </label>
          <input
            type="text"
            id="osVersion"
            name="osVersion"
            required
            value={formData.osVersion}
            onChange={handleChange}
            className={fieldClassName}
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
              <div className="relative h-6 w-6 rounded-full border border-white/15 bg-white/10 shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl backdrop-saturate-150 transition-[border-color,transform,box-shadow] group-active:scale-95 peer-focus-visible:ring-4 peer-focus-visible:ring-white/10 peer-checked:border-white/30 after:absolute after:inset-1.5 after:rounded-full after:bg-white after:opacity-0 after:scale-75 after:transition-[opacity,transform] peer-checked:after:opacity-100 peer-checked:after:scale-100" />
            </div>
            <div className="flex-1">
              <span className="block text-white/75">
                I confirm that I currently live in London <span className="text-red-300">*</span>
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
              <div className="relative h-6 w-6 rounded-full border border-white/15 bg-white/10 shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl backdrop-saturate-150 transition-[border-color,transform,box-shadow] group-active:scale-95 peer-focus-visible:ring-4 peer-focus-visible:ring-white/10 peer-checked:border-white/30 after:absolute after:inset-1.5 after:rounded-full after:bg-white after:opacity-0 after:scale-75 after:transition-[opacity,transform] peer-checked:after:opacity-100 peer-checked:after:scale-100" />
            </div>
            <div className="flex-1">
              <span className="block text-white/75">
                I consent to being contacted for follow‑up surveys and feedback <span className="text-red-300">*</span>
              </span>
            </div>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2 md:col-span-2">
          <Button
            type="submit"
            size="lg"
            variant="primary"
            className="w-full cass-hover-lift"
            disabled={submitState.status === 'submitting'}
          >
            {submitState.status === 'submitting' ? 'Submitting…' : 'Submit Application'}
          </Button>
        </div>

        {submitState.status === 'success' && (
          <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center shadow-[0_1px_0_rgba(255,255,255,0.06)]">
            <div className="text-white">
              <span className="text-base font-semibold">Thanks!</span>
            </div>
            <p className="mt-1 text-sm text-white/65">We’ll be in touch shortly if you’re selected.</p>
          </div>
        )}
        {submitState.status === 'error' && (
          <p className="md:col-span-2 text-center text-sm text-red-300">{submitState.message}</p>
        )}

        <p className="md:col-span-2 text-center text-sm text-white/55">
          By submitting, you agree to participate in the alpha testing programme and provide honest feedback.
        </p>
      </form>
    </div>
  );
}
