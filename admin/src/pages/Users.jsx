import React, { useState } from "react";
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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const users = [
    {
      id: 1,
      name: "Ananya Sharma",
      email: "ananya@gmail.com",
      phone: "+91 98765 43210",
      orders: 12,
      spent: 18990,
      joined: "Aug 10, 2026",
      status: "Active",
    },
    {
      id: 2,
      name: "Rahul Das",
      email: "rahul@gmail.com",
      phone: "+91 91234 56789",
      orders: 8,
      spent: 12450,
      joined: "Jul 28, 2026",
      status: "Active",
    },
    {
      id: 3,
      name: "Priya Singh",
      email: "priya@gmail.com",
      phone: "+91 99887 66554",
      orders: 15,
      spent: 25600,
      joined: "Jul 15, 2026",
      status: "Active",
    },
    {
      id: 4,
      name: "Arjun Roy",
      email: "arjun@gmail.com",
      phone: "+91 87654 32109",
      orders: 5,
      spent: 6790,
      joined: "Jun 30, 2026",
      status: "Active",
    },
    {
      id: 5,
      name: "Sneha Das",
      email: "sneha@gmail.com",
      phone: "+91 98712 34567",
      orders: 3,
      spent: 3899,
      joined: "Jun 21, 2026",
      status: "Blocked",
    },
    {
      id: 6,
      name: "Riya Sen",
      email: "riya@gmail.com",
      phone: "+91 90909 87654",
      orders: 9,
      spent: 14590,
      joined: "Jun 10, 2026",
      status: "Active",
    },
    {
      id: 7,
      name: "Amit Roy",
      email: "amit@gmail.com",
      phone: "+91 89898 76543",
      orders: 2,
      spent: 2198,
      joined: "May 28, 2026",
      status: "Active",
    },
  ];

  /* =====================================================
     FILTER USERS
  ===================================================== */

  const filteredUsers = users.filter((user) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      user.name.toLowerCase().includes(searchValue) ||
      user.email.toLowerCase().includes(searchValue) ||
      user.phone.includes(searchValue);

    const matchesStatus =
      statusFilter === "All Status" ||
      user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="users-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="users-header">

        <div>
          <h1>Users</h1>

          <p>
            Manage your customers and their accounts.
          </p>
        </div>

      </div>


      {/* =================================================
          USER STATISTICS
      ================================================= */}

      <div className="user-stats">

        <div className="user-stat-card">

          <div className="user-stat-icon total">
            <UsersIcon size={19} />
          </div>

          <div>
            <span>Total Users</span>
            <h3>8,942</h3>
          </div>

        </div>


        <div className="user-stat-card">

          <div className="user-stat-icon active">
            <UserCheck size={19} />
          </div>

          <div>
            <span>Active Users</span>
            <h3>8,721</h3>
          </div>

        </div>


        <div className="user-stat-card">

          <div className="user-stat-icon new">
            <UserPlus size={19} />
          </div>

          <div>
            <span>New This Month</span>
            <h3>284</h3>
          </div>

        </div>


        <div className="user-stat-card">

          <div className="user-stat-icon blocked">
            <UserX size={19} />
          </div>

          <div>
            <span>Blocked</span>
            <h3>221</h3>
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


          <select
            className="user-status-filter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >

            <option>All Status</option>

            <option>Active</option>

            <option>Blocked</option>

          </select>

        </div>


        {/* =================================================
            USERS TABLE
        ================================================= */}

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

                  {/* User */}

                  <td>

                    <div className="user-info">

                      <div className="user-avatar">

                        {user.name
                          .charAt(0)
                          .toUpperCase()}

                      </div>

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


                  {/* Phone */}

                  <td>

                    <span className="user-phone">
                      {user.phone}
                    </span>

                  </td>


                  {/* Orders */}

                  <td>

                    <span className="user-orders">
                      {user.orders}
                    </span>

                  </td>


                  {/* Spent */}

                  <td>

                    <strong className="user-spent">
                      ₹{user.spent.toLocaleString("en-IN")}
                    </strong>

                  </td>


                  {/* Joined */}

                  <td>

                    <span className="user-joined">
                      {user.joined}
                    </span>

                  </td>


                  {/* Status */}

                  <td>

                    <span
                      className={`user-status ${user.status.toLowerCase()}`}
                    >
                      {user.status}
                    </span>

                  </td>


                  {/* Actions */}

                  <td>

                    <div className="user-actions">

                      <button title="View user">
                        <Eye size={16} />
                      </button>

                      <button title="More">
                        <MoreHorizontal size={17} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}


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
            Showing {filteredUsers.length} of{" "}
            {users.length} users
          </span>


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

    </div>
  );
};

export default Users;