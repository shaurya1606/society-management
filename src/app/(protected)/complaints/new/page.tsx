'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageShell } from '@/components/atomquest/page-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const CATEGORIES = [
    'Plumbing',
    'Electrical',
    'Cleaning',
    'Security',
    'Lift',
    'Parking',
    'Other'
]

export default function NewComplaintPage() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState(CATEGORIES[0])
    const [description, setDescription] = useState('')
    const [photoUrl, setPhotoUrl] = useState('')
    
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        if (!title.trim() || !category.trim() || !description.trim()) {
            setError('Please fill in all required fields.')
            setLoading(false)
            return
        }

        // Validate URL format if provided
        if (photoUrl.trim()) {
            try {
                new URL(photoUrl.trim())
            } catch {
                setError('Please provide a valid URL for the photo or leave it blank.')
                setLoading(false)
                return
            }
        }

        try {
            const response = await fetch('/api/complaints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title.trim(),
                    category: category.trim(),
                    description: description.trim(),
                    photoUrl: photoUrl.trim() || null,
                }),
            })

            const result = await response.json()
            if (response.ok && result.ok) {
                setSuccess(true)
                setTitle('')
                setDescription('')
                setPhotoUrl('')
                // Wait briefly then redirect to complaints listing
                setTimeout(() => {
                    router.push('/complaints')
                }, 1500)
            } else {
                setError(result.error || 'Failed to submit complaint. Please check your inputs.')
            }
        } catch {
            setError('An error occurred during submission. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <PageShell
            title="File a New Complaint"
            description="Submit a maintenance or support request to society administration."
        >
            <div className="max-w-2xl bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                            Complaint submitted successfully! Redirecting to list...
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                        <Input
                            id="title"
                            type="text"
                            placeholder="Brief summary of the issue (e.g. Water leakage in kitchen)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            disabled={loading || success}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                        <select
                            id="category"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            disabled={loading || success}
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Detailed Description <span className="text-red-500">*</span></Label>
                        <textarea
                            id="description"
                            rows={5}
                            placeholder="Provide details about the location, urgency, and description of the problem..."
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            disabled={loading || success}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="photoUrl">Photo URL <span className="text-xs text-slate-400">(Optional)</span></Label>
                        <Input
                            id="photoUrl"
                            type="text"
                            placeholder="Link to an image or document (e.g. https://example.com/photo.jpg)"
                            value={photoUrl}
                            onChange={(e) => setPhotoUrl(e.target.value)}
                            disabled={loading || success}
                        />
                        <p className="text-xs text-slate-400">
                            Enter an absolute URL starting with http:// or https://
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                        <Button type="submit" disabled={loading || success}>
                            {loading ? 'Submitting...' : 'Submit Complaint'}
                        </Button>
                        <Link href="/complaints">
                            <Button type="button" variant="outline" disabled={loading || success}>
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </PageShell>
    )
}
