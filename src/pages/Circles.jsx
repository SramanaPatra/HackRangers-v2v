import { useState, useEffect, useCallback } from "react";
import CommentThread from "../components/CommentThread.jsx";
import { apiRequest } from "../api/client.js";

const DEMO_POST_ID = "replace-with-real-post-id";

export default function Circles() {
  const [comments, setComments] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);

  const loadComments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiRequest(`/circles/posts/${DEMO_POST_ID}/comments`);
      setComments(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleLike = async (commentId, alreadyLiked) => {
    const method = alreadyLiked ? "DELETE" : "POST";
    await apiRequest(`/circles/comments/${commentId}/like`, { method });
    loadComments();
  };

  const handleReply = async (parentId, body) => {
    await apiRequest(`/circles/posts/${DEMO_POST_ID}/comments`, {
      method: "POST",
      body: JSON.stringify({ body, parentId }),
    });
    loadComments();
  };

  const handleTopLevelPost = async () => {
    if (!draft.trim()) return;
    await apiRequest(`/circles/posts/${DEMO_POST_ID}/comments`, {
      method: "POST",
      body: JSON.stringify({ body: draft, parentId: null }),
    });
    setDraft("");
    loadComments();
  };

  return (
    <div className="animate-driftIn">
      <p className="eyebrow mb-2">Threaded discussion</p>
      <h1 className="text-3xl font-medium mb-6">Circles</h1>

      <div className="card mb-6">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={2}
          placeholder="Start a thread"
          className="w-full bg-petal-soft rounded-2xl p-4 text-sm resize-none mb-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blossom/40"
        />
        <button onClick={handleTopLevelPost} className="btn-primary text-sm px-5 py-2.5">
          Post
        </button>
      </div>

  {loading ? (
        <p className="text-ink-light text-sm">Loading thread...</p>
      ) : (
        <div className="card divide-y divide-ink/5">
          {comments.length === 0 && (
            <p className="text-ink-light text-sm py-4">No threads yet — be the first to post.</p>
          )}
          {comments.map((comment) => (
            <CommentThread key={comment.id} comment={comment} onLike={handleLike} onReply={handleReply} />
          ))}
        </div>
      )}
    </div>
  );
}