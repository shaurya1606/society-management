'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { type GoalDraft, UOM_OPTIONS } from '@/lib/atomquest/types'
import type { ThrustAreaOption } from '@/lib/atomquest/types'
import { GOAL_RULES } from '@/services/atomquest/validation'
import { cn } from '@/lib/utils'

type GoalEditorProps = {
    goals: GoalDraft[]
    thrustAreas: ThrustAreaOption[]
    canEdit: boolean
    onUpdate: (index: number, patch: Partial<GoalDraft>) => void
    onRemove?: (index: number) => void
    onAdd?: () => void
    validationErrors?: string[]
}

export function GoalEditor({
    goals,
    thrustAreas,
    canEdit,
    onUpdate,
    onRemove,
    onAdd,
    validationErrors,
}: GoalEditorProps) {
    const totalWeight = goals.reduce((sum, g) => sum + (Number(g.weightage) || 0), 0)
    const weightOk = totalWeight === GOAL_RULES.totalWeightage

    return (
        <div className="space-y-4">
            {/* Weightage bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                    <span
                        className={cn(
                            'text-sm font-semibold',
                            weightOk ? 'text-emerald-700' : 'text-amber-700'
                        )}
                    >
                        Weightage: {totalWeight}% / {GOAL_RULES.totalWeightage}%
                    </span>
                    {weightOk ? (
                        <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 font-medium">
                            ✓ Valid
                        </span>
                    ) : (
                        <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 font-medium">
                            Must equal 100%
                        </span>
                    )}
                </div>
                {canEdit && onAdd && goals.length < GOAL_RULES.maxGoals ? (
                    <button
                        type="button"
                        onClick={onAdd}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                        + Add goal
                    </button>
                ) : null}
            </div>

            {/* Validation errors */}
            {validationErrors && validationErrors.length > 0 ? (
                <ul className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 list-disc pl-8 space-y-1">
                    {validationErrors.map((e) => (
                        <li key={e}>{e}</li>
                    ))}
                </ul>
            ) : null}

            {/* Goal cards */}
            <div className="space-y-3">
                {goals.map((goal, index) => {
                    const locked = goal.isSharedRecipient
                    const titleLocked = locked || !canEdit
                    return (
                        <div
                            key={goal.id ?? index}
                            className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-4"
                        >
                            {/* Goal header */}
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    Goal {index + 1}
                                </span>
                                <div className="flex items-center gap-2">
                                    {locked ? (
                                        <Badge
                                            variant="outline"
                                            className="text-xs border-indigo-200 bg-indigo-50 text-indigo-700"
                                        >
                                            Shared KPI
                                        </Badge>
                                    ) : null}
                                    {locked ? (
                                        <span className="text-xs text-slate-400">
                                            Admin-assigned · title/target read-only
                                        </span>
                                    ) : null}
                                    {canEdit && onRemove && goals.length > 1 && !locked ? (
                                        <button
                                            type="button"
                                            onClick={() => onRemove(index)}
                                            className="text-xs font-medium text-slate-400 hover:text-red-600 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    ) : null}
                                </div>
                            </div>

                            {/* Fields */}
                            <div className="grid gap-3 sm:grid-cols-2">
                                <Field label="Title">
                                    <Input
                                        value={goal.title}
                                        disabled={titleLocked}
                                        placeholder="e.g. Reduce cost by 10%"
                                        onChange={(e) =>
                                            onUpdate(index, { title: e.target.value })
                                        }
                                        className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
                                    />
                                </Field>

                                <Field label="Thrust area">
                                    <select
                                        value={goal.thrustAreaId}
                                        disabled={titleLocked}
                                        onChange={(e) =>
                                            onUpdate(index, { thrustAreaId: e.target.value })
                                        }
                                        className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                                    >
                                        <option value="">Select…</option>
                                        {thrustAreas.map((a) => (
                                            <option key={a.id} value={a.id}>
                                                {a.name}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                <Field label="Unit of measure" className="sm:col-span-2">
                                    <select
                                        value={goal.uomType}
                                        disabled={titleLocked}
                                        onChange={(e) =>
                                            onUpdate(index, {
                                                uomType: e.target.value as GoalDraft['uomType'],
                                            })
                                        }
                                        className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                                    >
                                        {UOM_OPTIONS.map((o) => (
                                            <option key={o.value} value={o.value}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                <Field
                                    label={locked ? 'Target value (read-only)' : 'Target value'}
                                >
                                    <Input
                                        value={goal.targetValue}
                                        disabled={titleLocked}
                                        placeholder="e.g. 95"
                                        onChange={(e) =>
                                            onUpdate(index, { targetValue: e.target.value })
                                        }
                                        className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
                                    />
                                </Field>

                                <Field
                                    label={
                                        locked
                                            ? 'Weightage (%) — you may adjust'
                                            : 'Weightage (%)'
                                    }
                                >
                                    <Input
                                        type="number"
                                        min={10}
                                        max={100}
                                        value={goal.weightage}
                                        disabled={!canEdit}
                                        onChange={(e) =>
                                            onUpdate(index, {
                                                weightage: Number(e.target.value),
                                            })
                                        }
                                        className="bg-white border-slate-200 text-slate-900 focus-visible:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
                                    />
                                </Field>

                                {goal.uomType === 'TIMELINE' ? (
                                    <Field label="Target deadline">
                                        <Input
                                            type="date"
                                            value={goal.targetDeadline}
                                            disabled={titleLocked}
                                            onChange={(e) =>
                                                onUpdate(index, {
                                                    targetDeadline: e.target.value,
                                                })
                                            }
                                            className="bg-white border-slate-200 text-slate-900 focus-visible:ring-indigo-500 disabled:bg-slate-100"
                                        />
                                    </Field>
                                ) : null}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function Field({
    label,
    children,
    className,
}: {
    label: string
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={cn('space-y-1.5', className)}>
            <Label className="text-xs font-medium text-slate-600">{label}</Label>
            {children}
        </div>
    )
}
