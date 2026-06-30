'use client'

import {
    Bar,
    BarChart,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import { Card, CardTitle } from '@/components/atomquest/page-shell'

/* Enterprise-appropriate chart palette: indigo, emerald, amber, red */
const CHART_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444']

type AdminChartsProps = {
    submitPct: number
    approvalPct: number
    achievementData: { name: string; value: number }[]
    managerData: { name: string; approved: number; pending: number }[]
}

const tooltipStyle = {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    fontSize: 12,
    color: '#1e293b',
}

export function AdminCharts({
    submitPct,
    approvalPct,
    achievementData,
    managerData,
}: AdminChartsProps) {
    const progressData = [
        { name: 'Submitted', value: submitPct },
        { name: 'Approved', value: approvalPct },
        { name: 'Remaining', value: Math.max(0, 100 - submitPct) },
    ]

    return (
        <div className="grid gap-4 lg:grid-cols-3">
            <Card>
                <CardTitle>Submission Pipeline</CardTitle>
                <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={progressData} layout="vertical" margin={{ left: 8 }}>
                            <XAxis type="number" domain={[0, 100]} hide />
                            <YAxis
                                type="category"
                                dataKey="name"
                                width={72}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={tooltipStyle}
                                formatter={(v) => [`${Number(v ?? 0)}%`, '']}
                            />
                            <Bar dataKey="value" radius={4}>
                                {progressData.map((_, i) => (
                                    <Cell
                                        key={i}
                                        fill={
                                            i === 0
                                                ? '#f59e0b'
                                                : i === 1
                                                  ? '#10b981'
                                                  : '#e2e8f0'
                                        }
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card>
                <CardTitle>Achievement Distribution</CardTitle>
                <div className="h-52">
                    {achievementData.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center pt-16">
                            No check-in data yet
                        </p>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={achievementData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
                                    paddingAngle={2}
                                >
                                    {achievementData.map((_, i) => (
                                        <Cell
                                            key={i}
                                            fill={CHART_COLORS[i % CHART_COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={tooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </Card>

            <Card>
                <CardTitle>Manager Completion</CardTitle>
                <div className="h-52">
                    {managerData.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center pt-16">
                            No managers in directory
                        </p>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={managerData} margin={{ bottom: 8 }}>
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: '#64748b', fontSize: 11 }}
                                    interval={0}
                                    angle={-20}
                                    textAnchor="end"
                                    height={48}
                                />
                                <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Bar dataKey="approved" stackId="a" fill="#10b981" name="Approved" />
                                <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </Card>
        </div>
    )
}