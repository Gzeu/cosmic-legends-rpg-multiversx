import { GameInterface } from '@/components/game-interface'
import { redirect } from 'next/navigation'

// This will be protected by authentication later
export default function GamePage() {
  // TODO: Add authentication check
  // if (!isAuthenticated) {
  //   redirect('/login')
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Cosmic Legends RPG Arena
        </h1>
        <GameInterface />
      </div>
    </div>
  )
}
