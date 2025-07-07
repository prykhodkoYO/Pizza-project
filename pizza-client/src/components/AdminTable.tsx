import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Header,
  Body,
  Row,
  Cell,
  HeaderRow,
  HeaderCell,
} from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import { customTableTheme } from "./tableTheme.ts";

const AdminsTable = () => {
  const [admins, setAdmins] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [adminIdToDelete, setAdminIdToDelete] = useState("");

  const theme = useTheme(customTableTheme);

  const fetchAdmins = async () => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const res = await axios.get(
        "http://localhost:3001/api/admin/get-all",
        config
      );
      setAdmins(res.data);
    } catch (err) {
      console.error("Error getting administrators:", err);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async () => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      await axios.post(
        "http://localhost:3001/api/admin/create-admin",
        {
          username: newUsername,
          password: newPassword,
        },
        config
      );
      setShowAddModal(false);
      setNewUsername("");
      setNewPassword("");
      fetchAdmins();
    } catch (err) {
      alert("Error adding admin");
    }
  };

  const handleDeleteAdmin = async () => {
    if (!window.confirm("Are you sure you want to remove this admin?")) {
      return;
    }
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      await axios.delete(
        `http://localhost:3001/api/admin/${adminIdToDelete}`,
        config
      );
      setShowDeleteModal(false);
      setAdminIdToDelete("");
      fetchAdmins();
      alert("Admin removed");
    } catch (err: any) {
      alert(err.response?.data?.message || "Error deleting admin");
    }
  };

  const data = { nodes: admins };

  return (
    <>
      <Table data={data} className="custom-table" theme={theme}>
        {(tableList) => (
          <>
            <Header>
              <HeaderRow>
                <HeaderCell>ID</HeaderCell>
                <HeaderCell>Username</HeaderCell>
                <HeaderCell>Role</HeaderCell>
                <HeaderCell>Date</HeaderCell>
              </HeaderRow>
            </Header>

            <Body>
              {tableList.map((item) => (
                <Row key={item.id} item={item}>
                  <Cell>{item.id}</Cell>
                  <Cell>{item.username}</Cell>
                  <Cell>{item.isSuperAdmin ? "Superadmin" : "Admin"}</Cell>
                  <Cell>
                    {new Date(item.createdAt).toLocaleString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </Cell>
                </Row>
              ))}
            </Body>
          </>
        )}
      </Table>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setShowAddModal(true)} className="menu-buttons">
          Add admin
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="menu-buttons"
        >
          Delete admin
        </button>
      </div>

      {/* Modal: Add Admin */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add admin</h3>
            <input
              placeholder="Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="menu-buttons" onClick={handleAddAdmin}>
                Confirm
              </button>
              <button
                className="menu-buttons"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Delete Admin */}
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Delete admin</h3>
            <input
              placeholder="admin ID"
              value={adminIdToDelete}
              onChange={(e) => setAdminIdToDelete(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="menu-buttons" onClick={handleDeleteAdmin}>
                Delete
              </button>
              <button
                className="menu-buttons"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminsTable;
