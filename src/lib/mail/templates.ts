const brand = {
    name: 'PerformIQ',
    primary: '#4f46e5',
    text: '#1e293b',
    muted: '#64748b',
}

export function enterpriseEmailLayout(body: string) {
    return `<!DOCTYPE html><html><body style="margin:0;font-family:system-ui,sans-serif;background:#f8fafc;color:${brand.text}">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px">
<table width="560" style="background:#fff;border:1px solid #e2e8f0;border-radius:8px">
<tr><td style="padding:20px 24px;border-bottom:1px solid #e2e8f0">
<strong style="color:${brand.primary}">${brand.name}</strong>
</td></tr>
<tr><td style="padding:24px">${body}</td></tr>
</table></td></tr></table></body></html>`
}

export function goalSubmittedEmail(input: {
    employeeName: string
    link: string
}) {
    return {
        subject: `Goals submitted — ${input.employeeName}`,
        html: enterpriseEmailLayout(
            `<p><strong>${input.employeeName}</strong> submitted their goal sheet.</p>
<p><a href="${input.link}" style="color:${brand.primary}">Review in team dashboard</a></p>`
        ),
        text: `${input.employeeName} submitted goals. Review: ${input.link}`,
    }
}
