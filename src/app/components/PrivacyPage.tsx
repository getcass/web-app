import backgroundImage from '../../assets/cass_bg.png';
import backgroundImageVertical from '../../assets/cass-bg-vertical.png';
import { GrainOverlay } from './GrainOverlay';

function PrivacySection({
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

export function PrivacyPage() {
  return (
    <div className="relative min-h-[var(--cass-shell-height)] overflow-hidden bg-[#050509] text-white">
      <div className="absolute inset-0">
        <img
          src={backgroundImageVertical}
          alt=""
          className="h-full w-full object-cover object-top saturate-110 contrast-105 lg:hidden"
          style={{ opacity: 0.24 }}
        />
        <img
          src={backgroundImage}
          alt=""
          className="hidden h-full w-full object-cover object-center saturate-110 contrast-105 lg:block"
          style={{ opacity: 0.24 }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_20%_10%,rgba(255,255,255,0.08),transparent_60%),radial-gradient(900px_600px_at_75%_35%,rgba(205,215,255,0.06),transparent_64%)]" />
        <div className="absolute inset-0 bg-black/72" />
      </div>

      <GrainOverlay />

      <div className="relative z-20 px-6 pb-16 pt-[calc(1rem+env(safe-area-inset-top))] md:px-10 md:pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-start justify-end">
            <a
              href="../"
              className="rounded-full border border-white/12 bg-black/25 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/72 backdrop-blur-md transition-[background-color,color,border-color] duration-150 hover:border-white/22 hover:bg-black/35 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/15"
            >
              Home
            </a>
          </div>

          <article className="mx-auto mt-10 max-w-3xl rounded-[32px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_32px_100px_rgba(0,0,0,0.32)] backdrop-blur-xl md:mt-14 md:p-10">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">Cass Technologies LTD</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">Privacy Policy</h1>
            <p className="mt-4 text-sm text-white/60 md:text-base">
              Last updated:{' '}
              <time dateTime="2026-03-13" className="text-white/78">
                March 13, 2026
              </time>
            </p>

            <div className="mt-10">
              <PrivacySection title="Who We Are">
                <p>
                  Cass Technologies LTD is the controller of personal data processed through the Cass app. You can
                  contact us at <EmailLink>hello@getcass.com</EmailLink>.
                </p>
              </PrivacySection>

              <PrivacySection title="Who This Policy Applies To">
                <p>
                  This policy applies to people who use Cass, an adults-only dating app intended for users aged 18 and
                  over in the UK.
                </p>
              </PrivacySection>

              <PrivacySection title="What Data We Collect">
                <p>
                  We collect information you provide directly to us, including your email address for sign-in, your
                  profile information such as name, age, gender, height, occupation, "looking for" information, profile
                  summary, tags, discovery preferences, photos, quiz answers and quiz results, messages you send, and
                  any report text you submit. We also collect location-related information if you choose to provide it,
                  including typed location information and, if you grant permission, your device's current location and
                  coordinates.
                </p>
              </PrivacySection>

              <PrivacySection title="How Sign-In Works">
                <p>
                  Cass uses magic-link email sign-in. To complete sign-in on your device, the app temporarily stores
                  your email locally in secure storage and Firebase authentication also keeps local session data on your
                  device so you remain signed in.
                </p>
              </PrivacySection>

              <PrivacySection title="How We Use Your Data">
                <p>
                  We use your data to create and run your account, build and display your profile, show other users in
                  the app, enable messaging, apply discovery and distance filters, store and display your photos, run
                  quizzes and show quiz-based profile information, generate optional AI personality insight copy,
                  investigate reports, block users, prevent abuse, secure the service, and comply with legal
                  obligations.
                </p>
              </PrivacySection>

              <PrivacySection title="Private and Public Profile Data">
                <p>
                  We store some information in a private user record and some information in a public profile record.
                  Information in your public profile is available to other signed-in users. Based on the current
                  implementation, this public profile can include your visible profile fields, profile photos, profile
                  summary, tags, rounded/public location data where present, quiz results, and currently quiz payload
                  data linked to your profile.
                </p>
              </PrivacySection>

              <PrivacySection title="Location Data">
                <p>
                  If you type a location, we use that to support discovery and distance features. If you choose "use my
                  current location", the app requests device location permission and may store exact coordinates in your
                  private profile and rounded/public coordinates for profile discovery. Typed location lookups and
                  geocoding may involve third-party location or mapping providers.
                </p>
              </PrivacySection>

              <PrivacySection title="Photos and Media">
                <p>
                  If you upload profile photos, we process and store them using Firebase Storage. The app resizes and
                  compresses images before upload and then stores references to those uploaded images for display in the
                  app.
                </p>
              </PrivacySection>

              <PrivacySection title="Chats, Reports and Blocking">
                <p>
                  Messages are stored so chat participants can view them in the app. If you report a user, we store the
                  report details you submit and may store a related block record. In-app chat deletion currently acts as
                  a hide or soft-delete feature for the deleting user, not a promise that message records are erased
                  from backend storage.
                </p>
              </PrivacySection>

              <PrivacySection title="AI Features">
                <p>
                  Cass currently uses OpenAI to generate personality insight text based on derived personality trait
                  data from your quiz results. Based on the current code, this AI feature does not send your chat
                  messages to OpenAI for that purpose.
                </p>
              </PrivacySection>

              <PrivacySection title="Our Legal Bases">
                <p>
                  We generally process your personal data because it is necessary to provide the service you ask for,
                  because it is in our legitimate interests to operate and secure the app, investigate abuse, and
                  improve service reliability, because you consent where a device permission or optional feature requires
                  consent, and where necessary to comply with legal obligations. Because this is a dating service, some
                  information you choose to provide may be sensitive under UK data protection law, and we treat that
                  information with additional care.
                </p>
              </PrivacySection>

              <PrivacySection title="Who We Share Data With">
                <p>
                  We share data with service providers that help us run the app, including Google/Firebase for
                  authentication, database, storage and cloud functions, Google Workspace/Gmail infrastructure for
                  sending sign-in emails, OpenAI for the personality insight feature, and location/geocoding providers
                  used when you search for or derive location data. We may also disclose data to advisers, regulators,
                  law enforcement, or courts where required.
                </p>
              </PrivacySection>

              <PrivacySection title="International Transfers">
                <p>
                  Our providers may process personal data outside the UK. Where that happens, we expect transfers to be
                  protected by appropriate safeguards under UK data protection law.
                </p>
              </PrivacySection>

              <PrivacySection title="How Long We Keep Data">
                <p>
                  We keep account and profile data while your account is active. Based on the current automated deletion
                  flow, deleting your account removes the authentication account, private/public profile documents, and
                  uploaded profile photos. We do not currently promise immediate deletion of all chats, messages,
                  reports, blocks, or technical records unless and until that is separately implemented and verified.
                </p>
              </PrivacySection>

              <PrivacySection title="Your Rights">
                <p>
                  Subject to UK data protection law, you may have rights to access your personal data, correct it,
                  erase it, restrict processing, object to processing, receive a portable copy of certain data, and
                  withdraw consent where processing relies on consent. You also have the right to complain to the UK
                  Information Commissioner's Office.
                </p>
              </PrivacySection>

              <PrivacySection title="How To Contact Us">
                <p>
                  If you want to exercise your rights or ask a privacy question, contact{' '}
                  <EmailLink>hello@getcass.com</EmailLink>.
                </p>
              </PrivacySection>

              <PrivacySection title="Changes To This Policy">
                <p>
                  We may update this policy from time to time. If we make material changes, we will post the updated
                  version in the app or on our website and update the "Last updated" date.
                </p>
              </PrivacySection>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
