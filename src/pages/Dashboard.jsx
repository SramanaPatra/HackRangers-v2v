import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const [trendData, setTrendData] = useState([])
  const [averageMood, setAverageMood] = useState(0)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('journalEntries')
    if (saved) {
      const entries = JSON.parse(saved)
      
      if (entries.length === 0) {
        setTrendData([])
        setAverageMood(0)
        setStreak(0)
        return
      }

      // Calculate mood over time
      const moodMap = {}
      entries.forEach(entry => {
        const date = new Date(entry.date).toLocaleDateString('en-US', { 
          weekday: 'short' 
        })
        const moodScore = ['Rough', 'Low', 'Okay', 'Good', 'Great'].indexOf(entry.mood) + 1
        if (!moodMap[date]) {
          moodMap[date] = { sum: 0, count: 0 }
        }
        moodMap[date].sum += moodScore
        moodMap[date].count += 1
      })

      // Get last 7 days or all data if less
      const dates = Object.keys(moodMap)
      const last7Dates = dates.slice(-7)
      
      const chartData = last7Dates.map(date => ({
        date,
        mood: Math.round((moodMap[date].sum / moodMap[date].count) * 10) / 10
      }))
      setTrendData(chartData)

      // Calculate average mood
      const allScores = entries.map(e => ['Rough', 'Low', 'Okay', 'Good', 'Great'].indexOf(e.mood) + 1)
      const avg = allScores.reduce((a, b) => a + b, 0) / allScores.length
      setAverageMood(Math.round(avg * 10) / 10)

      // Calculate streak (days with entries in last 7 days)
      const last7Days = entries.filter(e => {
        const days = (Date.now() - new Date(e.date).getTime()) / (1000 * 60 * 60 * 24)
        return days <= 7
      })
      setStreak(last7Days.length)
    }
  }, [])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="font-display text-3xl text-ink">Your Trends</h1>
      <p className="text-ink-light">The last 7 days.</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <p className="text-sm text-ink-light">Average mood</p>
          <p className="font-display text-3xl text-ink">
            {averageMood > 0 ? `${averageMood}/5` : '—'}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-ink-light">Check-in streak</p>
          <p className="font-display text-3xl text-ink">
            {streak > 0 ? `${streak} days` : '—'}
          </p>
        </div>
      </div>

      <div className="card">
        <h3 className="font-display text-lg text-ink mb-4">Mood over time</h3>
        {trendData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0e8ec" />
                <XAxis dataKey="date" stroke="#7A3A50" />
                <YAxis domain={[0, 5]} stroke="#7A3A50" />
                <Tooltip />
                <Line type="monotone" dataKey="mood" stroke="#D6336C" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-ink-light">
            <p>No journal entries yet. Start tracking your mood!</p>
          </div>
        )}
      </div>
    </div>
  )
}