// types.ts
// Shared types for the TeamPulse board: an Issue lives in one of three
// sections, and carries a comment thread that the popup (IssueModal) reads
// and appends to.

export type SectionKey = "upcoming" | "inProgress" | "done";
export type BoardPart = "frontend" | "backend" | "devops";

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Issue {
  /** Stable id, e.g. for API calls. */
  id: string;
  /** Sequential display number, e.g. 1 -> "Issue 1". Assigned by the board. */
  number: number;
  /** The one-line issue text, e.g. "make the bg color black". */
  title: string;
  comments: Comment[];
  createdAt: string;
}

export type IssuesBySection = Record<SectionKey, Issue[]>;

export const SECTION_ORDER: SectionKey[] = ["upcoming", "inProgress", "done"];

export const SECTION_META: Record<SectionKey, { label: string; next: SectionKey | null }> = {
  upcoming: { label: "Upcoming", next: "inProgress" },
  inProgress: { label: "In progress", next: "done" },
  done: { label: "Done", next: null },
};

export const PART_LABEL: Record<BoardPart, string> = {
  frontend: "Frontend",
  backend: "Backend",
  devops: "DevOps",
};

export function createId(prefix: string): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}