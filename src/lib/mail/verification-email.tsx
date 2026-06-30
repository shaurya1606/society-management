interface VerificationEmailProps {
    userName: string
    verificationLink: string
}

export const VerificationEmailTemplate = ({
    userName,
    verificationLink,
}: VerificationEmailProps) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
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
                                Verify Your Email Address
                            </h2>
                            
                            <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                Hi ${userName},
                            </p>
                            
                            <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                Thank you for signing up with LetsKraack! We're excited to have you on board. 
                                To complete your registration and start using our platform, please verify your email address.
                            </p>
                            
                            <p style="margin: 0 0 30px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                Click the button below to verify your email:
                            </p>
                            
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 0 0 30px 0;">
                                        <a href="${verificationLink}" 
                                           style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.4);">
                                            Verify Email Address
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                Or copy and paste this link into your browser:
                            </p>
                            
                            <p style="margin: 0 0 30px 0; padding: 12px; background-color: #f8f9fa; border-radius: 4px; word-break: break-all;">
                                <a href="${verificationLink}" style="color: #667eea; text-decoration: none; font-size: 14px;">
                                    ${verificationLink}
                                </a>
                            </p>
                            
                            <p style="margin: 0 0 10px 0; color: #999999; font-size: 14px; line-height: 1.6;">
                                This verification link will expire in 24 hours for security reasons.
                            </p>
                            
                            <p style="margin: 0; color: #999999; font-size: 14px; line-height: 1.6;">
                                If you didn't create an account with LetsKraack, please ignore this email.
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

// Plain text version for email clients that don't support HTML
export const VerificationEmailText = (
    userName: string,
    verificationLink: string
) => {
    return `
Hi ${userName},

Thank you for signing up with LetsKraack!

To complete your registration, please verify your email address by clicking the link below:

${verificationLink}

This verification link will expire in 24 hours for security reasons.

If you didn't create an account with LetsKraack, please ignore this email.

Need help? Contact us at support@letskraack.com

© ${new Date().getFullYear()} LetsKraack. All rights reserved.
    `.trim()
}
