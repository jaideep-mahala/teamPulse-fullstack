import { useCallback, useMemo, useState, type FormEvent } from "react";
import IssueModal from "./issue.tsx";
import {
  createId,
  PART_LABEL,
  SECTION_META,
  SECTION_ORDER,
  type BoardPart,
  type Issue,
  type IssuesBySection,
  type SectionKey,
} from "./types";
import "./board.css";

/**
 * Board.tsx
 *
 * A single, reusable board page for an organization's TeamPulse dashboard.
 * The same component renders the Frontend, Backend, or DevOps board — only
 * `organizationName` and `boardPart` change. Each of the three sections
 * (Upcoming / In Progress / Done) has its own "+ Add issue" control, and
 * clicking any issue card opens a popup (IssueModal) where the team can
 * read and post comments on that issue.
 *
 * Local state drives everything by default so this works standalone; the
 * optional onIssueAdd / onCommentAdd / onIssueMove callbacks are where you'd
 * hook in the project's REST + WebSocket layer (REST call for the mutation,
 * then rely on the /notify broadcast to keep other tabs in sync).
 */

export interface BoardProps {
  organizationName: string;
  boardPart: BoardPart;
  currentUserName?: string;
  initialIssues?: Partial<IssuesBySection>;
  onIssueAdd?: (section: SectionKey, issue: Issue) => void;
  onIssueMove?: (issueId: string, from: SectionKey, to: SectionKey) => void;
  onCommentAdd?: (issueId: string, text: string, author: string) => void;
}

function emptySections(): IssuesBySection {
  return { upcoming: [], inProgress: [], done: [] };
}

export default function Board({
  organizationName,
  boardPart,
  currentUserName = "You",
  initialIssues,
  onIssueAdd,
  onIssueMove,
  onCommentAdd,
}: BoardProps) {
  const [issues, setIssues] = useState<IssuesBySection>(() => ({
    ...emptySections(),
    ...initialIssues,
  }));
  const [openComposer, setOpenComposer] = useState<SectionKey | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [selected, setSelected] = useState<{ section: SectionKey; issueId: string } | null>(
    null
  );

  const issueCount = useMemo(
    () => SECTION_ORDER.reduce((sum, key) => sum + issues[key].length, 0),
    [issues]
  );

  const nextIssueNumber = issueCount + 1;

  const handleOpenComposer = useCallback((section: SectionKey) => {
    setOpenComposer(section);
    setDraftTitle("");
  }, []);

  const handleCloseComposer = useCallback(() => {
    setOpenComposer(null);
    setDraftTitle("");
  }, []);

  const handleAddIssue = useCallback(
    (event: FormEvent, section: SectionKey) => {
      event.preventDefault();
      const title = draftTitle.trim();
      if (!title) return;

      const issue: Issue = {
        id: createId("issue"),
        number: nextIssueNumber,
        title,
        comments: [],
        createdAt: new Date().toISOString(),
      };

      setIssues((prev) => ({ ...prev, [section]: [...prev[section], issue] }));
      onIssueAdd?.(section, issue);
      setDraftTitle("");
      setOpenComposer(null);
    },
    [draftTitle, nextIssueNumber, onIssueAdd]
  );

  const handleAdvanceIssue = useCallback(
    (section: SectionKey, issueId: string) => {
      const next = SECTION_META[section].next;
      if (!next) return;

      setIssues((prev) => {
        const issue = prev[section].find((i) => i.id === issueId);
        if (!issue) return prev;
        return {
          ...prev,
          [section]: prev[section].filter((i) => i.id !== issueId),
          [next]: [...prev[next], issue],
        };
      });
      onIssueMove?.(issueId, section, next);
    },
    [onIssueMove]
  );

  const handleAddComment = useCallback(
    (issueId: string, text: string) => {
      setIssues((prev) => {
        const updated: IssuesBySection = { ...prev };
        for (const key of SECTION_ORDER) {
          updated[key] = updated[key].map((issue) =>
            issue.id === issueId
              ? {
                  ...issue,
                  comments: [
                    ...issue.comments,
                    {
                      id: createId("comment"),
                      author: currentUserName,
                      text,
                      createdAt: new Date().toISOString(),
                    },
                  ],
                }
              : issue
          );
        }
        return updated;
      });
      onCommentAdd?.(issueId, text, currentUserName);
    },
    [currentUserName, onCommentAdd]
  );

  const selectedIssue =
    selected && issues[selected.section].find((issue) => issue.id === selected.issueId);

  return (
    <div className="board-page">
      <header className="board-navbar">
        <div className="board-navbar__crumb">
          <span className="board-navbar__org">{organizationName}</span>
          <span className="board-navbar__sep" aria-hidden="true">
            /
          </span>
          <span className={`board-navbar__part board-navbar__part--${boardPart}`}>
            {PART_LABEL[boardPart]}
          </span>
        </div>
        <div className="board-navbar__meta">
          {issueCount} issue{issueCount === 1 ? "" : "s"}
        </div>
      </header>

      <main className="board-columns">
        {SECTION_ORDER.map((section) => {
          const meta = SECTION_META[section];
          const sectionIssues = issues[section];
          const isComposerOpen = openComposer === section;

          return (
            <section
              key={section}
              className={`board-column board-column--${section}`}
              aria-labelledby={`board-column-heading-${section}`}
            >
              <div className="board-column__header">
                <h2 id={`board-column-heading-${section}`} className="board-column__title">
                  {meta.label}
                </h2>
                <span className="board-column__count">{sectionIssues.length}</span>
              </div>

              <ul className="board-column__list">
                {sectionIssues.map((issue) => (
                  <li key={issue.id}>
                    <button
                      type="button"
                      className="board-issue"
                      onClick={() => setSelected({ section, issueId: issue.id })}
                    >
                      <span className="board-issue__number">Issue {issue.number}</span>
                      <span className="board-issue__title">{issue.title}</span>
                      {issue.comments.length > 0 && (
                        <span className="board-issue__comment-count">
                          {issue.comments.length} comment{issue.comments.length === 1 ? "" : "s"}
                        </span>
                      )}
                    </button>
                    {meta.next && (
                      <button
                        type="button"
                        className="board-issue__advance"
                        onClick={() => handleAdvanceIssue(section, issue.id)}
                      >
                        Move to {SECTION_META[meta.next].label} →
                      </button>
                    )}
                  </li>
                ))}

                {sectionIssues.length === 0 && !isComposerOpen && (
                  <li className="board-column__empty">No issues yet.</li>
                )}
              </ul>

              {isComposerOpen ? (
                <form
                  className="board-composer"
                  onSubmit={(event) => handleAddIssue(event, section)}
                >
                  <input
                    autoFocus
                    type="text"
                    className="board-composer__input"
                    placeholder="Issue title"
                    value={draftTitle}
                    onChange={(event) => setDraftTitle(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") handleCloseComposer();
                    }}
                  />
                  <div className="board-composer__actions">
                    <button type="submit" className="board-composer__submit">
                      Add issue
                    </button>
                    <button
                      type="button"
                      className="board-composer__cancel"
                      onClick={handleCloseComposer}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  className="board-column__add"
                  onClick={() => handleOpenComposer(section)}
                >
                  + Add issue
                </button>
              )}
            </section>
          );
        })}
      </main>

      {selectedIssue && (
        <IssueModal
          issue={selectedIssue}
          currentUserName={currentUserName}
          onAddComment={handleAddComment}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}