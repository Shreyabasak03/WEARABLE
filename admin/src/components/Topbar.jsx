import React from "react";
import { Search, Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();

  // Go to notification page
  const handleNotificationClick = () => {
    navigate("/admin/notifications");
  };

  // Go directly to Admin Profile section
  const handleProfileClick = () => {
    navigate("/admin/settings?section=profile");
  };

  return (
    <header className="topbar">

     {/* SEARCH */}
<div>
  {/* <Search size={20} />

  <input
    type="search"
    name="admin_search_query"
    id="admin-search-input"
    autoComplete="off"
    data-lpignore="true"
    data-form-type="other"
    placeholder="Search..."
  /> */}
</div>

      <div className="topbar-right">

        {/* NOTIFICATION */}
        <button
          className="icon-button"
          type="button"
          onClick={handleNotificationClick}
          title="Notifications"
        >
          <Bell size={20} />
        </button>


        {/* ADMIN PROFILE */}
        <button
  className="admin-profile"
  type="button"
  onClick={handleProfileClick}
  title="Admin Profile"
  style={{  
    background: "transparent",
    color: "inherit",
    textAlign: "left",
    cursor: "pointer",
  }}
>
          <div className="admin-avatar">
            <User size={20} />
          </div>

          <div>
            <p className="admin-name">Admin</p>

            <span>Administrator</span>
          </div>
        </button>

      </div>

    </header>
  );
};

export default Topbar;