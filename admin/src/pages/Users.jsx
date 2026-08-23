import React, { useEffect, useState } from "react";
import adminApi from "../api/axios";

import {
  Search,
  Eye,
  Users as UsersIcon,
  UserCheck,
  UserPlus,
} from "lucide-react";

import "./User.css";

const Users = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await adminApi.get("/users");

      setUsers(response.data.users || []);
      setTotalUsers(
        response.data.totalCount || response.data.users?.length || 0,
      );
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Message:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const activeUsers = users.filter((user) => user.status === "Active").length;
  const blockedUsers = users.filter((user) => user.status === "Blocked").length;

  const now = new Date();
  const newThisMonth = users.filter((user) => {
    const joinedDate = new Date(user.joined);
    return (
      joinedDate.getMonth() === now.getMonth() &&
      joinedDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const filteredUsers = users.filter((user) => {
    const searchValue = search.toLowerCase().trim();
    const userName = user.name?.toLowerCase() || "";
    const userEmail = user.email?.toLowerCase() || "";
    const userPhone = user.phone?.toLowerCase() || "";

    const matchesSearch =
      userName.includes(searchValue) ||
      userEmail.includes(searchValue) ||
      userPhone.includes(searchValue);

    const matchesStatus =
      statusFilter === "All Status" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="users-page">
        <div className="users-header">
          <div>
            <h1>Users</h1>
            <p>Loading customer accounts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1>Users</h1>
          <p>Manage your customers and their accounts.</p>
        </div>
      </div>

      <div className="user-stats">
        <div className="user-stat-card">
          <div className="user-stat-icon total">
            <UsersIcon size={19} />
          </div>
          <div>
            <span>Total Users</span>
            <h3>{totalUsers}</h3>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon active">
            <UserCheck size={19} />
          </div>
          <div>
            <span>Active Users</span>
            <h3>{activeUsers}</h3>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon new">
            <UserPlus size={19} />
          </div>
          <div>
            <span>New This Month</span>
            <h3>{newThisMonth}</h3>
          </div>
        </div>
      </div>

      <div className="users-card">
        <div className="users-toolbar">
          <div className="user-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="user-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>

        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Phone</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.imageUrl ? (
                          <img src={user.imageUrl} alt={user.name} />
                        ) : (
                          user.name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <h4>{user.name}</h4>
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="user-phone">
                      {user.phone || "Not provided"}
                    </span>
                  </td>
                  <td>
                    <span className="user-orders">{user.orders || 0}</span>
                  </td>
                  <td>
                    <strong className="user-spent">
                      ₹{Number(user.spent || 0).toLocaleString("en-IN")}
                    </strong>
                  </td>
                  <td>
                    <span className="user-joined">
                      {user.joined
                        ? new Date(user.joined).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`user-status ${
                        user.status?.toLowerCase() || ""
                      }`}
                    >
                      {user.status || "Active"}
                    </span>
                  </td>
                  <td>
                    <div className="user-actions">
                      <button
                        type="button"
                        title="View user"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="7" className="no-users">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="users-footer">
          <span>
            Showing {filteredUsers.length} of {users.length} users
          </span>
          <div className="users-pagination">
            <button disabled>Previous</button>
            <button className="active-page">1</button>
            <button>2</button>
            <button>3</button>
            <button>Next</button>
          </div>
        </div>
      </div>

      {selectedUser && (
        <div
          className="user-modal-overlay"
          onClick={() => setSelectedUser(null)}
        >
          <div className="user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="user-modal-header">
              <div>
                <h2>User Details</h2>
                <span>{selectedUser.id}</span>
              </div>
              <button
                type="button"
                className="user-modal-close"
                onClick={() => setSelectedUser(null)}
              >
                ×
              </button>
            </div>

            <div className="user-modal-profile">
              <div className="user-modal-avatar">
                {selectedUser.imageUrl ? (
                  <img src={selectedUser.imageUrl} alt={selectedUser.name} />
                ) : (
                  selectedUser.name?.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h3>{selectedUser.name}</h3>
                <span>{selectedUser.email}</span>
              </div>
            </div>

            <div className="user-modal-section">
              <h3>Account Information</h3>
              <div className="user-detail-grid">
                <div>
                  <span>Phone</span>
                  <strong>{selectedUser.phone || "Not provided"}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{selectedUser.status || "Active"}</strong>
                </div>
                <div>
                  <span>Orders</span>
                  <strong>{selectedUser.orders || 0}</strong>
                </div>
                <div>
                  <span>Total Spent</span>
                  <strong>
                    ₹{Number(selectedUser.spent || 0).toLocaleString("en-IN")}
                  </strong>
                </div>
                <div>
                  <span>Joined</span>
                  <strong>
                    {selectedUser.joined
                      ? new Date(selectedUser.joined).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          },
                        )
                      : "N/A"}
                  </strong>
                </div>
              </div>
            </div>

            <div className="user-modal-section">
              <h3>User ID</h3>
              <p className="user-clerk-id">{selectedUser.id}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
