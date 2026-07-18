import {
  LegalDocument,
  LegalEmailLink as EmailLink,
  LegalSection,
} from "./LegalDocument";

export function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      updatedDateTime="2026-05-05"
      updatedLabel="May 5, 2026"
      introduction={
        <p>
          Cass Technologies LTD is the controller of personal data processed
          through the Cass app. You can contact us at{" "}
          <EmailLink>hello@getcass.com</EmailLink>.
        </p>
      }
    >
      <LegalSection number={1} title="How We Provide This Notice">
        <p>
          We make this privacy notice available at sign-up and in account
          settings within the app.
        </p>
      </LegalSection>

      <LegalSection number={2} title="Who This Policy Applies To">
        <p>
          This policy applies to people who use Cass, an adults-only dating app
          intended for users aged 18 and over in the UK. Cass is not intended
          for children. We take steps designed to prevent under-18s from using
          the service and we carry out assessments required by applicable online
          safety law.
        </p>
      </LegalSection>

      <LegalSection number={3} title="What Data We Collect">
        <p>We collect:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            account and sign-in data, such as your email address, phone number
            where you verify by SMS, and authentication/session data;
          </li>
          <li>
            profile data, such as your first name, age, gender, height,
            occupation, profile summary, tags, photos, "looking for" information
            and discovery preferences;
          </li>
          <li>
            quiz data, such as your answers, scores and selected results shown
            in your profile;
          </li>
          <li>
            communications and safety data, such as messages, report text, block
            records and moderation-related records;
          </li>
          <li>
            location data, such as typed location information and, if you choose
            to enable it, device location data including precise coordinates in
            private account records and less precise location data used for
            discovery features; and
          </li>
          <li>
            technical and security data, such as device identifiers, push
            tokens, notification metadata, log and diagnostic information needed
            to operate, secure and improve the service.
          </li>
        </ul>
        <p>
          Some information you choose to provide on a dating service may reveal
          or relate to special category data under UK data protection law,
          including data concerning sexual orientation or sex life. We ask for
          explicit Article 9 consent before you submit profile, preference or
          quiz information for the dating service.
        </p>
      </LegalSection>

      <LegalSection number={4} title="How Sign-In Works">
        <p>
          Cass uses magic-link email sign-in. To complete sign-in on your
          device, the app temporarily stores your email locally in secure
          storage and Firebase authentication also keeps local session data on
          your device so you remain signed in.
        </p>
        <p>
          If you choose phone verification, Firebase Phone Auth sends an SMS
          code and Cass stores the verified phone number and verification
          timestamp for account trust, waitlist and badge features.
        </p>
      </LegalSection>

      <LegalSection number={5} title="How We Use Your Data">
        <p>
          We use your data to create and run your account, build and display
          your profile, show other users in the app, enable messaging, apply
          discovery and distance filters, store and display your photos, run
          quizzes and show quiz-based profile information, calculate chemistry
          scores and breakdowns, personalise discovery and feed ranking,
          generate optional AI personality insight copy, investigate reports,
          block users, prevent abuse, secure the service, and comply with legal
          obligations.
        </p>
      </LegalSection>

      <LegalSection number={6} title="Private and Public Profile Data">
        <p>
          We keep some data private to your account and make some data visible
          to other signed-in users. Public profile data is limited to the
          profile fields and quiz outputs that we intentionally choose to
          display in the product. We do not intentionally make raw quiz answer
          payloads, exact coordinates, private moderation records,
          authentication data, or internal account metadata visible to other
          users.
        </p>
      </LegalSection>

      <LegalSection number={7} title="Location Data">
        <p>
          If you type a location, we use that to support discovery and distance
          features. If you choose "use my current location", the app requests
          device location permission and may store exact coordinates in your
          private profile and rounded/public coordinates for profile discovery.
          Typed location lookups and geocoding may involve third-party location
          or mapping providers.
        </p>
      </LegalSection>

      <LegalSection number={8} title="Photos and Media">
        <p>
          If you upload profile photos, we process and store them using Firebase
          Storage. The app resizes and compresses images before upload and then
          stores references to those uploaded images for display in the app.
        </p>
      </LegalSection>

      <LegalSection number={9} title="Chats, Reports and Blocking">
        <p>
          Messages are stored so chat participants can view them in the app. If
          you report a user, we store the report details you submit and may
          store a related block record. In-app chat deletion currently acts as a
          hide or soft-delete feature for the deleting user, not a promise that
          message records are erased from backend storage.
        </p>
      </LegalSection>

      <LegalSection number={10} title="Push Notifications">
        <p>
          If you enable push notifications, Cass uses Expo, Apple APNs and
          Google FCM to deliver them. Chat notifications may include the
          sender's name. For established chats, they may also include a short
          message preview so you can recognise the conversation before opening
          the app. Message request notifications do not include the message
          text. On updated Android clients, chat notification content is marked
          private for lock-screen display where supported; on iOS, preview
          visibility follows your device notification settings.
        </p>
      </LegalSection>

      <LegalSection number={11} title="Safety, Reporting and Complaints">
        <p>
          We use reports, block records, moderation information and related
          evidence to investigate suspected abuse, enforce our rules, and
          protect users. We provide ways for users to report concerns and make
          complaints about safety issues in the app.
        </p>
      </LegalSection>

      <LegalSection number={12} title="AI Features">
        <p>
          Cass may use OpenAI to generate optional personality insight text
          based on personality or quiz-derived inputs. We do not use your
          private chat messages for this feature unless we tell you otherwise
          and update this notice.
        </p>
      </LegalSection>

      <LegalSection number={13} title="Chemistry Scores and Discovery Ranking">
        <p>
          Cass calculates chemistry scores and breakdowns to help personalise
          discovery and explain why one profile may be more compatible with
          another. The main inputs are profile tags, Cass Labs and quiz answers,
          scores and results, available shared signal between two profiles,
          discovery preferences, and the current feed configuration.
        </p>
        <p>
          Discovery preferences and location settings can affect which profiles
          are eligible to appear before Chemistry sorting is applied. Chemistry
          scores can affect feed ordering, Chemistry sorting, profile prominence
          in discovery, and the score and breakdown shown in the app. They are
          compatibility signals, not guarantees about a person or relationship.
        </p>
        <p>
          You can influence these inputs by updating your profile tags, Labs and
          quiz answers, discovery preferences, and location settings. You can
          also contact us using the details below to ask about, object to, or
          exercise other rights relating to this processing. We do not
          intentionally use private chat messages, exact coordinates,
          authentication metadata, private moderation records, or report and
          block records to calculate chemistry scores unless we explain the
          change in this notice or another appropriate in-app notice.
        </p>
      </LegalSection>

      <LegalSection number={14} title="Our Legal Bases">
        <p>We rely on different lawful bases depending on the feature:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Contract / steps to provide the service: creating and operating your
            account, authenticating you, displaying your profile to other users
            as part of the service, enabling messaging, applying your selected
            discovery preferences, personalising discovery, showing chemistry
            scores and breakdowns, and storing your photos and profile content.
          </li>
          <li>
            Legitimate interests: keeping the service secure, preventing abuse,
            detecting spam or fraud, investigating reports, enforcing our rules,
            debugging, maintaining service reliability, and keeping appropriate
            internal records.
          </li>
          <li>
            Consent: using optional device permissions such as precise location
            access, and any other optional feature where we ask for consent. For
            special category data in the dating service, we rely on your
            explicit Article 9 consent.
          </li>
          <li>
            Legal obligation: where we need to keep or disclose data to comply
            with applicable law, regulation, court orders, or law-enforcement
            requests.
          </li>
        </ul>
        <p>
          You can withdraw Article 9 consent by deleting your account or
          contacting us. If you withdraw consent, we cannot continue running an
          active Cass dating profile for you.
        </p>
      </LegalSection>

      <LegalSection number={15} title="Who We Share Data With">
        <p>
          We share data with service providers that help us run the app,
          including Google/Firebase for authentication, Firebase Phone Auth and
          SMS verification, database, storage and cloud functions, Google
          Workspace/Gmail infrastructure for sending sign-in emails, Expo, Apple
          APNs and Google FCM for push notifications, which can include sender
          names and active chat previews where notification previews are
          enabled, OpenAI for the personality insight feature, and
          location/geocoding providers used when you search for or derive
          location data. We may also disclose data to advisers, regulators, law
          enforcement, or courts where required.
        </p>
      </LegalSection>

      <LegalSection number={16} title="International Transfers">
        <p>
          Some of our service providers may access or process personal data
          outside the UK. Where this involves a restricted transfer under UK
          data protection law, we use an approved safeguard such as UK adequacy
          regulations, the International Data Transfer Agreement, the UK
          Addendum to the EU Standard Contractual Clauses, or another lawful
          transfer mechanism.
        </p>
      </LegalSection>

      <LegalSection number={17} title="How Long We Keep Data">
        <p>We keep different categories of data for different periods:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>account and profile data: while your account is active;</li>
          <li>
            deleted-account core profile, waitlist, quiz staging, phone
            verification, consent, signup and profile photo records: removed
            from live systems after deletion, with residual copies in backups
            deleted or overwritten in the normal backup cycle;
          </li>
          <li>
            messages: retained for as long as needed to provide chat
            functionality, investigate abuse, resolve disputes, enforce our
            rules, or keep safety evidence after account deletion;
          </li>
          <li>
            reports, blocks and moderation records: retained for longer where
            needed for safety, repeat-offender prevention, legal claims, or
            regulatory reasons;
          </li>
          <li>
            consent and deletion audit records: retained as minimal compliance
            evidence;
          </li>
          <li>
            push tokens and notification events: push tokens are kept until
            replaced, invalidated, or your account is deleted; notification
            event records are metadata-only, deleted on account deletion where
            linked to you, and otherwise retained for 90 days;
          </li>
          <li>
            security, diagnostic and service logs: retained for limited periods
            appropriate to security and debugging.
          </li>
        </ul>
        <p>
          Where we cannot give a single fixed period, we decide retention by
          looking at whether the data is still needed for the purpose collected,
          safety and abuse-prevention needs, legal obligations, and the need to
          establish, exercise or defend legal claims.
        </p>
      </LegalSection>

      <LegalSection number={18} title="Your Rights">
        <p>
          Subject to UK data protection law, you may have rights to access your
          personal data, correct it, erase it, restrict processing, object to
          processing, receive a portable copy of certain data, and withdraw
          consent where processing relies on consent. You also have the right to
          complain to the UK Information Commissioner's Office.
        </p>
      </LegalSection>

      <LegalSection number={19} title="How To Contact Us">
        <p>
          If you want to exercise your rights or ask a privacy question, contact{" "}
          <EmailLink>hello@getcass.com</EmailLink>.
        </p>
      </LegalSection>

      <LegalSection number={20} title="Changes To This Policy">
        <p>
          We may update this policy from time to time. If we make material
          changes, we will post the updated version in the app or on our website
          and update the "Last updated" date.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
