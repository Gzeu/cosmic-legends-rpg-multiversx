import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { prompt, type = 'character' } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    // Different prompts based on generation type
    const systemPrompts = {
      character: `Generate a detailed RPG character description based on: ${prompt}. Include stats, abilities, backstory, and appearance in JSON format.`,
      story: `Generate an engaging RPG story segment based on: ${prompt}. Include narrative, choices, and consequences.`,
      item: `Generate a magical item description based on: ${prompt}. Include stats, rarity, lore, and special abilities in JSON format.`,
      quest: `Generate an RPG quest based on: ${prompt}. Include objectives, rewards, difficulty, and storyline.`
    }

    const result = await model.generateContent(systemPrompts[type as keyof typeof systemPrompts] || systemPrompts.character)
    const response = await result.response
    const generatedContent = response.text()

    return NextResponse.json({
      content: generatedContent,
      type,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('AI Generation Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}
