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
import { customTableTheme } from './tableTheme.ts';
import "./tableStyles.css";

interface Customer {
  id: number;
  phoneNumber: string;
  createdAt: string;
}

const CustomersTable = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const LIMIT = 5;

  const theme = useTheme(customTableTheme);

  const fetchCustomers = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, limit: LIMIT },
    };

    try {
      const res = await axios.get(
        "http://localhost:3001/api/customer/get-pages",
        config
      );
      setCustomers(res.data.data);
      setTotal(res.data.total);
    } catch (error) {
      console.error("Error getting customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const handleDeleteCustomer = async () => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      await axios.delete(
        `http://localhost:3001/api/customer/${customerIdToDelete}`,
        config
      );
      setShowDeleteModal(false);
      setCustomerIdToDelete("");
      fetchCustomers();
      alert("Customer deleted successfully");
    } catch (err: any) {
      alert(err.response?.data?.message || "Error deleting customer");
    }
  };

  const filteredCustomers = customers.filter((c) =>
    c.phoneNumber.includes(phoneFilter)
  );

  const data = { nodes: filteredCustomers };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <>
      <label htmlFor="search">
        Search by phone number:&nbsp;
        <input
          id="search"
          type="text"
          value={phoneFilter}
          onChange={(e) => setPhoneFilter(e.target.value)}
        />
      </label>

      <br />

      <Table data={data} className="custom-table" theme={theme}>
        {(tableList) => (
          <>
            <Header>
              <HeaderRow>
                <HeaderCell>ID</HeaderCell>
                <HeaderCell>Phone Number</HeaderCell>
                <HeaderCell>Date</HeaderCell>
              </HeaderRow>
            </Header>

            <Body>
              {tableList.map((item) => (
                <Row key={item.id} item={item}>
                  <Cell>{item.id}</Cell>
                  <Cell>{item.phoneNumber}</Cell>
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
        <button
          onClick={() => setShowDeleteModal(true)}
          className="menu-buttons"
        >
          Delete customer
        </button>
      </div>

      <div className="pagination-container">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`pagination-button ${p === page ? "active" : ""}`}
          >
            {p}
          </button>
        ))}
      </div>

      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Delete customer</h3>
            <input
              placeholder="Customer ID"
              value={customerIdToDelete}
              onChange={(e) => setCustomerIdToDelete(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="menu-buttons" onClick={handleDeleteCustomer}>
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

export default CustomersTable;