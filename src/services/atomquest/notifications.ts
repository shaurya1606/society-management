import { Resend } from 'resend'

const DOMAIN = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const FROM = process.env.ATOMQUEST_EMAIL_FROM || 'AtomQuest <onboarding@resend.dev>'

type EmailPayload = {
    to: string
    subject: string
    html: string
    text: string
}

async function deliver(payload: EmailPayload) {
    if (!process.env.RESEND_API_KEY) {
        console.log('[AtomQuest email — no RESEND_API_KEY]', {
            to: payload.to,
            subject: payload.subject,
            text: payload.text,
        })
        return { sent: false, logged: true }
    }

    try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        const { error } = await resend.emails.send({
            from: FROM,
            to: payload.to,
            subject: payload.subject,
            html: payload.html,
            text: payload.text,
        })
        if (error) {
            console.error('[AtomQuest email error]', error)
            return { sent: false, logged: false }
        }
        return { sent: true, logged: false }
    } catch (e) {
        console.error('[AtomQuest email failed]', e)
        return { sent: false, logged: false }
    }
}

export async function notifyGoalSubmitted(input: {
    employeeName: string
    employeeEmail: string
    managerEmail: string
}) {
    const link = `${DOMAIN}/team`
    return deliver({
        to: input.managerEmail,
        subject: `Goals submitted — ${input.employeeName}`,
        html: `<p><strong>${input.employeeName}</strong> submitted their goal sheet for review.</p><p><a href="${link}">Open team dashboard</a></p>`,
        text: `${input.employeeName} submitted goals. Review at ${link}`,
    })
}

export async function notifyGoalApproved(input: {
    employeeName: string
    employeeEmail: string
}) {
    const link = `${DOMAIN}/goals`
    return deliver({
        to: input.employeeEmail,
        subject: 'Your goals have been approved',
        html: `<p>Hi ${input.employeeName}, your goal sheet is <strong>approved and locked</strong>.</p><p><a href="${link}">View goals</a></p>`,
        text: `Your goals are approved. View at ${link}`,
    })
}

export async function notifyGoalReturned(input: {
    employeeName: string
    employeeEmail: string
    reason: string
}) {
    const link = `${DOMAIN}/goals`
    return deliver({
        to: input.employeeEmail,
        subject: 'Your goals were returned for revision',
        html: `<p>Hi ${input.employeeName}, your manager returned your goal sheet.</p><p><strong>Feedback:</strong> ${input.reason}</p><p><a href="${link}">Revise goals</a></p>`,
        text: `Goals returned: ${input.reason}. Revise at ${link}`,
    })
}
