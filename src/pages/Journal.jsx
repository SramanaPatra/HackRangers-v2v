import { useState, useEffect } from 'react'
import { Calendar, Tag, Save, Sparkles, TrendingUp } from 'lucide-react'

export default function Journal() {
  const [mood, setMood] = useState(null)
  const [moodEmoji, setMoodEmoji] = useState('')
  const [tags, setTags] = useState([])
  const [note, setNote] = useState('')
  const [entries, setEntries] = useState([])
  const [showSaved, setShowSaved] = useState(false)
  const [streak, setStreak] = useState(0)

  // Mood options with emojis
  const moodOptions = [
    { value: 'Rough', emoji: '😔', color: 'text-red-400' },
    { value: 'Low', emoji: '😕', color: 'text-orange-300' },
    { value: 'Okay', emoji: '😐', color: 'text-yellow-400' },
    { value: 'Good', emoji: '😊', color: 'text-green-400' },
    { value: 'Great', emoji: '🌟', color: 'text-blossom' }
  ]

  const tagOptions = [
    'Deadline stress', 
    'Imposter syndrome', 
    'Team conflict', 
    'Long hours',
    'Good feedback', 
    'Learning something new', 
    'Isolation',
    'Work-life balance',
    'Career progress',
    'Mentorship'
  ]

  // Load entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('journalEntries')
    if (saved) {
      const parsedEntries = JSON.parse(saved)
      setEntries(parsedEntries)
      
      // Calculate streak
      if (parsedEntries.length > 0) {
        const today = new Date().toDateString()
        let streakCount = 0
        let currentDate = new Date()
        
        // Check if there's an entry today
        const hasToday = parsedEntries.some(e => 
          new Date(e.date).toDateString() === today
        )
        
        if (hasToday) {
          streakCount = 1
          // Count backwards
          for (let i = 1; i < 30; i++) {
            const checkDate = new Date()
            checkDate.setDate(checkDate.getDate() - i)
            const hasEntry = parsedEntries.some(e => 
              new Date(e.date).toDateString() === checkDate.toDateString()
            )
            if (hasEntry) {
              streakCount++
            } else {
              break
            }
          }
        }
        setStreak(streakCount)
      }
    }
  }, [])

  const saveEntry = () => {
    if (!mood) {
      alert('Please select how you feel today 💭')
      return
    }

    const newEntry = {
      id: Date.now(),
      mood,
      moodEmoji,
      tags,
      note: note.trim(),
      date: new Date().toISOString()
    }
    
    const updated = [newEntry, ...entries]
    setEntries(updated)
    localStorage.setItem('journalEntries', JSON.stringify(updated))
    
    // Show success with sparkle effect
    setShowSaved(true)
    setTimeout(() => setShowSaved(false), 3000)
    
    // Reset form
    setMood(null)
    setMoodEmoji('')
    setTags([])
    setNote('')
    
    // Update streak
    const today = new Date().toDateString()
    let streakCount = 0
    let currentDate = new Date()
    const hasToday = updated.some(e => 
      new Date(e.date).toDateString() === today
    )
    if (hasToday) {
      streakCount = 1
      for (let i = 1; i < 30; i++) {
        const checkDate = new Date()
        checkDate.setDate(checkDate.getDate() - i)
        const hasEntry = updated.some(e => 
          new Date(e.date).toDateString() === checkDate.toDateString()
        )
        if (hasEntry) {
          streakCount++
        } else {
          break
        }
      }
    }
    setStreak(streakCount)
  }

  const deleteEntry = (id) => {
    if (window.confirm('Delete this entry?')) {
      const updated = entries.filter(e => e.id !== id)
      setEntries(updated)
      localStorage.setItem('journalEntries', JSON.stringify(updated))
    }
  }

  const getMoodEmoji = (moodValue) => {
    const option = moodOptions.find(m => m.value === moodValue)
    return option ? option.emoji : '😐'
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Streak */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Today I feel...</h1>
        {streak > 0 && (
          <div className="flex items-center gap-2 bg-blossom/10 px-4 py-2 rounded-full">
            <Sparkles className="w-4 h-4 text-blossom" />
            <span className="font-mono text-sm text-blossom font-semibold">
              {streak} day{streak > 1 ? 's' : ''} streak
            </span>
          </div>
        )}
      </div>

      {/* Mood Selector with Emojis */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {moodOptions.map(({ value, emoji, color }) => (
          <button
            key={value}
            onClick={() => {
              setMood(value)
              setMoodEmoji(emoji)
            }}
            className={`p-4 rounded-card transition-all duration-200 flex flex-col items-center gap-1 ${
              mood === value
                ? 'bg-blossom text-white shadow-lift'
                : 'bg-cream text-ink hover:bg-petal-soft'
            }`}
          >
            <span className={`text-3xl ${mood === value ? 'text-white' : color}`}>
              {emoji}
            </span>
            <span className={`text-sm font-body ${mood === value ? 'text-white/90' : 'text-ink-light'}`}>
              {value}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Mood Display */}
      {mood && (
        <div className="card bg-gradient-to-r from-petal-soft to-cream border border-blossom/10">
          <p className="text-sm text-ink-light">You're feeling</p>
          <p className="font-display text-2xl text-ink">
            {moodEmoji} {mood}
          </p>
        </div>
      )}

      {/* Tags Section */}
      <div>
        <p className="font-body text-ink-light mb-2 flex items-center gap-2">
          <Tag className="w-4 h-4" /> What's contributing to that?
        </p>
        <div className="flex flex-wrap gap-2">
          {tagOptions.map(tag => (
            <button
              key={tag}
              onClick={() => {
                setTags(prev => 
                  prev.includes(tag) 
                    ? prev.filter(t => t !== tag)
                    : [...prev, tag]
                )
              }}
              className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
                tags.includes(tag) 
                  ? 'bg-sage text-white shadow-soft' 
                  : 'bg-cream text-ink hover:bg-petal-soft'
              }`}
            >
              {tags.includes(tag) && '✓ '}{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Note Section */}
      <div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Anything you want to put into words? Optional—this stays private to you. 🌸"
          className="w-full p-4 rounded-card bg-cream font-body text-ink placeholder:text-ink-light/50 min-h-[120px] border border-transparent focus:border-blossom/30 focus:outline-none transition-all duration-200"
        />
      </div>

      {/* Save Button with Success Message */}
      <div className="flex items-center gap-4">
        <button 
          onClick={saveEntry} 
          className="btn-primary flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save today's entry
        </button>
        {showSaved && (
          <span className="text-sage font-body animate-driftIn flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-spark" />
            ✨ Entry saved! Keep going!
          </span>
        )}
      </div>

      {/* Recent Entries */}
      {entries.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl text-ink flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blossom" />
              Recent Entries
            </h3>
            {entries.length > 5 && (
              <span className="text-sm text-ink-light">{entries.length} total entries</span>
            )}
          </div>
          
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {entries.slice(0, 10).map(entry => (
              <div key={entry.id} className="card relative group">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                  <span className="font-body font-semibold text-ink">
                    {entry.mood}
                  </span>
                  <span className="font-mono text-xs text-ink-light ml-auto">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="text-ink-light/30 hover:text-red-400 transition-colors text-sm opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {entry.tags.map(tag => (
                      <span key={tag} className="text-xs bg-sage-light/20 text-sage-dark px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {entry.note && (
                  <p className="text-ink-light text-sm leading-relaxed">{entry.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {entries.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🌸</div>
          <h3 className="font-display text-xl text-ink">No entries yet</h3>
          <p className="text-ink-light mt-1">Start your journaling journey today!</p>
          <p className="text-sm text-ink-light/70 mt-2">Your entries are saved privately on your device.</p>
        </div>
      )}
    </div>
  )
}