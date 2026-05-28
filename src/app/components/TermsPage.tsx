import backgroundImage from '../../assets/privacy-bg.png';
import { GrainOverlay } from './GrainOverlay';

function TermsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">{title}</h2>
      <div className="mt-3 space-y-4 text-sm leading-7 text-white/78 md:text-base">
        {children}
      </div>
    </section>
  );
}

function EmailLink({ children }: { children: React.ReactNode }) {
  return (
    <a
      href="mailto:hello@getcass.com"
      className="text-white underline decoration-white/35 underline-offset-4 transition hover:decoration-white/70"
    >
      {children}
    </a>
  );
}

function StackedWordmarkBackground() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 md:hidden"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPositionX: 'center',
          backgroundPositionY: '-16vw',
          backgroundRepeat: 'repeat-y',
          backgroundSize: '320vw auto',
          opacity: 0.5,
        }}
      />
      <div
        className="absolute inset-0 hidden md:block lg:hidden"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPositionX: 'center',
          backgroundPositionY: '-20vw',
          backgroundRepeat: 'repeat-y',
          backgroundSize: '160vw auto',
          opacity: 0.38,
        }}
      />
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPositionX: 'center',
          backgroundPositionY: '-12vw',
          backgroundRepeat: 'repeat-y',
          backgroundSize: '132vw auto',
          opacity: 0.36,
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_20%_10%,rgba(255,255,255,0.06),transparent_60%),radial-gradient(900px_600px_at_75%_35%,rgba(205,215,255,0.05),transparent_64%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,9,0.48),rgba(5,5,9,0.66)_36%,rgba(5,5,9,0.76))]" />
      <div className="absolute inset-0 bg-black/48" />
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="relative min-h-[var(--cass-shell-height)] overflow-hidden bg-[#050509] text-white">
      <StackedWordmarkBackground />

      <GrainOverlay />

      <div className="relative z-20 px-6 pb-16 pt-[calc(1rem+env(safe-area-inset-top))] md:px-10 md:pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-start justify-end">
            <a
              href="../"
              className="cass-nav-link"
            >
              Home
            </a>
          </div>

          <article className="mx-auto mt-10 max-w-3xl rounded-[32px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_32px_100px_rgba(0,0,0,0.32)] backdrop-blur-xl md:mt-14 md:p-10">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">Cass Technologies LTD</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">Terms of Use</h1>
            <p className="mt-4 text-sm text-white/60 md:text-base">
              Last updated:{' '}
              <time dateTime="2026-05-22" className="text-white/78">
                May 22, 2026
              </time>
            </p>

            <div className="mt-10">
              <TermsSection title="About These Terms">
                <p>
                  These terms govern your use of the Cass app. By using Cass you agree to these terms, our{' '}
                  <a
                    href="../privacy/"
                    className="text-white underline decoration-white/35 underline-offset-4 transition hover:decoration-white/70"
                  >
                    Privacy Policy
                  </a>
                  , and the community rules below. If you do not agree, do not use the app.
                </p>
                <p>
                  Cass is operated by Cass Technologies LTD. You can contact us
                  at <EmailLink>hello@getcass.com</EmailLink>.
                </p>
              </TermsSection>

              <TermsSection title="Service Status">
                <p>
                  Cass is still evolving. The app may contain bugs and features may be added, modified,
                  or removed over time. We do not guarantee uninterrupted availability, reliability,
                  or that every feature will remain available in its current form.
                </p>
              </TermsSection>

              <TermsSection title="Eligibility">
                <p>
                  You must be at least 18 years old and resident in the United Kingdom to use Cass.
                  By creating an account you confirm that you meet these requirements and that the
                  information you provide is accurate.
                </p>
              </TermsSection>

              <TermsSection title="Your Account">
                <p>
                  You sign in using a magic link sent to your email address. You are responsible for
                  maintaining access to your email and for any activity on your account. If you believe
                  your account has been compromised, contact us immediately
                  at <EmailLink>hello@getcass.com</EmailLink>.
                </p>
              </TermsSection>

              <TermsSection title="Community Rules">
                <p>
                  When using Cass you agree not to:
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>harass, threaten, abuse, or intimidate other users;</li>
                  <li>post content that is illegal, hateful, discriminatory, sexually explicit, or harmful;</li>
                  <li>impersonate another person or misrepresent your identity, age, or intentions;</li>
                  <li>use the app for commercial purposes, advertising, or solicitation;</li>
                  <li>scrape data, use bots, or interfere with the operation of the service;</li>
                  <li>circumvent blocks, bans, or other safety measures; or</li>
                  <li>violate any applicable law.</li>
                </ul>
              </TermsSection>

              <TermsSection title="Your Content">
                <p>
                  You retain ownership of the photos, text, and other content you submit. By posting
                  content on Cass you grant us a non-exclusive, royalty-free licence to use, display,
                  and distribute that content as needed to operate the service. This licence ends when
                  you delete the content or your account, except where retention is required for safety,
                  legal, or moderation purposes as described in our Privacy Policy.
                </p>
                <p>
                  You are responsible for the content you post. Do not post anything you do not have
                  the right to share.
                </p>
              </TermsSection>

              <TermsSection title="Safety and Moderation">
                <p>
                  You can report or block other users from within the app. We review reports and may
                  take action including warnings, suspensions, or permanent removal. We retain reports,
                  blocks, and moderation records as described in our Privacy Policy.
                </p>
                <p>
                  We may suspend or terminate your account at any time if we believe you have violated
                  these terms or pose a risk to the safety of other users.
                </p>
              </TermsSection>

              <TermsSection title="AI Features">
                <p>
                  Cass may offer optional AI-generated content such as personality insights or conversation
                  suggestions. These features use quiz-derived data only and are provided for entertainment.
                  AI outputs may be inaccurate and should not be relied on as advice of any kind.
                </p>
              </TermsSection>

              <TermsSection title="Special Category Consent">
                <p>
                  Cass is a dating app, so profile, preference, quiz and compatibility information you provide may
                  reveal special category information, including information about relationships, sex life or sexual
                  orientation. You must give explicit consent for this processing to use an active Cass dating profile.
                  If you withdraw that consent, we may need to close or delete your account.
                </p>
              </TermsSection>

              <TermsSection title="Interactions with Other Users">
                <p>
                  Cass facilitates introductions but is not responsible for the conduct of its users.
                  You interact with other users at your own risk. We are not liable for any loss, damage,
                  or harm arising from your interactions with other users, whether online or offline.
                  Exercise your own judgement and take appropriate precautions when meeting anyone in person.
                </p>
              </TermsSection>

              <TermsSection title="Intellectual Property">
                <p>
                  The Cass app, its design, features, and underlying technology are owned by
                  Cass Technologies LTD. Nothing in these terms grants you any rights to our
                  intellectual property beyond the limited right to use the app as intended.
                </p>
              </TermsSection>

              <TermsSection title="Limitation of Liability">
                <p>
                  To the fullest extent permitted by law, Cass Technologies LTD and its officers,
                  directors, and employees shall not be liable for any indirect, incidental, special,
                  consequential, or punitive damages, or any loss of data, profits, or goodwill,
                  arising from or related to your use of the app.
                </p>
                <p>
                  The app is provided "as is" and "as available", without warranties of any kind,
                  whether express or implied, including implied warranties of merchantability,
                  fitness for a particular purpose, and non-infringement.
                </p>
                <p>
                  Nothing in these terms excludes or limits our liability for death or personal injury
                  caused by our negligence, fraud or fraudulent misrepresentation, or any other
                  liability that cannot be excluded or limited under English law.
                </p>
              </TermsSection>

              <TermsSection title="Account Deletion">
                <p>
                  You can delete your account at any time from within the app. Deletion removes your profile, photos,
                  waitlist, quiz staging, consent, phone verification and account records from live systems. Some data
                  may be retained as set out in our Privacy Policy, including messages, reports, blocks, audit records
                  and moderation records needed for safety, legal or regulatory reasons.
                </p>
              </TermsSection>

              <TermsSection title="Changes to These Terms">
                <p>
                  We may update these terms from time to time. If we make material changes we will
                  notify you by email or in the app. Continued use of Cass after changes take effect
                  constitutes acceptance of the updated terms.
                </p>
              </TermsSection>

              <TermsSection title="Governing Law">
                <p>
                  These terms are governed by the laws of England and Wales. Any dispute arising from
                  these terms or your use of Cass shall be subject to the exclusive jurisdiction of the
                  courts of England and Wales.
                </p>
              </TermsSection>

              <TermsSection title="Contact">
                <p>
                  Questions about these terms? Email us at <EmailLink>hello@getcass.com</EmailLink>.
                </p>
              </TermsSection>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
