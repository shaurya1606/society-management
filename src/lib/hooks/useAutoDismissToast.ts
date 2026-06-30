import { useEffect } from 'react'

/** Auto-clear toast banners after a delay (demo-friendly feedback). */
export function useAutoDismissToast<T extends { type: string; text: string } | null>(
    toast: T,
    clear: () => void,
    ms = 6000
) {
    useEffect(() => {
        if (!toast) return
        const id = window.setTimeout(() => clear(), ms)
        return () => window.clearTimeout(id)
    }, [toast, clear, ms])
}
