import backgroundImage from '../../assets/privacy-bg.png';
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

export function PrivacyPage() {
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
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">Privacy Policy</h1>
            <p className="mt-4 text-sm text-white/60 md:text-base">
              Last updated:{' '}
              <time dateTime="2026-03-30" className="text-white/78">
                March 30, 2026
              </time>
            </p>

            <div className="mt-10">
              <PrivacySection title="Who We Are">
                <p>
                  Cass Technologies LTD is the controller of personal data processed through the Cass app. You can
                  contact us at <EmailLink>hello@getcass.com</EmailLink>.
                </p>
              </PrivacySection>

              <PrivacySection title="How We Provide This Notice">
                <p>
                  We make this privacy notice available at sign-up and in account settings within the app.
                </p>
              </PrivacySection>

              <PrivacySection title="Who This Policy Applies To">
                <p>
                  This policy applies to people who use Cass, an adults-only dating app intended for users aged 18 and
                  over in the UK. Cass is not intended for children. We take steps designed to prevent under-18s from
                  using the service and we carry out assessments required by applicable online safety law.
                </p>
              </PrivacySection>

              <PrivacySection title="What Data We Collect">
                <p>
                  We collect:
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>account and sign-in data, such as your email address and authentication/session data;</li>
                  <li>
                    profile data, such as your first name, age, gender, height, occupation, profile summary, tags,
                    photos, "looking for" information and discovery preferences;
                  </li>
                  <li>quiz data, such as your answers, scores and selected results shown in your profile;</li>
                  <li>
                    communications and safety data, such as messages, report text, block records and
                    moderation-related records;
                  </li>
                  <li>
                    location data, such as typed location information and, if you choose to enable it, device location
                    data including precise coordinates in private account records and less precise location data used
                    for discovery features; and
                  </li>
                  <li>
                    technical and security data, such as device, log and diagnostic information needed to operate,
                    secure and improve the service.
                  </li>
                </ul>
                <p>
                  Some information you choose to provide on a dating service may reveal or relate to special category
                  data under UK data protection law, including data concerning sexual orientation. If we process
                  special category data, we do so only where we have both a valid Article 6 lawful basis and an
                  Article 9 condition.
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
                  We keep some data private to your account and make some data visible to other signed-in users. Public
                  profile data is limited to the profile fields and quiz outputs that we intentionally choose to
                  display in the product. We do not intentionally make raw quiz answer payloads, exact coordinates,
                  private moderation records, authentication data, or internal account metadata visible to other users.
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

              <PrivacySection title="Safety, Reporting and Complaints">
                <p>
                  We use reports, block records, moderation information and related evidence to investigate suspected
                  abuse, enforce our rules, and protect users. We provide ways for users to report concerns and make
                  complaints about safety issues in the app.
                </p>
              </PrivacySection>

              <PrivacySection title="AI Features">
                <p>
                  Cass may use OpenAI to generate optional personality insight text based on personality or
                  quiz-derived inputs. We do not use your private chat messages for this feature unless we tell you
                  otherwise and update this notice.
                </p>
                <p>
                  If we use automated profiling or ranking to personalise discovery, we will describe the main logic,
                  significance and likely effects in this notice or in an in-app explanation where required.
                </p>
              </PrivacySection>

              <PrivacySection title="Our Legal Bases">
                <p>
                  We rely on different lawful bases depending on the feature:
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    Contract / steps to provide the service: creating and operating your account, authenticating you,
                    displaying your profile to other users as part of the service, enabling messaging, applying your
                    selected discovery preferences, and storing your photos and profile content.
                  </li>
                  <li>
                    Legitimate interests: keeping the service secure, preventing abuse, detecting spam or fraud,
                    investigating reports, enforcing our rules, debugging, maintaining service reliability, and keeping
                    appropriate internal records.
                  </li>
                  <li>
                    Consent: using optional device permissions such as precise location access, and any other optional
                    feature where we ask for consent.
                  </li>
                  <li>
                    Legal obligation: where we need to keep or disclose data to comply with applicable law, regulation,
                    court orders, or law-enforcement requests.
                  </li>
                </ul>
                <p>
                  Where we process special category data, we also identify a separate Article 9 condition before doing
                  so.
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
                  Some of our service providers may access or process personal data outside the UK. Where this involves
                  a restricted transfer under UK data protection law, we use an approved safeguard such as UK adequacy
                  regulations, the International Data Transfer Agreement, the UK Addendum to the EU Standard
                  Contractual Clauses, or another lawful transfer mechanism.
                </p>
              </PrivacySection>

              <PrivacySection title="How Long We Keep Data">
                <p>
                  We keep different categories of data for different periods:
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>account and profile data: while your account is active;</li>
                  <li>
                    deleted-account core profile records and profile photos: removed from live systems after deletion,
                    with residual copies in backups deleted or overwritten in the normal backup cycle;
                  </li>
                  <li>
                    messages: retained for as long as needed to provide chat functionality, investigate abuse, resolve
                    disputes, and enforce our rules;
                  </li>
                  <li>
                    reports, blocks and moderation records: retained for longer where needed for safety,
                    repeat-offender prevention, legal claims, or regulatory reasons;
                  </li>
                  <li>
                    security, diagnostic and service logs: retained for limited periods appropriate to security and
                    debugging.
                  </li>
                </ul>
                <p>
                  Where we cannot give a single fixed period, we decide retention by looking at whether the data is
                  still needed for the purpose collected, safety and abuse-prevention needs, legal obligations, and the
                  need to establish, exercise or defend legal claims.
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
