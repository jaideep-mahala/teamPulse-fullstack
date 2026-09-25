import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./org.css";

type PopupMode = "choice" | "create" | "join";

type OrganizationMembership = {
  id: string;
  role: string;
  organization: {
    id: string;
    name: string;
    description?: string | null;
  };
};

const OrganizationPopup = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<PopupMode>("choice");

  const [organizationName, setOrganizationName] = useState("");
  const [description, setDescription] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [memberships, setMemberships] = useState<OrganizationMembership[]>([]);
  const [isLoadingMemberships, setIsLoadingMemberships] = useState(true);
  const [membershipError, setMembershipError] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadMemberships = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        const response = await axios.get(
          "http://localhost:4000/api/v1/organization",
          { headers: { Authorization: token ?? "" } },
        );

        if (!response.data.success) {
          throw new Error("Unable to load organizations.");
        }

        const loadedMemberships: OrganizationMembership[] = response.data.data?.membership ?? [];
        setMemberships(loadedMemberships);
      } catch (requestError) {
        setMembershipError(
          axios.isAxiosError(requestError)
            ? requestError.response?.data?.error || "Unable to load organizations."
            : "Unable to load organizations.",
        );
      } finally {
        setIsLoadingMemberships(false);
      }
    };

    void loadMemberships();
  }, []);

  const handleCreateOrganization = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const token = sessionStorage.getItem("authToken");
      const response = await axios.post(
        "http://localhost:4000/api/v1/organization/create",
        {
          name: organizationName.trim(),
          description: description.trim(),
        },
        { headers: { Authorization: token ?? "" } },
      );

      if (!response.data.success) {
        throw new Error(response.data.error || "Unable to create organization.");
      } else {
        navigate(`/dashboard/${response.data.data.id}`);
      }

      setMode("choice");
      setOrganizationName("");
      setDescription("");
    } catch (requestError) {
      setError(
        axios.isAxiosError(requestError)
          ? requestError.response?.data?.error || "Unable to create organization."
          : "Unable to create organization.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinOrganization = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const token = sessionStorage.getItem("authToken");
      const response = await axios.post(
        `http://localhost:4000/api/v1/accept/${encodeURIComponent(inviteCode.trim())}`,
        {},
        { headers: { Authorization: token ?? "" } },
      );

      if (!response.data.success) {
        throw new Error(response.data.error || "Unable to join organization.");
      }

      navigate(`/dashboard/${response.data.data.orgId}`);
      setMode("choice");
      setInviteCode("");
    } catch (requestError) {
      setError(
        axios.isAxiosError(requestError)
          ? requestError.response?.data?.error || "Unable to join organization."
          : "Unable to join organization.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="organization-overlay">
      <div className="organization-popup">

        {error && <p role="alert">{error}</p>}

        {/* Close Button */}
        <button
          type="button"
          className="popup-close"
          onClick={() => setMode("choice")}
        >
          ×
        </button>

        {/* =========================
            CHOICE SCREEN
        ========================== */}
        {mode === "choice" && (
          <>
            <div className="popup-header">
              <h1>Welcome to TeamPulse</h1>

              <p>
                Choose how you want to continue
              </p>
            </div>

            {(isLoadingMemberships || memberships.length > 0 || membershipError) && (
              <section className="existing-organizations" aria-labelledby="existing-organizations-title">
                <h2 id="existing-organizations-title">Your organizations</h2>
                {isLoadingMemberships && <p className="organization-status">Loading organizations...</p>}
                {membershipError && <p className="organization-status error-text" role="alert">{membershipError}</p>}
                {!isLoadingMemberships && !membershipError && memberships.length === 0 && (
                  <p className="organization-status">You are not a member of an organization yet.</p>
                )}
                <div className="existing-organization-list">
                  {memberships.map((membership) => (
                    <button
                      key={membership.id}
                      type="button"
                      className="existing-organization"
                      onClick={() => navigate(`/dashboard/${membership.organization.id}`)}
                    >
                      <span className="existing-organization-name">{membership.organization.name}</span>
                      <span className="existing-organization-role">{membership.role}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            <div className="organization-options">

              {/* Join Organization */}
              <button
                type="button"
                className="organization-option"
                onClick={() => setMode("join")}
              >
                <div className="option-icon">
                  ↗
                </div>

                <div className="option-content">
                  <h2>Join Organization</h2>

                  <p>
                    Join an existing organization using
                    an invitation.
                  </p>
                </div>
              </button>

              {/* Create Organization */}
              <button
                type="button"
                className="organization-option"
                onClick={() => setMode("create")}
              >
                <div className="option-icon">
                  +
                </div>

                <div className="option-content">
                  <h2>Create Organization</h2>

                  <p>
                    Create your own organization and
                    become its admin.
                  </p>
                </div>
              </button>

            </div>
          </>
        )}

        {/* =========================
            CREATE ORGANIZATION
        ========================== */}
        {mode === "create" && (
          <>
            <button
              type="button"
              className="back-button"
              onClick={() => setMode("choice")}
            >
              ← Back
            </button>

            <div className="popup-header">
              <h1>Create Organization</h1>

              <p>
                Create your organization and start
                working with your team.
              </p>
            </div>

            <form onSubmit={handleCreateOrganization}>

              <div className="form-group">
                <label htmlFor="organizationName">
                  Organization Name
                </label>

                <input
                  id="organizationName"
                  type="text"
                  placeholder="Enter organization name"
                  value={organizationName}
                  onChange={(e) =>
                    setOrganizationName(e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  placeholder="Describe your organization"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  rows={4}
                />
              </div>

              <button
                type="submit"
                className="primary-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Organization"}
              </button>

            </form>
          </>
        )}

        {/* =========================
            JOIN ORGANIZATION
        ========================== */}
        {mode === "join" && (
          <>
            <button
              type="button"
              className="back-button"
              onClick={() => setMode("choice")}
            >
              ← Back
            </button>

            <div className="popup-header">
              <h1>Join Organization</h1>

              <p>
                Enter the invitation code you received.
              </p>
            </div>

            <form onSubmit={handleJoinOrganization}>

              <div className="form-group">
                <label htmlFor="inviteCode">
                  Invitation Code
                </label>

                <input
                  id="inviteCode"
                  type="text"
                  placeholder="Enter invitation code"
                  value={inviteCode}
                  onChange={(e) =>
                    setInviteCode(e.target.value)
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="primary-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Joining..." : "Join Organization"}
              </button>

            </form>
          </>
        )}

      </div>
    </div>
  );
};

export default OrganizationPopup;