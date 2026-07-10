import { useState, useEffect, useCallback } from "react";
import CommentThread from "../components/CommentThread.jsx";
import { apiRequest } from "../api/client.js";

export default function Circles() {
  const [circles, setCircles] = useState([]);
  const [activeCircle, setActiveCircle] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activePost, setActivePost] = useState(null);
  const [comments, setComments] = useState([]);
  const [postDraft, setPostDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [postError, setPostError] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    async function loadCircles() {
      try {
        const data = await apiRequest("/circles");
        setCircles(data);
        if (data.length > 0) setActiveCircle(data[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadCircles();
  }, []);

  const loadPosts = useCallback(async (circleId) => {
    try {
      const data = await apiRequest(`/circles/${circleId}/posts`);
      setPosts(data);
      setActivePost(null);
      setComments([]);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    if (activeCircle) loadPosts(activeCircle.id);
  }, [activeCircle, loadPosts]);

  const loadComments = useCallback(async (postId) => {
    try {
      const data = await apiRequest(`/circles/posts/${postId}/comments`);
      setComments(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const openPost = async (post) => {
    setActivePost(post);
    await loadComments(post.id);
  };

  const handleCreatePost = async () => {
    if (!postDraft.trim() || !activeCircle) return;
    setPosting(true);
    setPostError("");
    try {
      await apiRequest(`/circles/${activeCircle.id}/posts`, {
        method: "POST",
        body: JSON.stringify({ body: postDraft }),
      });
      setPostDraft("");
      await loadPosts(activeCircle.id);
    } catch (err) {
      setPostError(err.message || "Failed to post");
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (commentId, alreadyLiked) => {
    try {
      const method = alreadyLiked ? "DELETE" : "POST";
      await apiRequest(`/circles/comments/${commentId}/like`, { method });
      if (activePost) loadComments(activePost.id);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReply = async (parentId, body) => {
    if (!activePost) return;
    try {
      await apiRequest(`/circles/posts/${activePost.id}/comments`, {
        method: "POST",
        body: JSON.stringify({ body, parentId }),
      });
      loadComments(activePost.id);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="text-ink-light text-sm">Loading circles...</p>;
  if (error) return <p className="text-blossom-dark text-sm">{error}</p>;

  return (
    <div className="animate-driftIn">
      <p className="eyebrow mb-2">Peer support</p>
      <h1 className="text-3xl font-medium mb-6">Circles</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {circles.map((circle) => (
          <button
            key={circle.id}
            onClick={() => setActiveCircle(circle)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCircle?.id === circle.id ? "bg-blossom text-white" : "bg-petal-soft text-ink/70 hover:bg-white"
            }`}
          >
            {circle.name}
          </button>
        ))}
      </div>

      {!activePost ? (
        <>
          <div className="card mb-6">
            <textarea
              value={postDraft}
              onChange={(e) => setPostDraft(e.target.value)}
              placeholder="Start a thread in this circle"
              rows={2}
              className="w-full bg-petal-soft rounded-2xl p-4 text-sm resize-none mb-3
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-blossom/40"
            />
            <button
              onClick={handleCreatePost}
              disabled={posting || !postDraft.trim()}
              className="btn-primary text-sm px-5 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {posting ? "Posting..." : "Post"}
            </button>
            {postError && <p className="text-blossom-dark text-sm mt-2">{postError}</p>}
          </div>

          {posts.length === 0 ? (
            <p className="text-ink-light text-sm">No threads yet — be the first to post.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {posts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => openPost(post)}
                  className="card text-left hover:shadow-lift transition-shadow"
                >
                  <p className="eyebrow">{post.author_name}</p>
                  <p className="text-ink mt-2 mb-3">{post.body}</p>
                  <p className="text-xs text-ink-light">{post.comment_count} replies</p>
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div>
          <button onClick={() => setActivePost(null)} className="btn-ghost text-sm mb-4">
            Back to threads
          </button>

          <div className="card mb-4">
            <p className="eyebrow">{activePost.author_name}</p>
            <p className="text-ink mt-2">{activePost.body}</p>
          </div>

          <div className="card divide-y divide-ink/5">
            {comments.length === 0 && (
              <p className="text-ink-light text-sm py-4">No replies yet — be the first to respond.</p>
            )}
            {comments.map((comment) => (
              <CommentThread key={comment.id} comment={comment} onLike={handleLike} onReply={handleReply} />
            ))}
          </div>

          <div className="card mt-4">
            <ReplyBox onSubmit={(body) => handleReply(null, body)} />
          </div>
        </div>
      )}
    </div>
  );
}

function ReplyBox({ onSubmit }) {
  const [draft, setDraft] = useState("");

  const submit = () => {
    if (!draft.trim()) return;
    onSubmit(draft);
    setDraft("");
  };

  return (
    <div className="flex gap-2">
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Add a comment"
        className="flex-1 bg-petal-soft rounded-full px-4 py-2 text-sm focus:outline-none"
      />
      <button onClick={submit} className="btn-primary text-xs px-4 py-2">
        Post
      </button>
    </div>
  );
}