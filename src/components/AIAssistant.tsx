import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Send } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface AIAssistantProps {
  onSuggestion: (suggestion: string) => void
  context?: string
}

export default function AIAssistant({ onSuggestion, context = '' }: AIAssistantProps) {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt for the AI assistant.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, context }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI suggestion')
      }

      const data = await response.json()
      onSuggestion(data.suggestion)
    } catch (error) {
      console.error('Error getting AI suggestion:', error)
      toast({
        title: "Error",
        description: "Failed to get AI suggestion. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setPrompt('')
    }
  }

  return (
    <div className="bg-base-200 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">AI Assistant</h3>
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <Input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask AI for suggestions..."
          className="flex-grow"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </div>
  )
}
