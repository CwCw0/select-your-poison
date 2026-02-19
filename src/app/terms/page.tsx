import type { Metadata } from 'next';
import Link from 'next/link';
import { Skull, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | SELECT YOUR POISON',
};

export default function TermsPage() {
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
            TERMS OF SERVICE
          </h1>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '0 0 120px', backgroundColor: '#0C0C0C' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 48px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>

            {/* 1. Acceptance of Terms */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                1. ACCEPTANCE OF TERMS
              </h2>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                By accessing, browsing, or using Select Your Poison (&quot;SYP,&quot; &quot;the Service,&quot; &quot;we,&quot; &quot;us,&quot; &quot;our&quot;), operated by Nimbus Studio (&quot;Nimbus&quot;), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service (&quot;Terms&quot;) and our Privacy Policy. These Terms constitute a legally binding agreement between you (&quot;User,&quot; &quot;you,&quot; &quot;your&quot;) and Nimbus Studio.
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                Your electronic acceptance of these Terms, whether by creating an account, clicking &quot;I Agree,&quot; or simply accessing and using the Service, is intended to have the same legal force and effect as a handwritten signature. If you do not agree to all of these Terms in their entirety, you must immediately cease all use of the Service.
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                We reserve the right to update or modify these Terms at any time. Your continued use of the Service following the posting of any modifications constitutes your binding acceptance of such changes. It is your responsibility to review these Terms periodically for updates.
              </p>
            </div>

            {/* 2. Eligibility & Age Requirement */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                2. ELIGIBILITY &amp; AGE REQUIREMENT
              </h2>
              <div style={{
                padding: '24px',
                backgroundColor: 'rgba(255, 0, 0, 0.06)',
                border: '1px solid #FF0000',
              }}>
                <p style={{ fontSize: '15px', color: '#FF0000', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace', fontWeight: 600 }}>
                  You must be at least twenty-one (21) years of age, or the legal drinking age in your jurisdiction, whichever is higher, to access or use this Service. By using SYP, you represent and warrant that you meet or exceed this minimum age requirement. This Service is not intended for, and shall not be used by, minors under any circumstance.
                </p>
              </div>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                By creating an account or using the Service, you affirmatively represent and warrant that: (a) you are at least 21 years of age or the legal drinking age in your jurisdiction, whichever is higher; (b) you have the legal capacity to enter into a binding agreement; and (c) your use of the Service does not violate any applicable law or regulation.
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                We reserve the right to request proof of age at any time and in any form we deem acceptable. If we discover or reasonably believe that a User is under the minimum age requirement, we may immediately terminate or suspend that User&apos;s account and access to the Service without prior notice and without liability. Any use of the Service by individuals who do not meet the age requirement is strictly unauthorized and constitutes a violation of these Terms.
              </p>
            </div>

            {/* 3. Description of Service */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                3. DESCRIPTION OF SERVICE
              </h2>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                Select Your Poison is a web-based entertainment companion tool designed for use alongside the video game VALORANT. The Service provides drinking game rules, strat roulette challenges, game session tracking, and lobby management features intended for entertainment purposes among adults of legal drinking age.
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                SYP is strictly a companion entertainment tool. The Service does NOT sell, distribute, deliver, or otherwise provide alcoholic beverages of any kind. SYP does NOT function as, nor should it be construed as, a gambling service, betting platform, or any form of wagering system. All features within the Service are designed purely for social entertainment among consenting adults. All decisions regarding alcohol consumption are made solely and independently by the User at their own discretion and risk.
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.
              </p>
            </div>

            {/* 4. Account Registration & Security */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                4. ACCOUNT REGISTRATION &amp; SECURITY
              </h2>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                To access certain features of the Service, you may be required to create an account. When registering, you agree to provide accurate, current, and complete information and to update such information to keep it accurate, current, and complete. Each individual is permitted only one (1) account. Creating multiple accounts may result in the termination of all associated accounts.
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                You are solely responsible for maintaining the confidentiality and security of your account credentials, including your password. You agree not to share your login credentials with any third party. You are fully responsible for all activities that occur under your account, whether or not authorized by you.
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                You must notify us immediately at heyitsnimbus@gmail.com if you become aware of or suspect any unauthorized access to or use of your account. We reserve the right to suspend or terminate your account at our sole discretion if we determine, or reasonably believe, that your account has been compromised or that you have violated any provision of these Terms.
              </p>
            </div>

            {/* 5. User Conduct & Responsibilities */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                5. USER CONDUCT &amp; RESPONSIBILITIES
              </h2>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                By using this Service, you acknowledge and agree to the following:
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '0', listStyle: 'none' }}>
                {[
                  'Drink responsibly and know your personal limits at all times.',
                  'Never drink and drive. Always arrange safe transportation before beginning any session.',
                  'Never pressure, coerce, or encourage others to drink beyond their comfort level or capacity.',
                  'Stay hydrated and consume food before and during drinking sessions.',
                  'Stop drinking immediately if you feel unwell, intoxicated, or otherwise impaired.',
                  'Non-alcoholic beverages may be substituted at any time, for any reason, without penalty or restriction. SYP fully supports and encourages non-alcoholic participation.',
                  'You are solely and exclusively responsible for your own alcohol consumption, behavior, and any consequences arising therefrom.',
                  'You shall not use the Service in violation of any applicable local, state, national, or international laws or regulations.',
                  'You shall not attempt to circumvent, disable, or otherwise interfere with any security features, access controls, or technical limitations of the Service.',
                  'You shall not use the Service to harass, abuse, threaten, or harm other Users or any third party.',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <span style={{ color: '#FF0000', marginTop: '6px', fontSize: '8px', flexShrink: 0 }}>&#9679;</span>
                    <span style={{ fontSize: '15px', color: '#999999', lineHeight: 1.7, fontFamily: 'var(--font-space-mono), monospace' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 6. Assumption of Risk */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                6. ASSUMPTION OF RISK
              </h2>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                You expressly acknowledge, understand, and assume ALL risks associated with the consumption of alcoholic beverages, including but not limited to: impaired judgment and motor function, health complications, alcohol poisoning, addiction, personal injury, property damage, and death. You voluntarily and knowingly assume each of these risks and accept full personal responsibility for any and all consequences of your decision to consume alcohol in connection with the use of this Service.
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                Select Your Poison is an entertainment tool only. The Service does not control, encourage, compel, or otherwise influence your decision to consume alcohol. Any prompts, rules, challenges, or suggestions presented within the Service are for entertainment purposes only and do not constitute directives, commands, or requirements. You make your own independent, voluntary decisions about whether and how much alcohol to consume. The Service bears no responsibility for those decisions or their outcomes.
              </p>
            </div>

            {/* 7. Disclaimer of Liability */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                7. DISCLAIMER OF LIABILITY
              </h2>
              <div style={{
                padding: '24px',
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid #F59E0B',
              }}>
                <p style={{ fontSize: '15px', color: '#F59E0B', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace', fontWeight: 600 }}>
                  THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. SELECT YOUR POISON, NIMBUS STUDIO, AND THEIR RESPECTIVE CREATORS, OWNERS, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AFFILIATES, AND LICENSORS (COLLECTIVELY, &quot;THE SYP PARTIES&quot;) MAKE NO WARRANTY THAT THE SERVICE WILL MEET YOUR REQUIREMENTS, BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE.
                </p>
              </div>
              <div style={{
                padding: '24px',
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid #F59E0B',
                marginTop: '8px',
              }}>
                <p style={{ fontSize: '15px', color: '#F59E0B', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace', fontWeight: 600 }}>
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE SYP PARTIES SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, EXEMPLARY, OR PUNITIVE DAMAGES OF ANY KIND, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF, OR INABILITY TO USE, THE SERVICE, OR ANY ALCOHOL CONSUMPTION RELATED TO OR ASSOCIATED WITH YOUR USE OF THE SERVICE. THIS INCLUDES, WITHOUT LIMITATION, DAMAGES FOR: PERSONAL INJURY, BODILY HARM, OR DEATH; PROPERTY DAMAGE; HEALTH COMPLICATIONS OR MEDICAL EXPENSES; IMPAIRED JUDGMENT OR DECISION-MAKING; LOSS OF DATA, INCOME, OR PROFITS; EMOTIONAL DISTRESS; OR ANY OTHER HARM OR LOSS WHATSOEVER, REGARDLESS OF WHETHER SUCH DAMAGES ARE BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, OR ANY OTHER LEGAL THEORY, AND REGARDLESS OF WHETHER THE SYP PARTIES HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                </p>
              </div>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                To the extent that any jurisdiction does not allow the exclusion or limitation of certain warranties or damages, the above limitations shall apply to the fullest extent permitted by applicable law. In no event shall the total aggregate liability of the SYP Parties exceed the total amount actually paid by you to SYP for use of the Service during the twelve (12) months preceding the claim, which, for a free service, is zero dollars ($0.00 USD).
              </p>
            </div>

            {/* 8. Indemnification */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                8. INDEMNIFICATION
              </h2>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                You agree to indemnify, defend, and hold harmless Select Your Poison, Nimbus Studio, and their respective creators, owners, officers, directors, employees, agents, affiliates, successors, and assigns (collectively, the &quot;Indemnified Parties&quot;) from and against any and all claims, demands, actions, suits, proceedings, damages, losses, liabilities, costs, and expenses (including reasonable attorneys&apos; fees and court costs) arising out of or relating to:
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '0', listStyle: 'none' }}>
                {[
                  'Your access to or use of the Service;',
                  'Your violation of these Terms or any applicable law, rule, or regulation;',
                  'Your consumption of alcohol, whether before, during, or after use of the Service;',
                  'Any harm, injury, damage, or loss caused to yourself or any third party as a result of your use of the Service or your alcohol consumption;',
                  'Your violation of any rights of a third party, including but not limited to intellectual property rights, privacy rights, or publicity rights;',
                  'Any content you submit, post, or transmit through the Service.',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <span style={{ color: '#FF0000', marginTop: '6px', fontSize: '8px', flexShrink: 0 }}>&#9679;</span>
                    <span style={{ fontSize: '15px', color: '#999999', lineHeight: 1.7, fontFamily: 'var(--font-space-mono), monospace' }}>{item}</span>
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                This indemnification obligation shall survive the termination of these Terms and your use of the Service.
              </p>
            </div>

            {/* 9. Third-Party Trademarks & Intellectual Property */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                9. THIRD-PARTY TRADEMARKS &amp; INTELLECTUAL PROPERTY
              </h2>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                Select Your Poison is NOT affiliated with, endorsed by, sponsored by, or in any way officially connected to Riot Games, Inc. or any of its subsidiaries or affiliates. VALORANT, Riot Games, and all related trademarks, service marks, trade names, logos, domain names, and other distinctive brand features are the sole property of Riot Games, Inc. All references to VALORANT and related game elements within the Service are used strictly for identification and descriptive purposes only and do not imply any endorsement, sponsorship, or affiliation.
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                All other third-party game-related names, logos, brands, and trademarks referenced within this Service are the property of their respective owners and are used for identification purposes only. Use of such marks does not imply any affiliation with or endorsement by those owners.
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                All original content, features, functionality, visual design, user interface, source code, and branding associated with Select Your Poison (excluding third-party trademarks as noted above) are and shall remain the exclusive intellectual property of Nimbus Studio. This includes, without limitation, all text, graphics, logos, icons, images, audio, software, and the compilation thereof. You may not copy, reproduce, modify, distribute, transmit, display, publish, sell, license, or create derivative works from any part of the Service or its content without the prior written consent of Nimbus Studio.
              </p>
            </div>

            {/* 10. User-Generated Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                10. USER-GENERATED CONTENT
              </h2>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                The Service may allow you to submit, post, or display certain content, including but not limited to gamertags, display names, in-game identifiers, and other user-provided information (&quot;User Content&quot;). You retain ownership of your User Content, subject to the license granted herein.
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                By submitting User Content to the Service, you grant SYP and Nimbus Studio a non-exclusive, worldwide, royalty-free, sublicensable, and transferable license to use, reproduce, display, distribute, and process your User Content solely in connection with operating and providing the Service. This license exists only for as long as your User Content remains on the Service and terminates upon deletion of such content, except to the extent that such content has been shared with others and they have not deleted it.
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                You represent and warrant that you have all rights necessary to grant the above license and that your User Content does not infringe upon the rights of any third party. We reserve the right, but have no obligation, to review, monitor, edit, or remove any User Content at our sole discretion, including content that we determine violates these Terms, is objectionable, or may expose the SYP Parties to liability.
              </p>
            </div>

            {/* 11. Limitation of Liability & Dispute Resolution */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                11. LIMITATION OF LIABILITY &amp; DISPUTE RESOLUTION
              </h2>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                Any dispute, controversy, or claim arising out of or relating to these Terms, or the breach, termination, or invalidity thereof, shall be resolved through final and binding arbitration, rather than in court. Arbitration shall be conducted in accordance with the applicable rules of the American Arbitration Association (AAA) or a comparable arbitration body in the relevant jurisdiction.
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                You agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action. You hereby waive the right to participate in a class action lawsuit or class-wide arbitration against the SYP Parties. If this class action waiver is found to be unenforceable, then the entirety of this arbitration provision shall be null and void.
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                Each party shall bear its own costs and expenses (including attorneys&apos; fees) incurred in connection with any arbitration proceeding, unless the arbitrator determines that the circumstances warrant a different allocation.
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                These Terms and any dispute arising hereunder shall be governed by and construed in accordance with the laws of the United States and the state in which Nimbus Studio is registered, without regard to its conflict of laws principles.
              </p>
            </div>

            {/* 12. Termination */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                12. TERMINATION
              </h2>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                We may terminate or suspend your account and access to the Service, in whole or in part, at any time, with or without cause, and with or without prior notice, at our sole discretion. Without limiting the foregoing, grounds for termination may include, but are not limited to: violations of these Terms, requests by law enforcement or government agencies, unexpected technical or security issues, extended periods of inactivity, or conduct that we believe is harmful to other Users, third parties, or the Service.
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                You may terminate your account at any time by contacting us at heyitsnimbus@gmail.com or through any account deletion mechanism provided within the Service. Upon termination of your account, whether initiated by you or by us, your right and license to use the Service shall cease immediately.
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                The following sections of these Terms shall survive any termination or expiration of your account or these Terms: Assumption of Risk, Disclaimer of Liability, Indemnification, Limitation of Liability &amp; Dispute Resolution, Third-Party Trademarks &amp; Intellectual Property, and any other provisions that by their nature are intended to survive termination.
              </p>
            </div>

            {/* 13. Modifications to Terms */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                13. MODIFICATIONS TO TERMS
              </h2>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                We reserve the right, at our sole discretion, to modify, amend, or replace these Terms at any time. When changes are made, we will update the &quot;Last updated&quot; date at the bottom of this page. Your continued use of the Service after any such modifications are posted shall constitute your acknowledgment of the modified Terms and your agreement to abide and be bound by them.
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                For material changes that substantially affect your rights or obligations under these Terms, we will make reasonable efforts to provide notice, which may include posting a prominent notice within the Service, sending a notification to the email address associated with your account, or other means we deem appropriate. However, it is ultimately your responsibility to review these Terms periodically for changes.
              </p>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                If you do not agree to the revised Terms, you must stop using the Service. Your continued use of the Service following the effective date of any revised Terms constitutes your acceptance of and agreement to those changes.
              </p>
            </div>

            {/* 14. Contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
                14. CONTACT
              </h2>
              <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace' }}>
                If you have any questions, concerns, or requests regarding these Terms of Service, please contact us at:
              </p>
              <p style={{ fontSize: '15px', color: '#FF0000', lineHeight: 1.9, fontFamily: 'var(--font-space-mono), monospace', fontWeight: 600 }}>
                heyitsnimbus@gmail.com
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
