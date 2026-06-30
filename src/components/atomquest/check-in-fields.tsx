'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ACHIEVEMENT_OPTIONS } from '@/lib/atomquest/types'
import { UomType } from '@/lib/dbconfig/atomquest'
import { cn } from '@/lib/utils'

export type CheckInRow = {
    actualValue: string
    actualCompletionDate: string
    achievementStatus: string
    notes: string
}

type CheckInFieldsProps = {
    uomType: UomType
    row: CheckInRow
    progressScore?: string | null
    disabled?: boolean
    onChange: (patch: Partial<CheckInRow>) => void
}

const fieldClass =
    'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-400'

const selectClass =
    'flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed'

export function CheckInFields({
    uomType,
    row,
    progressScore,
    disabled = false,
    onChange,
}: CheckInFieldsProps) {
    const scoreNum = progressScore ? Number(progressScore) : null
    const showBar =
        scoreNum !== null && Number.isFinite(scoreNum) && scoreNum > 0

    return (
        <div className="space-y-3">
            {uomType === UomType.TIMELINE ? (
                <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-slate-600">
                        Actual completion date
                    </Label>
                    <Input
                        type="date"
                        value={row.actualCompletionDate}
                        onChange={(e) =>
                            onChange({ actualCompletionDate: e.target.value })
                        }
                        className={fieldClass}
                        disabled={disabled}
                    />
                </div>
            ) : uomType === UomType.ZERO_BASED ? (
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={row.actualValue === '0'}
                        disabled={disabled}
                        onChange={(e) =>
                            onChange({ actualValue: e.target.checked ? '0' : '1' })
                        }
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                    />
                    <Label className="text-sm text-slate-700">
                        Zero-defect target met (no defects recorded)
                    </Label>
                </div>
            ) : (
                <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-slate-600">
                        Actual value
                        {uomType === UomType.PERCENT_MIN ||
                        uomType === UomType.PERCENT_MAX
                            ? ' (%)'
                            : ''}
                    </Label>
                    <Input
                        type="number"
                        inputMode="decimal"
                        step="any"
                        value={row.actualValue}
                        onChange={(e) => onChange({ actualValue: e.target.value })}
                        className={fieldClass}
                        placeholder="Enter achieved value"
                        disabled={disabled}
                    />
                </div>
            )}

            <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-600">
                    Achievement status
                </Label>
                <select
                    value={row.achievementStatus}
                    disabled={disabled}
                    onChange={(e) =>
                        onChange({ achievementStatus: e.target.value })
                    }
                    className={selectClass}
                >
                    {ACHIEVEMENT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
            </div>

            {showBar ? (
                <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                        <span className="font-medium">Progress score</span>
                        <span
                            className={cn(
                                'font-semibold',
                                scoreNum! >= 100 ? 'text-emerald-700' : 'text-amber-700'
                            )}
                        >
                            {Math.round(scoreNum!)}%
                        </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                            className={cn(
                                'h-full transition-all duration-300 rounded-full',
                                scoreNum! >= 100 ? 'bg-emerald-500' : 'bg-amber-500'
                            )}
                            style={{ width: `${Math.min(100, scoreNum!)}%` }}
                        />
                    </div>
                </div>
            ) : null}
        </div>
    )
}