import React, { useState, useEffect } from "react";
import OrderTable from "../components/OrderTable.tsx";
import CustomerTable from "../components/CustomerTable.tsx";
import LogoutButton from '../components/LogoutButton.tsx';
import AdminTable from "../components/AdminTable.tsx";
import { jwtDecode } from 'jwt-decode';
import "./dashboardStyles.css";

interface DecodedToken {
  isSuperAdmin: boolean;
}

const DashboardPage = () => {
  const [activeTable, setActiveTable] = useState<"orders" | "customers" | "admins" |  null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setIsSuperAdmin(decoded.isSuperAdmin);
    } catch (err) {
      console.error("Token decoding error", err);
    }
  }
}, []);

  return (
    <div className="dashboard-container">
      <LogoutButton/>
      <h1 className="dashboard-header">Admin Panel</h1>

      <div className="dashboard-buttons">
        <button
          onClick={() => setActiveTable("orders")}
          className="menu-buttons"
        >
          Orders
        </button>

        <button
          onClick={() => setActiveTable("customers")}
          className="menu-buttons"
        >
          Customers
        </button>

        {isSuperAdmin && (
          <button
            onClick={() => setActiveTable("admins")}
            className="menu-buttons"
          >
            Administrators
          </button>
        )}
      </div>
    
    <div style={{ textAlign: "left" }}>
      {activeTable === "orders" && <OrderTable />}
      {activeTable === "customers" && <CustomerTable />}
      {activeTable === "admins" && isSuperAdmin && <AdminTable />}
    </div>
    </div>
  );
};

export default DashboardPage;