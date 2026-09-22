import { useState, type FormEvent } from "react";
import "./org.css";

type PopupMode = "choice" | "create" | "join";

const OrganizationPopup = () => {
  const [mode, setMode] = useState<PopupMode>("choice");

  const [organizationName, setOrganizationName] = useState("");
  const [description, setDescription] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const handleCreateOrganization = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Create Organization:", {
      name: organizationName,
      description: description,
    });

    // Backend API will be connected here later
  };

  const handleJoinOrganization = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Join Organization:", {
      inviteCode,
    });

    // Backend API will be connected here later
  };

  return (
    <div className="organization-overlay">
      <div className="organization-popup">

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
              >
                Create Organization
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
              >
                Join Organization
              </button>

            </form>
          </>
        )}

      </div>
    </div>
  );
};

export default OrganizationPopup;