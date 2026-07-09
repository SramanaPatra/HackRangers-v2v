import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";

export default function CommentThread({ comment, onLike, onReply, maxDepth = 6 }) {
  const [replying, setReplying] = useState(false);
  const [draft, setDraft] = useState("");

  const submitReply = () => {
    if (!draft.trim()) return;
    onReply(comment.id, draft);
    setDraft("");
    setReplying(false);
  };

  return (
    <div className={comment.depth > 0 ? "ml-6 border-l-2 border-ink/10 pl-4" : ""}>
      <div className="py-3">
        <p className="text-xs font-medium text-ink-light mb-1">{comment.author_name}</p>
        <p className="text-sm text-ink mb-2">{comment.body}</p>
        <div className="flex items-center gap-4 text-xs text-ink-light">
          <button
            onClick={() => onLike(comment.id, comment.liked_by_user)}
            className={`flex items-center gap-1 ${comment.liked_by_user ? "text-blossom" : ""}`}
          >
            <Heart size={14} fill={comment.liked_by_user ? "currentColor" : "none"} />
            {comment.like_count}
          </button>
          {comment.depth < maxDepth && (
            <button onClick={() => setReplying((r) => !r)} className="flex items-center gap-1">
              <MessageCircle size={14} />
              Reply
            </button>
          )}
        </div>

        {replying && (
          <div className="mt-3 flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="flex-1 bg-petal-soft rounded-full px-4 py-2 text-sm focus:outline-none"
              placeholder="Write a reply"
            />
            <button onClick={submitReply} className="btn-primary text-xs px-4 py-2">
              Post
            </button>
          </div>
        )}
      </div>

      {comment.children && comment.children.map((child) => (
        <CommentThread key={child.id} comment={child} onLike={onLike} onReply={onReply} maxDepth={maxDepth} />
      ))}
    </div>
  );
}