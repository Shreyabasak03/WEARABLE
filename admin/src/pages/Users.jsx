import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/react";

import {
  Search,
  Eye,
  MoreHorizontal,
  Users as UsersIcon,
  UserCheck,
  UserX,
  UserPlus,
} from "lucide-react";

import "./User.css";

const Users = () => {

  // =====================================================
  // CLERK AUTH
  // =====================================================

  const { getToken } = useAuth();


  // =====================================================
  // STATES
  // =====================================================

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All Status");

  const [users, setUsers] = useState([]);

  const [totalUsers, setTotalUsers] = useState(0);

  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] =
    useState(null);


  // =====================================================
  // FETCH USERS
  // =====================================================

  const fetchUsers = async () => {

    try {

      setLoading(true);

      // Get Clerk authentication token
      const token = await getToken();

      // Request users from backend
      const response = await axios.get(
        "http://localhost:5001/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Save users
      setUsers(response.data.users || []);

      // Save total Clerk users
      setTotalUsers(
        response.data.totalCount || 0
      );

    } catch (error) {

      console.error(
        "Error fetching users:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // FETCH ON PAGE LOAD
  // =====================================================

  useEffect(() => {

    fetchUsers();

  }, []);


  // =====================================================
  // ACTIVE USERS
  // =====================================================

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;


  // =====================================================
  // BLOCKED USERS
  // =====================================================

  const blockedUsers = users.filter(
    (user) => user.status === "Blocked"
  ).length;


  // =====================================================
  // NEW USERS THIS MONTH
  // =====================================================

  const now = new Date();

  const newThisMonth = users.filter((user) => {

    const joinedDate = new Date(
      user.joined
    );

    return (
      joinedDate.getMonth() === now.getMonth() &&
      joinedDate.getFullYear() ===
        now.getFullYear()
    );

  }).length;


  // =====================================================
  // FILTER USERS
  // =====================================================

  const filteredUsers = users.filter((user) => {

    const searchValue =
      search.toLowerCase().trim();

    const userName =
      user.name?.toLowerCase() || "";

    const userEmail =
      user.email?.toLowerCase() || "";

    const userPhone =
      user.phone?.toLowerCase() || "";

    const matchesSearch =
      userName.includes(searchValue) ||
      userEmail.includes(searchValue) ||
      userPhone.includes(searchValue);

    const matchesStatus =
      statusFilter === "All Status" ||
      user.status === statusFilter;

    return (
      matchesSearch &&
      matchesStatus
    );

  });


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="users-page">

        <div className="users-header">

          <div>

            <h1>
              Users
            </h1>

            <p>
              Loading customer accounts...
            </p>

          </div>

        </div>

      </div>
    );

  }


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="users-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="users-header">

        <div>

          <h1>
            Users
          </h1>

          <p>
            Manage your customers and their accounts.
          </p>

        </div>

      </div>


      {/* =================================================
          USER STATISTICS
      ================================================= */}

      <div className="user-stats">


        {/* TOTAL USERS */}

        <div className="user-stat-card">

          <div className="user-stat-icon total">

            <UsersIcon size={19} />

          </div>

          <div>

            <span>
              Total Users
            </span>

            <h3>
              {totalUsers}
            </h3>

          </div>

        </div>


        {/* ACTIVE USERS */}

        <div className="user-stat-card">

          <div className="user-stat-icon active">

            <UserCheck size={19} />

          </div>

          <div>

            <span>
              Active Users
            </span>

            <h3>
              {activeUsers}
            </h3>

          </div>

        </div>


        {/* NEW USERS */}

        <div className="user-stat-card">

          <div className="user-stat-icon new">

            <UserPlus size={19} />

          </div>

          <div>

            <span>
              New This Month
            </span>

            <h3>
              {newThisMonth}
            </h3>

          </div>

        </div>


      </div>


      {/* =================================================
          USERS CARD
      ================================================= */}

      <div className="users-card">


        {/* =================================================
            TOOLBAR
        ================================================= */}

        <div className="users-toolbar">


          {/* SEARCH */}

          <div className="user-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          {/* STATUS FILTER */}

          <select
            className="user-status-filter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >

            <option value="All Status">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            {/* <option value="Blocked">
              Blocked
            </option> */}

          </select>

        </div>


        {/* =================================================
            USERS TABLE
        ================================================= */}

        <div className="users-table-wrapper">

          <table className="users-table">

            <thead>

              <tr>

                <th>
                  User
                </th>

                <th>
                  Phone
                </th>

                <th>
                  Orders
                </th>

                <th>
                  Total Spent
                </th>

                <th>
                  Joined
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredUsers.map((user) => (

                <tr key={user.id}>


                  {/* =================================================
                      USER
                  ================================================= */}

                  <td>

                    <div className="user-info">


                      {/* PROFILE IMAGE */}

                      <div className="user-avatar">

                        {user.imageUrl ? (

                          <img
                            src={user.imageUrl}
                            alt={user.name}
                          />

                        ) : (

                          user.name
                            ?.charAt(0)
                            .toUpperCase()

                        )}

                      </div>


                      {/* NAME + EMAIL */}

                      <div>

                        <h4>
                          {user.name}
                        </h4>

                        <span>
                          {user.email}
                        </span>

                      </div>

                    </div>

                  </td>


                  {/* =================================================
                      PHONE
                  ================================================= */}

                  <td>

                    <span className="user-phone">

                      {user.phone}

                    </span>

                  </td>


                  {/* =================================================
                      ORDERS
                  ================================================= */}

                  <td>

                    <span className="user-orders">

                      {user.orders}

                    </span>

                  </td>


                  {/* =================================================
                      TOTAL SPENT
                  ================================================= */}

                  <td>

                    <strong className="user-spent">

                      ₹
                      {Number(
                        user.spent || 0
                      ).toLocaleString("en-IN")}

                    </strong>

                  </td>


                  {/* =================================================
                      JOINED
                  ================================================= */}

                  <td>

                    <span className="user-joined">

                      {new Date(
                        user.joined
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}

                    </span>

                  </td>


                  {/* =================================================
                      STATUS
                  ================================================= */}

                  <td>

                    <span
                      className={`user-status ${
                        user.status?.toLowerCase()
                      }`}
                    >

                      {user.status}

                    </span>

                  </td>


                  {/* =================================================
                      ACTIONS
                  ================================================= */}

                  <td>

                    <div className="user-actions">


                      {/* VIEW */}

                      <button
                        title="View user"
                        onClick={() =>
                          setSelectedUser(user)
                        }
                      >

                        <Eye size={16} />

                      </button>


                    </div>

                  </td>

                </tr>

              ))}


              {/* =================================================
                  NO USERS
              ================================================= */}

              {filteredUsers.length === 0 && (

                <tr>

                  <td
                    colSpan="7"
                    className="no-users"
                  >

                    No users found.

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="users-footer">

          <span>

            Showing{" "}
            {filteredUsers.length} of{" "}
            {users.length} users

          </span>


          {/* PAGINATION */}

          <div className="users-pagination">

            <button disabled>
              Previous
            </button>

            <button className="active-page">
              1
            </button>

            <button>
              2
            </button>

            <button>
              3
            </button>

            <button>
              Next
            </button>

          </div>

        </div>

      </div>


      {/* =================================================
          USER DETAILS MODAL
      ================================================= */}

      {selectedUser && (

        <div
          className="user-modal-overlay"
          onClick={() =>
            setSelectedUser(null)
          }
        >

          <div
            className="user-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            {/* HEADER */}

            <div className="user-modal-header">

              <div>

                <h2>
                  User Details
                </h2>

                <span>
                  {selectedUser.id}
                </span>

              </div>

              <button
                className="user-modal-close"
                onClick={() =>
                  setSelectedUser(null)
                }
              >
                ×
              </button>

            </div>


            {/* USER PROFILE */}

            <div className="user-modal-profile">

              <div className="user-modal-avatar">

                {selectedUser.imageUrl ? (

                  <img
                    src={
                      selectedUser.imageUrl
                    }
                    alt={
                      selectedUser.name
                    }
                  />

                ) : (

                  selectedUser.name
                    ?.charAt(0)
                    .toUpperCase()

                )}

              </div>

              <div>

                <h3>
                  {selectedUser.name}
                </h3>

                <span>
                  {selectedUser.email}
                </span>

              </div>

            </div>


            {/* USER INFORMATION */}

            <div className="user-modal-section">

              <h3>
                Account Information
              </h3>

              <div className="user-detail-grid">

                <div>

                  <span>
                    Phone
                  </span>

                  <strong>
                    {selectedUser.phone}
                  </strong>

                </div>


                <div>

                  <span>
                    Status
                  </span>

                  <strong>
                    {selectedUser.status}
                  </strong>

                </div>


                <div>

                  <span>
                    Orders
                  </span>

                  <strong>
                    {selectedUser.orders}
                  </strong>

                </div>


                <div>

                  <span>
                    Total Spent
                  </span>

                  <strong>
                    ₹
                    {Number(
                      selectedUser.spent || 0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>


                <div>

                  <span>
                    Joined
                  </span>

                  <strong>

                    {new Date(
                      selectedUser.joined
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )}

                  </strong>

                </div>

              </div>

            </div>


            {/* CLERK ID */}

            <div className="user-modal-section">

              <h3>
                Clerk User ID
              </h3>

              <p className="user-clerk-id">
                {selectedUser.id}
              </p>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Users;