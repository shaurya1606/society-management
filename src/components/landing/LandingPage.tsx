import { LandingHeader } from './LandingHeader'
import { LandingHero } from './LandingHero'
import { LandingFeatures } from './LandingFeatures'
import { LandingHowItWorks } from './LandingHowItWorks'
import { LandingFooter } from './LandingFooter'

type LandingPageProps = {
    isAuthenticated: boolean
}

export function LandingPage({ isAuthenticated }: LandingPageProps) {
    return (
        <div className="min-h-screen bg-white font-[family-name:var(--font-poppins)] text-slate-900">
            <LandingHeader isAuthenticated={isAuthenticated} />
            <main>
                <LandingHero isAuthenticated={isAuthenticated} />
                <LandingFeatures />
                <LandingHowItWorks />
            </main>
            <LandingFooter />
        </div>
    )
}
