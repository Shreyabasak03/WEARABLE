import React from "react";
import { Search, Bell, User } from "lucide-react";

const Topbar = () => {
  return (
    <header className="topbar">

      <div className="search-box">
        <Search size={20} />

        <input
          type="text"
          placeholder="Search..."
        />
      </div>

      <div className="topbar-right">

        <button className="icon-button">
          <Bell size={20} />
        </button>

        <div className="admin-profile">
          <div className="admin-avatar">
            <User size={20} />
          </div>

          <div>
            <p className="admin-name">Admin</p>
            <span>Administrator</span>
          </div>
        </div>

      </div>

    </header>
  );
};

export default Topbar;