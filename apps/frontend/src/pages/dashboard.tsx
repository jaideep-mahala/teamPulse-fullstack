import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Code2, Server, Boxes } from "lucide-react";
import "./dashboard.css";

const sections = [
  { key: "frontend", label: "Frontend", icon: Code2 },
  { key: "backend", label: "Backend", icon: Server },
  { key: "devops", label: "DevOps", icon: Boxes },
] as const;

export default function Dashboard() {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        const response = await axios.get(
          orgId
            ? `http://localhost:4000/api/v1/organization/${encodeURIComponent(orgId)}`
            : "http://localhost:4000/api/v1/organization",
          { headers: { Authorization: token ?? "" } },
        );
        const membership = orgId
          ? response.data.data?.membership
          : response.data.data?.membership?.[0];
        const fetchedOrganization = membership?.organization;

        if (!response.data.success || !fetchedOrganization) {
          setError("No organization found.");
          return;
        }

        setOrganization({
          id: fetchedOrganization.id,
          name: fetchedOrganization.name,
        });
        setIsAdmin(membership?.role === "admin");
      } catch (requestError) {
        setError(
          axios.isAxiosError(requestError)
            ? requestError.response?.data?.error || "Unable to load organization."
            : "Unable to load organization.",
        );
      }
    };

    void fetchOrganization();
  }, [orgId]);

  const handleInviteMember = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!organization) return;

    setInviteError("");
    setInviteMessage("");
    setIsInviting(true);

    try {
      const token = sessionStorage.getItem("authToken");
      const response = await axios.post(
        "http://localhost:4000/api/v1/invite",
        { email: inviteEmail.trim(), orgId: organization.id },
        { headers: { Authorization: token ?? "" } },
      );

      if (!response.data.success) {
        throw new Error(response.data.error || "Unable to send invitation.");
      }

      setInviteEmail("");
      setInviteMessage("Invitation sent. The member will receive the invitation code by email.");
    } catch (requestError) {
      setInviteError(
        axios.isAxiosError(requestError)
          ? requestError.response?.data?.error || "Unable to send invitation."
          : "Unable to send invitation.",
      );
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-navbar">
        <div className="org-badge">
          <span className="org-name">{organization?.name || error || "Loading..."}</span>
        </div>
        {isAdmin && organization && (
          <button
            type="button"
            className="add-members-button"
            onClick={() => {
              setInviteError("");
              setInviteMessage("");
              setIsInviteOpen(true);
            }}
          >
            Add Members
          </button>
        )}
      </nav>

      {isInviteOpen && (
        <div className="invite-modal-backdrop" role="presentation">
          <section className="invite-modal" role="dialog" aria-modal="true" aria-labelledby="invite-title">
            <button
              type="button"
              className="invite-modal-close"
              aria-label="Close invite form"
              onClick={() => setIsInviteOpen(false)}
            >
              ×
            </button>
            <h2 id="invite-title">Add a member</h2>
            <p>Send an invitation code to a member by email.</p>
            <form onSubmit={handleInviteMember}>
              <label htmlFor="invite-email">Member email</label>
              <input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                placeholder="member@example.com"
                required
                disabled={isInviting}
              />
              <button type="submit" className="invite-submit-button" disabled={isInviting}>
                {isInviting ? "Sending..." : "Send Invitation"}
              </button>
            </form>
            {inviteMessage && <p className="invite-success" role="status">{inviteMessage}</p>}
            {inviteError && <p className="invite-error" role="alert">{inviteError}</p>}
          </section>
        </div>
      )}

      <main className="dashboard-main">
        <h1 className="dashboard-heading">Choose a board</h1>
        <div className="section-grid">
          {sections.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className="section-card"
              onClick={() => navigate(`/org/${organization?.id}/board/${key}`)}
              disabled={!organization}
            >
              <Icon size={28} strokeWidth={1.75} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}