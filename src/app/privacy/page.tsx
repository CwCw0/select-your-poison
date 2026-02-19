import type { Metadata } from 'next';
import Link from 'next/link';
import { Skull, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | SELECT YOUR POISON',
};

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0C0C0C' }}>
      {/* Header */}
      <header style={{
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(16px, 4vw, 48px)',
        borderBottom: '1px solid #333333',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#FF0000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Skull style={{ width: '24px', height: '24px', color: '#0C0C0C' }} />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '3px', color: '#FFFFFF' }}>
            SYP
          </span>
        </Link>
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            border: '1px solid #333333',
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '2px',
            fontFamily: 'var(--font-space-mono), monospace',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          BACK
        </Link>
      </header>

      {/* Hero */}
      <section style={{ padding: '100px 0 80px', backgroundColor: '#0C0C0C' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 48px)' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '4px',
            color: '#FF0000',
            fontFamily: 'var(--font-space-mono), monospace',
            display: 'block',
            marginBottom: '24px',
          }}>
            LEGAL
          </span>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 4rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-3px',
            lineHeight: 1,
          }}>
            PRIVACY POLICY
          </h1>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '0 0 120px', backgroundColor: '#0C0C0C' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 48px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>

            {/* Preamble */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                This Privacy Policy (&quot;Policy&quot;) describes how Nimbus Studio (&quot;Nimbus,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects, uses, stores, shares, and protects your personal information when you access or use the Select Your Poison web application (&quot;SYP,&quot; the &quot;Service,&quot; or the &quot;App&quot;), a Valorant drinking game companion platform. By creating an account or using the Service, you acknowledge that you have read and understood this Policy and consent to the data practices described herein.
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                If you do not agree with any part of this Policy, you must discontinue use of the Service immediately.
              </p>
            </div>

            {/* 1. Information We Collect */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                1. INFORMATION WE COLLECT
              </h2>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                We collect several categories of information to provide, maintain, and improve the Service. The types of data we collect depend on how you interact with SYP.
              </p>

              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.5px', marginTop: '8px' }}>
                1.1 Information You Provide Directly
              </h3>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                When you create an account or interact with the Service, you voluntarily provide:
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '0', listStyle: 'none' }}>
                {[
                  'Email address, used for account creation, authentication, and service communications.',
                  'Gamertag or display name, visible to other players in your lobbies.',
                  'Password, which is stored exclusively as a bcrypt hash. We never store, log, or have access to your plaintext password at any point.',
                  'Age confirmation, verifying that you meet the minimum age requirement to use the Service.',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <span style={{ color: '#FF0000', marginTop: '6px', fontSize: '8px', flexShrink: 0 }}>&#9679;</span>
                    <span style={{ fontSize: '15px', color: '#999999', lineHeight: 1.7, fontFamily: 'var(--font-space-mono), monospace' }}>{item}</span>
                  </li>
                ))}
              </ul>

              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.5px', marginTop: '8px' }}>
                1.2 Information Collected Automatically
              </h3>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                When you access the Service, certain information is collected automatically through standard web technologies:
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '0', listStyle: 'none' }}>
                {[
                  'IP address, used exclusively for rate limiting and abuse prevention. IP addresses are not stored long-term or associated with your account profile.',
                  'Device type (desktop, mobile, tablet) and screen resolution.',
                  'Browser type and version.',
                  'Operating system and platform.',
                  'Pages visited within the Service and navigation patterns.',
                  'Features used, including game modes accessed and actions taken.',
                  'Session duration and timestamps of access.',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <span style={{ color: '#FF0000', marginTop: '6px', fontSize: '8px', flexShrink: 0 }}>&#9679;</span>
                    <span style={{ fontSize: '15px', color: '#999999', lineHeight: 1.7, fontFamily: 'var(--font-space-mono), monospace' }}>{item}</span>
                  </li>
                ))}
              </ul>

              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.5px', marginTop: '8px' }}>
                1.3 Game Data
              </h3>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                During gameplay, we collect data necessary for core game functionality and statistics:
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '0', listStyle: 'none' }}>
                {[
                  'Lobby codes and lobby membership.',
                  'Game mode selections (e.g., Classic, Strat Roulette, Custom).',
                  'Player statistics including death counts, drink tallies, and strat roulette rolls.',
                  'Agent selections for each game session.',
                  'Round-by-round history and match outcomes.',
                  'Challenge completions and special event data.',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <span style={{ color: '#FF0000', marginTop: '6px', fontSize: '8px', flexShrink: 0 }}>&#9679;</span>
                    <span style={{ fontSize: '15px', color: '#999999', lineHeight: 1.7, fontFamily: 'var(--font-space-mono), monospace' }}>{item}</span>
                  </li>
                ))}
              </ul>

              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.5px', marginTop: '8px' }}>
                1.4 Cookies &amp; Local Storage
              </h3>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                We use cookies and browser local storage to maintain your session and preferences:
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '0', listStyle: 'none' }}>
                {[
                  'Session authentication cookies: configured as httpOnly, Secure, and SameSite=Strict to prevent cross-site request forgery and unauthorized access.',
                  'Client-side preferences via localStorage: managed through Zustand persist middleware, used to store non-sensitive user preferences such as display settings and UI state across sessions.',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <span style={{ color: '#FF0000', marginTop: '6px', fontSize: '8px', flexShrink: 0 }}>&#9679;</span>
                    <span style={{ fontSize: '15px', color: '#999999', lineHeight: 1.7, fontFamily: 'var(--font-space-mono), monospace' }}>{item}</span>
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                These cookies and storage mechanisms are essential for the functioning of the Service. We do not use third-party advertising or tracking cookies.
              </p>
            </div>

            {/* 2. Legal Basis for Processing */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                2. LEGAL BASIS FOR PROCESSING
              </h2>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                We process your personal data on the following legal grounds, depending on the context in which it is collected and used:
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '0', listStyle: 'none' }}>
                {[
                  'Consent: When you create an account, you consent to the collection and processing of data as described in this Policy. You may withdraw consent at any time by deleting your account or contacting us.',
                  'Legitimate interests: We process certain data for purposes of security, fraud prevention, abuse detection, and service improvement, where our interests do not override your fundamental rights and freedoms.',
                  'Contractual necessity: Processing necessary to provide the Service to you, including account management, lobby functionality, and game session operations, as outlined in our Terms of Service.',
                  'Legal obligations: We may process data to comply with applicable laws, regulations, legal processes, or enforceable governmental requests.',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <span style={{ color: '#FF0000', marginTop: '6px', fontSize: '8px', flexShrink: 0 }}>&#9679;</span>
                    <span style={{ fontSize: '15px', color: '#999999', lineHeight: 1.7, fontFamily: 'var(--font-space-mono), monospace' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. How We Use Your Information */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                3. HOW WE USE YOUR INFORMATION
              </h2>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                We use the information we collect strictly for the following purposes:
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '0', listStyle: 'none' }}>
                {[
                  'Account authentication: verifying your identity during login, maintaining session state, and securing your account against unauthorized access.',
                  'Core game functionality: lobby creation and management, player syncing across sessions, real-time game state tracking, and delivery of gameplay features.',
                  'Generating game statistics: compiling end-of-game summaries, leaderboard data, player performance metrics, and historical game records.',
                  'Service improvement: analyzing aggregated usage patterns to identify bugs, optimize performance, improve user experience, and develop new features.',
                  'Security monitoring: detecting and preventing unauthorized access, abuse, fraud, and other malicious activity on the platform.',
                  'Rate limiting: using IP-based rate limiting to prevent abuse of API endpoints and protect the Service from denial-of-service attacks.',
                  'Communicating service updates: sending essential notifications regarding changes to the Service, security alerts, or updates to our legal terms.',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <span style={{ color: '#FF0000', marginTop: '6px', fontSize: '8px', flexShrink: 0 }}>&#9679;</span>
                    <span style={{ fontSize: '15px', color: '#999999', lineHeight: 1.7, fontFamily: 'var(--font-space-mono), monospace' }}>{item}</span>
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                We do not use your personal data for automated decision-making or profiling that produces legal effects or similarly significant effects on you.
              </p>
            </div>

            {/* 4. Data Sharing & Disclosure */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                4. DATA SHARING &amp; DISCLOSURE
              </h2>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                We do not sell, rent, lease, or trade your personal data to third parties for monetary or other valuable consideration. We will never monetize your personal information.
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                We may share limited data in the following specific circumstances:
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '0', listStyle: 'none' }}>
                {[
                  'Other players in your lobby: Your gamertag, agent selection, and in-game statistics (such as death counts and drink tallies) are visible to other players within your active game session. This sharing is essential for multiplayer gameplay.',
                  'Service providers: We use third-party infrastructure providers for hosting (Vercel) and database services (Supabase) that process data on our behalf under strict contractual obligations to protect your data.',
                  'Law enforcement and legal requirements: We may disclose personal data if required to do so by law, subpoena, court order, or other legal process, or if we believe in good faith that disclosure is necessary to protect our rights, your safety, or the safety of others.',
                  'Business transfers: In connection with a merger, acquisition, reorganization, bankruptcy, or sale of all or a portion of our assets, your personal data may be transferred as part of that transaction. We will notify you of any such change and any choices you may have regarding your data.',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <span style={{ color: '#FF0000', marginTop: '6px', fontSize: '8px', flexShrink: 0 }}>&#9679;</span>
                    <span style={{ fontSize: '15px', color: '#999999', lineHeight: 1.7, fontFamily: 'var(--font-space-mono), monospace' }}>{item}</span>
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                Outside of the circumstances described above, we do not share your personal data with any third party.
              </p>
            </div>

            {/* 5. Third-Party Services */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                5. THIRD-PARTY SERVICES
              </h2>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                If you choose to sign in using a third-party OAuth provider (such as Discord or Google), we receive basic profile information from that provider, typically including your display name, email address, and profile image. We do not receive, access, or store your third-party account passwords under any circumstances.
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                The Service is hosted on Vercel and uses Supabase for database and authentication infrastructure. These providers operate under their own privacy policies and terms of service, and we have entered into data processing agreements with them where applicable.
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                We may use third-party analytics services to understand how users interact with the Service. These services may collect anonymized and aggregated usage data in accordance with their own privacy policies. We encourage you to review the privacy policies of any third-party services you interact with.
              </p>
            </div>

            {/* 6. Data Storage & Security */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                6. DATA STORAGE &amp; SECURITY
              </h2>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                Your data is stored on Supabase, which runs on PostgreSQL with encryption at rest enabled by default. We take the security of your data seriously and implement the following technical safeguards:
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '0', listStyle: 'none' }}>
                {[
                  'Passwords are hashed using bcrypt with a cost factor of 12 rounds. Plaintext passwords are never stored, logged, or transmitted after initial hashing.',
                  'Session tokens are generated using cryptographically secure randomness via crypto.randomBytes, ensuring tokens cannot be predicted or forged.',
                  'All authentication cookies are configured with httpOnly (inaccessible to client-side JavaScript), Secure (transmitted only over HTTPS), and SameSite=Strict (preventing cross-site request forgery) flags.',
                  'HTTPS (TLS encryption) is enforced across all production environments, ensuring all data in transit between your browser and our servers is encrypted.',
                  'Database access is restricted through role-based access controls and network-level security policies.',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <span style={{ color: '#FF0000', marginTop: '6px', fontSize: '8px', flexShrink: 0 }}>&#9679;</span>
                    <span style={{ fontSize: '15px', color: '#999999', lineHeight: 1.7, fontFamily: 'var(--font-space-mono), monospace' }}>{item}</span>
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                While we implement reasonable and industry-standard security measures to protect your personal data, no method of electronic storage or transmission over the internet is 100% secure. We cannot guarantee absolute security, and you use the Service at your own risk.
              </p>
            </div>

            {/* 7. Data Retention */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                7. DATA RETENTION
              </h2>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                We retain your personal data only for as long as necessary to fulfill the purposes described in this Policy, unless a longer retention period is required or permitted by law.
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '0', listStyle: 'none' }}>
                {[
                  'Account data (email, gamertag, hashed password) is retained for the duration that your account remains active.',
                  'Game session data (match history, statistics, leaderboard entries) is retained for statistics and leaderboard functionality, even after individual sessions conclude.',
                  'Inactive accounts may be purged after 12 months of continuous inactivity. We may attempt to notify you at your registered email address before deletion.',
                  'Upon account deletion (whether initiated by you or due to inactivity), your personal data will be removed from our active systems within 30 days. Backup systems may retain encrypted copies for up to an additional 30 days before automatic purging.',
                  'Anonymized and aggregated data that cannot be used to identify you may be retained indefinitely for analytical and service improvement purposes.',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <span style={{ color: '#FF0000', marginTop: '6px', fontSize: '8px', flexShrink: 0 }}>&#9679;</span>
                    <span style={{ fontSize: '15px', color: '#999999', lineHeight: 1.7, fontFamily: 'var(--font-space-mono), monospace' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 8. Your Rights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                8. YOUR RIGHTS
              </h2>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                Depending on your jurisdiction, you may have the following rights with respect to your personal data:
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '0', listStyle: 'none' }}>
                {[
                  'Right of access: You may request a copy of the personal data we hold about you, including the categories of data collected, the purposes of processing, and any third parties with whom it has been shared.',
                  'Right to deletion: You may request that we delete your account and all associated personal data. Upon verification of your identity, we will process your deletion request within 30 days.',
                  'Right to correction: You may update or correct inaccurate personal information associated with your account at any time through your profile settings or by contacting us.',
                  'Right to data portability: You may request an export of your personal data in a structured, commonly used, and machine-readable format (such as JSON or CSV).',
                  'Right to restriction: You may request that we restrict or limit the processing of your personal data under certain circumstances, such as when you contest the accuracy of the data.',
                  'Right to object: You may object to the processing of your personal data where we rely on legitimate interests as our legal basis, and we will cease processing unless we demonstrate compelling legitimate grounds.',
                  'Right to withdraw consent: Where processing is based on your consent, you may withdraw that consent at any time without affecting the lawfulness of processing carried out prior to withdrawal.',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <span style={{ color: '#FF0000', marginTop: '6px', fontSize: '8px', flexShrink: 0 }}>&#9679;</span>
                    <span style={{ fontSize: '15px', color: '#999999', lineHeight: 1.7, fontFamily: 'var(--font-space-mono), monospace' }}>{item}</span>
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                To exercise any of these rights, please contact us at{' '}
                <span style={{ color: '#FF0000', fontWeight: 600 }}>heyitsnimbus@gmail.com</span>.
                We will respond to your request within 30 days. We may require verification of your identity before processing certain requests.
              </p>
            </div>

            {/* 9. California Privacy Rights (CCPA) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                9. CALIFORNIA PRIVACY RIGHTS (CCPA)
              </h2>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA):
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '0', listStyle: 'none' }}>
                {[
                  'Right to know: You have the right to request that we disclose the categories and specific pieces of personal information we have collected about you, the categories of sources from which it was collected, the business purpose for collecting it, and the categories of third parties with whom it has been shared.',
                  'Right to delete: You have the right to request deletion of your personal information, subject to certain exceptions permitted by law.',
                  'Right to opt-out of sale: You have the right to opt out of the "sale" of your personal information. However, we do not sell your personal information to any third party, and we have not done so in the preceding 12 months.',
                  'Right to non-discrimination: We will not discriminate against you for exercising any of your CCPA rights. You will not receive different pricing, quality of service, or access to features based on your exercise of privacy rights.',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <span style={{ color: '#FF0000', marginTop: '6px', fontSize: '8px', flexShrink: 0 }}>&#9679;</span>
                    <span style={{ fontSize: '15px', color: '#999999', lineHeight: 1.7, fontFamily: 'var(--font-space-mono), monospace' }}>{item}</span>
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                Categories of personal information we collect under CCPA definitions include: identifiers (email address, gamertag, IP address), internet or other electronic network activity information (browsing history within the Service, interaction data), and approximate geolocation data (derived from IP address at a regional level only). We do not collect sensitive personal information as defined under the CPRA.
              </p>
            </div>

            {/* 10. European Privacy Rights (GDPR) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                10. EUROPEAN PRIVACY RIGHTS (GDPR)
              </h2>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                If you are located in the European Economic Area (EEA), the United Kingdom, or Switzerland, you are entitled to the rights granted under the General Data Protection Regulation (GDPR) and applicable local data protection laws.
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '0', listStyle: 'none' }}>
                {[
                  'Data controller: Nimbus Studio is the data controller responsible for your personal data as processed through the Service.',
                  'Legal basis for processing: As described in Section 2 of this Policy, we process your data based on consent, contractual necessity, legitimate interests, and legal obligations.',
                  'Your rights under Articles 15 through 22 of the GDPR: You have the right to access, rectification, erasure ("right to be forgotten"), restriction of processing, data portability, and the right to object to processing. These rights apply in addition to those described in Section 8.',
                  'Right to lodge a complaint: You have the right to lodge a complaint with your local data protection supervisory authority if you believe our processing of your personal data violates applicable law.',
                  'International data transfers: Where your data is transferred outside the EEA, we ensure appropriate safeguards are in place, including standard contractual clauses approved by the European Commission, to protect your data in accordance with GDPR requirements.',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <span style={{ color: '#FF0000', marginTop: '6px', fontSize: '8px', flexShrink: 0 }}>&#9679;</span>
                    <span style={{ fontSize: '15px', color: '#999999', lineHeight: 1.7, fontFamily: 'var(--font-space-mono), monospace' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 11. Children's Privacy */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                11. CHILDREN&apos;S PRIVACY
              </h2>
              <div style={{
                padding: '24px',
                backgroundColor: 'rgba(255, 0, 0, 0.06)',
                border: '1px solid #FF0000',
              }}>
                <p style={{ fontSize: '15px', color: '#FF0000', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace', fontWeight: 600, marginBottom: '16px' }}>
                  Select Your Poison is a drinking game companion application and is strictly not intended for use by anyone under the age of 21, or the legal drinking age in your jurisdiction, whichever is higher. Access to and use of the Service by minors is expressly prohibited.
                </p>
                <p style={{ fontSize: '15px', color: '#FF0000', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace', fontWeight: 600, marginBottom: '16px' }}>
                  We do not knowingly collect, solicit, or store personal information from anyone under the legal drinking age. In compliance with the Children&apos;s Online Privacy Protection Act (COPPA), we do not knowingly collect personal data from children under the age of 13 under any circumstances.
                </p>
                <p style={{ fontSize: '15px', color: '#FF0000', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace', fontWeight: 600 }}>
                  If we discover or are notified that we have inadvertently collected personal data from a minor, we will take immediate steps to delete that data from our systems and terminate the associated account. If you believe a minor is using the Service, please report it immediately to{' '}
                  <span style={{ textDecoration: 'underline' }}>heyitsnimbus@gmail.com</span>.
                </p>
              </div>
            </div>

            {/* 12. Do Not Track */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                12. DO NOT TRACK
              </h2>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                Some web browsers transmit &quot;Do Not Track&quot; (DNT) signals to websites. As there is currently no universally accepted standard for how online services should respond to DNT signals, the Service does not currently alter its data collection or use practices in response to DNT signals.
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                We will revisit this position and update this Policy if and when a formal industry standard for DNT compliance is established. In the meantime, you may exercise your privacy rights as described in Sections 8, 9, and 10 of this Policy.
              </p>
            </div>

            {/* 13. Changes to This Policy */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                13. CHANGES TO THIS POLICY
              </h2>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or for other operational reasons. When we make changes, we will post the revised Policy on this page and update the &quot;Last updated&quot; date at the bottom.
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                For material changes that significantly affect how we collect, use, or share your personal data, we will provide reasonable advance notice through the Service (such as a prominent notice upon login) or via email to your registered address, where practicable.
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                Your continued use of the Service after the effective date of any revised Policy constitutes your acceptance of the updated terms. If you do not agree with the changes, you must discontinue use of the Service and delete your account.
              </p>
            </div>

            {/* 14. Contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                14. CONTACT
              </h2>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                If you have any questions, concerns, or complaints about this Privacy Policy, our data practices, or your personal data, please contact us at:
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                Privacy inquiries:{' '}
                <span style={{ color: '#FF0000', fontWeight: 600 }}>heyitsnimbus@gmail.com</span>
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                Data rights requests:{' '}
                <span style={{ color: '#FF0000', fontWeight: 600 }}>heyitsnimbus@gmail.com</span>
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                We aim to respond to all legitimate requests within 30 days. In certain circumstances, it may take us longer if your request is particularly complex or you have made multiple requests, in which case we will notify you and keep you informed of our progress.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px clamp(16px, 4vw, 48px)',
        borderTop: '1px solid #333333',
        backgroundColor: '#0A0A0A',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <span style={{ fontSize: '12px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace' }}>
            Last updated: February 2026
          </span>
          <span style={{ fontSize: '12px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace' }}>
            &copy; {new Date().getFullYear()} Select Your Poison. Not affiliated with Riot Games.
          </span>
        </div>
      </footer>
    </main>
  );
}
