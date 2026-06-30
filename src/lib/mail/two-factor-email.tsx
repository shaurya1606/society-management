export const TwoFactorEmailTemplate = ({
    userName,
    token,
}: {
    userName: string
    token: string
}) => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Your Two-Factor Code</title>
    <style>
      body { font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; background: #f7fafc; color: #0f172a; margin:0; }
      .card { background: #ffffff; border-radius: 12px; max-width: 520px; margin: 36px auto; padding: 28px; box-shadow: 0 6px 24px rgba(2,6,23,0.08); }
      .logo { font-weight: 700; color:#111827; text-decoration:none; }
      .code { display:inline-block; padding: 14px 20px; font-weight:700; letter-spacing: 3px; font-size: 22px; background: linear-gradient(90deg,#111827,#1f2937); color: #fff; border-radius: 8px; }
      .muted { color: #6b7280; font-size: 13px; }
      a.button { display:inline-block; padding:10px 16px; background:#111827; color:#fff; border-radius:8px; text-decoration:none; }
    </style>
  </head>
  <body>
    <div class="card">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://localhost:3000'}" class="logo">LetsKraack</a>
      <h2>Hello ${userName},</h2>
      <p class="muted">Use the code below to complete your two-factor authentication. It will expire in 5 minutes.</p>
      <p><span class="code">${token}</span></p>
      <p class="muted">If you did not request this code, you can safely ignore this email or reset your account security.</p>
      <hr />
      <p class="muted">Thanks — The LetsKraack Team</p>
    </div>
  </body>
</html>
`

export const TwoFactorEmailText = (userName: string, token: string) =>
    `Hello ${userName},\n\nUse the code below to complete your two-factor authentication. It will expire in 5 minutes.\n\n${token}\n\nIf you did not request this code, ignore this email.\n\n— LetsKraack Team`
