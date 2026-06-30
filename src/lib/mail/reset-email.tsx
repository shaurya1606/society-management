interface ResetEmailTemplateProps {
    userName: string
    resetLink: string
}

export function ResetEmailTemplate({
    userName,
    resetLink,
}: ResetEmailTemplateProps) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                                LetsKraack
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px; font-weight: 600;">
                                Reset Your Password
                            </h2>
                            
                            <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                Hi ${userName},
                            </p>
                            
                            <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                We received a request to reset your password for your LetsKraack account. 
                                Don't worry, we're here to help you get back on track!
                            </p>
                            
                            <p style="margin: 0 0 30px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                Click the button below to create a new password:
                            </p>
                            
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 0 0 30px 0;">
                                        <a href="${resetLink}" 
                                           style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.4);">
                                            Reset My Password
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                Or copy and paste this link into your browser:
                            </p>
                            
                            <p style="margin: 0 0 30px 0; padding: 12px; background-color: #f8f9fa; border-radius: 4px; word-break: break-all;">
                                <a href="${resetLink}" style="color: #667eea; text-decoration: none; font-size: 14px;">
                                    ${resetLink}
                                </a>
                            </p>
                            
                            <!-- Security Notice -->
                            <div style="margin: 30px 0; padding: 16px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                                <p style="margin: 0 0 8px 0; color: #856404; font-size: 14px; font-weight: 600;">
                                    🔒 Security Tips
                                </p>
                                <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                                    This password reset link will expire in 1 hour for your security.
                                    Never share this link with anyone.
                                </p>
                            </div>
                            
                            <p style="margin: 0 0 10px 0; color: #999999; font-size: 14px; line-height: 1.6;">
                                If you didn't request a password reset, please ignore this email or contact our support team if you have concerns.
                            </p>
                            
                            <p style="margin: 0; color: #999999; font-size: 14px; line-height: 1.6;">
                                Your account security is important to us.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px 30px; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px; text-align: center;">
                                Need help? Contact us at 
                                <a href="mailto:support@letskraack.com" style="color: #667eea; text-decoration: none;">
                                    support@letskraack.com
                                </a>
                            </p>
                            
                            <p style="margin: 0; color: #999999; font-size: 12px; text-align: center;">
                                © ${new Date().getFullYear()} LetsKraack. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim()
}

export const ResetEmailText = (userName: string, resetLink: string) => {
    return `
Hi ${userName},

We received a request to reset your password for your LetsKraack account.

Click the link below to create a new password:

${resetLink}

🔒 SECURITY NOTICE:
- This password reset link will expire in 1 hour for your security
- Never share this link with anyone
- If you didn't request this reset, please ignore this email

Need help? Contact us at support@letskraack.com

© ${new Date().getFullYear()} LetsKraack. All rights reserved.
    `.trim()
}
