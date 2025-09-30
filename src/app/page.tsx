import { Hero } from '@/components/hero'
import { Features } from '@/components/features'
import { GameStats } from '@/components/game-stats'
import { Roadmap } from '@/components/roadmap'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <GameStats />
      <Roadmap />
    </div>
  )
}
