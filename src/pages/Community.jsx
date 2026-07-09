import { useState, useEffect } from 'react'

export default function Community() {
  const [posts, setPosts] = useState([])
  const [selectedCircle, setSelectedCircle] = useState('All')
  const [newPostText, setNewPostText] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const circles = ['All', 'New Managers', 'Early Career Engineers', 'Returning from Leave', 'PhD & Research']

  // Load posts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('communityPosts')
    if (saved) {
      setPosts(JSON.parse(saved))
    } else {
      // Demo posts (only if no saved data exists)
      const demoPosts = [
        {
          id: 1,
          circle: 'Early Career Engineers',
          text: "First on-call rotation tonight. Nervous but oddly proud of myself for volunteering.",
          hearts: 12,
          createdAt: Date.now() - 3600000
        },
        {
          id: 2,
          circle: 'Returning from Leave',
          text: "Two weeks back and still relearning the codebase. Reminding myself that's normal.",
          hearts: 8,
          createdAt: Date.now() - 7200000
        },
        {
          id: 3,
          circle: 'New Managers',
          text: "Had to give tough feedback today. Practiced kindness over perfection.",
          hearts: 15,
          createdAt: Date.now() - 10800000
        }
      ]
      setPosts(demoPosts)
      localStorage.setItem('communityPosts', JSON.stringify(demoPosts))
    }
  }, [])

  const addPost = () => {
    if (!newPostText.trim()) {
      alert('Please write something to share')
      return
    }
    
    const circle = selectedCircle === 'All' ? 'General' : selectedCircle
    const newPost = {
      id: Date.now(),
      circle: circle,
      text: newPostText,
      hearts: 0,
      createdAt: Date.now()
    }
    
    const updated = [newPost, ...posts]
    setPosts(updated)
    localStorage.setItem('communityPosts', JSON.stringify(updated))
    setNewPostText('')
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const heartPost = (postId) => {
    const updated = posts.map(post => 
      post.id === postId ? { ...post, hearts: post.hearts + 1 } : post
    )
    setPosts(updated)
    localStorage.setItem('communityPosts', JSON.stringify(updated))
  }

  const filteredPosts = selectedCircle === 'All' 
    ? posts 
    : posts.filter(p => p.circle === selectedCircle)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="font-display text-3xl text-ink">You're not the only one.</h1>
      
      {/* Circle filters - UNCHANGED */}
      <div className="flex flex-wrap gap-2">
        {circles.map(circle => (
          <button
            key={circle}
            onClick={() => setSelectedCircle(circle)}
            className={`px-4 py-2 rounded-full ${
              selectedCircle === circle 
                ? 'bg-blossom text-white' 
                : 'bg-cream text-ink hover:bg-petal-soft'
            }`}
          >
            {circle}
          </button>
        ))}
      </div>

      {/* New post section - UNCHANGED */}
      <div className="card">
        <textarea
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
          placeholder="Share what's on your mind..."
          className="w-full p-3 rounded-lg bg-petal-soft font-body text-ink placeholder:text-ink-light/50 min-h-[80px]"
        />
        <div className="flex items-center gap-4 mt-3">
          <button onClick={addPost} className="btn-primary">
            Share with circle
          </button>
          {showSuccess && (
            <span className="text-sage font-body">✓ Posted!</span>
          )}
        </div>
      </div>

      {/* Posts - UNCHANGED */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <div key={post.id} className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-blossom-dark/70 uppercase tracking-widest">
                {post.circle}
              </span>
              <span className="text-xs text-ink-light">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="font-body text-ink mb-3">{post.text}</p>
            <button 
              onClick={() => heartPost(post.id)}
              className="flex items-center gap-2 text-sm text-ink-light hover:text-blossom transition-colors"
            >
              <span>❤️</span> {post.hearts} felt this too
            </button>
          </div>
        ))}
        {filteredPosts.length === 0 && (
          <div className="card text-center text-ink-light">
            <p>No posts in this circle yet. Be the first to share!</p>
          </div>
        )}
      </div>
    </div>
  )
}