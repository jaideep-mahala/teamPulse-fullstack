import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Issue } from "./types";
import "./issue.css";

export interface IssueModalProps {
  issue: Issue;
  currentUserName: string;
  onAddComment: (issueId: string, text: string) => void;
  onClose: () => void;
}

/**
 * IssueModal
 *
 * The popup that opens when an issue card on the board is clicked. Shows the
 * issue text at the top, the running comment thread below it, and a form to
 * post a new comment as `currentUserName`. Closes on backdrop click, the
 * close button, or Escape.
 */
export default function IssueModal({
  issue,
  currentUserName,
  onAddComment,
  onClose,
}: IssueModalProps) {
  const [draft, setDraft] = useState("");
  const threadEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ block: "end" });
  }, [issue.comments.length]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onAddComment(issue.id, text);
    setDraft("");
  }

  return (
    <div
      className="issue-modal__backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="issue-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="issue-modal-title"
      >
        <header className="issue-modal__header">
          <div>
            <p className="issue-modal__eyebrow">Issue {issue.number}</p>
            <h2 id="issue-modal-title" className="issue-modal__title">
              {issue.title}
            </h2>
          </div>
          <button
            type="button"
            className="issue-modal__close"
            onClick={onClose}
            aria-label="Close issue"
          >
            ×
          </button>
        </header>

        <div className="issue-modal__thread">
          {issue.comments.length === 0 && (
            <p className="issue-modal__empty">No comments yet — start the discussion.</p>
          )}
          {issue.comments.map((comment) => (
            <div key={comment.id} className="issue-comment">
              <span className="issue-comment__author">{comment.author}:</span>{" "}
              <span className="issue-comment__text">{comment.text}</span>
            </div>
          ))}
          <div ref={threadEndRef} />
        </div>

        <form className="issue-modal__composer" onSubmit={handleSubmit}>
          <input
            autoFocus
            type="text"
            className="issue-modal__input"
            placeholder={`Comment as ${currentUserName}`}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <button type="submit" className="issue-modal__submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}