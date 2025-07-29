import { htmlTemplate } from './html-template'

export const paymentReceivedBody = ({
  username,
  orderNumber,
}: {
  username: string
  orderNumber: string
}) => {
  return htmlTemplate({
    body: `
      <div class="wrapper">
        <header class="header">
          <img style="width: 696px; height: 110px" src="https://trendelladigital.com/images/email/header.png" alt="full-logo" class="logo" />
        </header>
        <div class="main">
          <p style="font-size: 24px; color: #0D0D0D;">Hi, ${username}</p>
          <p class="text">We’ve received your payment for Order ${orderNumber} — thank you! Your service is now officially confirmed, and we’re ready to begin.</p>
          <p class="text">Within the next [24–48 hours], a member of our team will reach out to schedule your kickoff or share access to your onboarding materials. Depending on your selected service, you may receive documents, a client portal link, or pre-work to help us tailor the experience to your goals.</p>
          <p class="text">If you have any initial context to share — goals, current challenges, or priorities — feel free to reply directly to this email. The more we understand your vision upfront, the more precisely we can serve you.</p>
          <p class="text">We’re excited to work alongside you and help bring your next chapter of business growth to life — with clarity, structure, and real momentum.</p>
          <p class="text" style="font-size: 18px;">Talk soon,<br /><strong style="font-weight: 700;">The Trendella Digital Team</strong></p>
        </div>
        <footer>
          <img style="width: 696px; height: 110px" src="https://trendelladigital.com/images/email/footer.png" alt="full-logo" class="logoSm" />
        </footer>
      </div>
    `,
    style: `
      .wrapper {
        padding: 8px;
        width: 696px;
        margin: 0 auto;
        background: #ffffff;
      }
      
      .main {
        padding: 40px;
        border-radius: 12px;
        background: #FDFDFD;
      }
      
      .header {
        overflow: hidden;
      }
      
      .strong {
        font-weight: 600;
        color: #000;
      }
      
      .title {
        color: #000;
        font-feature-settings: 'liga' off, 'clig' off;
        font-size: 28px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
      }
       
      .heading {
        color: #000;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
      }
       
      .text {
        margin-top: 24px;
        color: #0D0D0D;
        font-size: 14px;
      }
      
      .logo {
        width: 159px;
        height: 40px;
      }
      
      .logoSm {
        width: 157px;
        height: 40px;
      }
      
      .footer {
        display: flex;
        border-radius: 12px;
        background: #FFE6E0;
        padding: 20px;
      }
    `,
  })
}
