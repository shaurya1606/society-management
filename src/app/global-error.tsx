'use client'
import Image from 'next/image'
// global-error must include html and body tags — it replaces the entire root layout

import Link from 'next/link'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    console.error(error)

    return (
        <html lang="en">
            <head>
                <title>
                    Something went wrong — Society Maintenance Tracker
                </title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <style>{`
                    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                    body {
                        font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
                        background-color: #f8fafc;
                        color: #0f172a;
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 2rem;
                        -webkit-font-smoothing: antialiased;
                    }
                    .card {
                        background: #ffffff;
                        border: 1px solid #e2e8f0;
                        border-radius: 16px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.06);
                        padding: 2.5rem 3rem;
                        text-align: center;
                        max-width: 480px;
                        width: 100%;
                    }
                    .icon-wrap {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        width: 56px;
                        height: 56px;
                        border-radius: 50%;
                        background: #fef2f2;
                        border: 1px solid #fecaca;
                        margin-bottom: 1.5rem;
                    }
                    .icon-wrap svg {
                        width: 24px;
                        height: 24px;
                        stroke: #dc2626;
                        fill: none;
                        stroke-width: 2;
                        stroke-linecap: round;
                        stroke-linejoin: round;
                    }
                    .logo {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        margin-bottom: 2rem;
                    }
                    .logo-icon {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 28px;
                        height: 28px;
                        border-radius: 8px;
                        background: #4f46e5;
                        color: #fff;
                        font-size: 11px;
                        font-weight: 700;
                    }
                    .logo-name {
                        font-size: 14px;
                        font-weight: 600;
                        color: #0f172a;
                        letter-spacing: -0.01em;
                    }
                    h1 {
                        font-size: 18px;
                        font-weight: 600;
                        color: #0f172a;
                        margin-bottom: 0.5rem;
                    }
                    p {
                        font-size: 14px;
                        color: #64748b;
                        line-height: 1.6;
                        margin-bottom: 0.75rem;
                    }
                    .digest {
                        font-family: ui-monospace, 'SF Mono', monospace;
                        font-size: 11px;
                        color: #94a3b8;
                        background: #f1f5f9;
                        border: 1px solid #e2e8f0;
                        border-radius: 6px;
                        padding: 4px 10px;
                        display: inline-block;
                        margin-bottom: 1.75rem;
                    }
                    .actions {
                        display: flex;
                        gap: 10px;
                        justify-content: center;
                        flex-wrap: wrap;
                    }
                    .btn-primary {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        height: 38px;
                        padding: 0 20px;
                        border-radius: 8px;
                        background: #4f46e5;
                        color: #fff;
                        font-size: 13px;
                        font-weight: 600;
                        border: none;
                        cursor: pointer;
                        text-decoration: none;
                        transition: background 0.15s;
                    }
                    .btn-primary:hover { background: #4338ca; }
                    .btn-secondary {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        height: 38px;
                        padding: 0 20px;
                        border-radius: 8px;
                        background: #fff;
                        color: #475569;
                        font-size: 13px;
                        font-weight: 500;
                        border: 1px solid #e2e8f0;
                        cursor: pointer;
                        text-decoration: none;
                        transition: background 0.15s, border-color 0.15s;
                    }
                    .btn-secondary:hover { background: #f8fafc; border-color: #cbd5e1; }
                    .divider {
                        height: 1px;
                        background: #f1f5f9;
                        margin: 1.75rem 0;
                    }
                    .footer-text {
                        font-size: 12px;
                        color: #94a3b8;
                    }
                `}</style>
            </head>
            <body>
                <div
                    className="card"
                    style={{
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 16,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        padding: '2.5rem 3rem',
                        textAlign: 'center',
                        maxWidth: 480,
                        width: '100%',
                    }}
                >
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            marginBottom: '2rem',
                        }}
                    >
                        <Image
                            src="/logo.jpg"
                            alt="Society Maintenance Tracker"
                            width={28}
                            height={28}
                            style={{
                                borderRadius: 8,
                                objectFit: 'contain',
                                display: 'block',
                            }}
                        />
                        <span
                            style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: '#0f172a',
                            }}
                        >
                            Society Maintenance Tracker
                        </span>
                    </div>

                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            marginBottom: '1.5rem',
                        }}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            style={{
                                width: 24,
                                height: 24,
                                stroke: '#dc2626',
                                fill: 'none',
                                strokeWidth: 2,
                                strokeLinecap: 'round',
                                strokeLinejoin: 'round',
                            }}
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>

                    <h1
                        style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: '#0f172a',
                            marginBottom: '0.5rem',
                        }}
                    >
                        Something went wrong
                    </h1>
                    <p
                        style={{
                            fontSize: 14,
                            color: '#64748b',
                            lineHeight: 1.6,
                            marginBottom: '0.75rem',
                        }}
                    >
                        An unexpected error occurred in the application. The
                        engineering team has been notified.
                    </p>

                    {error.digest ? (
                        <span
                            style={{
                                fontFamily: 'ui-monospace, monospace',
                                fontSize: 11,
                                color: '#94a3b8',
                                background: '#f1f5f9',
                                border: '1px solid #e2e8f0',
                                borderRadius: 6,
                                padding: '4px 10px',
                                display: 'inline-block',
                                marginBottom: '1.75rem',
                            }}
                        >
                            Error ID: {error.digest}
                        </span>
                    ) : (
                        <div style={{ marginBottom: '1.75rem' }} />
                    )}

                    <div
                        style={{
                            display: 'flex',
                            gap: 10,
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                        }}
                    >
                        <button
                            onClick={() => reset()}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 38,
                                padding: '0 20px',
                                borderRadius: 8,
                                background: '#4f46e5',
                                color: '#fff',
                                fontSize: 13,
                                fontWeight: 600,
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            Try again
                        </button>
                        <Link
                            href="/"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 38,
                                padding: '0 20px',
                                borderRadius: 8,
                                background: '#fff',
                                color: '#475569',
                                fontSize: 13,
                                fontWeight: 500,
                                border: '1px solid #e2e8f0',
                                textDecoration: 'none',
                            }}
                        >
                            Go home
                        </Link>
                    </div>

                    <div
                        style={{
                            height: 1,
                            background: '#f1f5f9',
                            margin: '1.75rem 0',
                        }}
                    />
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                        Society Maintenance Tracker · Resident complaint
                        tracking
                    </p>
                </div>
            </body>
        </html>
    )
}
