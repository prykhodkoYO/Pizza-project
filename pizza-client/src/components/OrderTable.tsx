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
import "./tableStyles.css";
import { useTheme } from "@table-library/react-table-library/theme";
import { customTableTheme } from "./tableTheme.ts";
import {
  useSort,
  HeaderCellSort,
  SortToggleType,
} from "@table-library/react-table-library/sort";

interface Order {
  id: number;
  description: string;
  amount: number;
  createdAt: string;
  customer: {
    id: number;
    phoneNumber: string;
  };
}

const OrdersTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const LIMIT = 10;
  const theme = useTheme(customTableTheme);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: LIMIT },
      };
      try {
        const res = await axios.get(
          "http://localhost:3001/api/order/get-pages",
          config
        );
        setOrders(res.data.data);
        setTotal(res.data.total);
      } catch (err) {
        console.error("Error getting orders:", err);
      }
    };

    fetchOrders();
  }, [page]);

  const totalPages = Math.ceil(total / LIMIT);

  const sort = useSort(
    { nodes: orders },
    {},
    {
      sortToggleType: SortToggleType.AlternateWithReset,
      sortFns: {
        ID: (array) => array.sort((a, b) => a.number - b.number),
        AMOUNT: (array) => array.sort((a, b) => a.amount - b.amount),
        DATE: (array) => array.sort((a, b) => a.createdAt - b.createdAt),
      },
    }
  );

  const handleSearchAmount = (event) => {
    setAmount(event.target.value);
  };

  const handleSearchDescription = (event) => {
    setDescription(event.target.value);
  };

  const handleSearchPhone = (event) => {
    setPhone(event.target.value);
  };

  const data = {
    nodes: orders.filter(
      (item) =>
        item.amount - amount >= 0 &&
        item.description.toLowerCase().includes(description.toLowerCase()) &&
        item.customer.phoneNumber.includes(phone)
    ),
  };

  return (
    <>
      <label htmlFor="search">
        Search by amount:&nbsp;
        <input
          id="search"
          type="text"
          value={amount}
          onChange={handleSearchAmount}
        />
      </label>
      <br />

      <label htmlFor="search">
        Search by product:&nbsp;
        <input
          id="search"
          type="text"
          value={description}
          onChange={handleSearchDescription}
        />
      </label>
      <br />

      <label htmlFor="search">
        Search by phone number:&nbsp;
        <input
          id="search"
          type="text"
          value={phone}
          onChange={handleSearchPhone}
        />
      </label>
      <br />

      <Table data={data} className="custom-table" theme={theme} sort={sort}>
        {(tableList) => (
          <>
            <Header>
              <HeaderRow>
                <HeaderCellSort sortKey="ID">ID</HeaderCellSort>
                <HeaderCell resize>Description</HeaderCell>
                <HeaderCellSort sortKey="AMOUNT">
                  Amount (hryvnias)
                </HeaderCellSort>
                <HeaderCellSort sortKey="DATE">Date</HeaderCellSort>
                <HeaderCell>Customer phone number</HeaderCell>
              </HeaderRow>
            </Header>

            <Body>
              {tableList.map((item) => (
                <Row key={item.id} item={item}>
                  <Cell>{item.id}</Cell>
                  <Cell>
                    <div className="cell-content">{item.description}</div>
                  </Cell>
                  <Cell>{item.amount}</Cell>
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
                  <Cell>{item.customer.phoneNumber}</Cell>
                </Row>
              ))}
            </Body>
          </>
        )}
      </Table>

      {/* Pagination */}
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
    </>
  );
};

export default OrdersTable;
