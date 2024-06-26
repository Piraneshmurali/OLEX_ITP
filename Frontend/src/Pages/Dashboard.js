import React, { useEffect, useState } from "react";
import "./dashboard.css";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { FaShoppingCart } from "react-icons/fa";
import { AiFillSchedule } from "react-icons/ai";
import { PiBellFill } from "react-icons/pi";
import { ImUsers } from "react-icons/im";
import Chart from "react-apexcharts";
import axios from "axios";

export default function Dashboard() {
  const [productCount, setProductCount] = useState(0);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [scheduleCount, setScheduleCount] = useState(0);
  const [employeesCount, setEmployeesCount] = useState(0);
  const [finance, setFinance] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [Mens, setMens] = useState(0);
  const [Womens, setWomens] = useState(0);
  const [Kids, setKids] = useState(0);
  const [hairColoring, setHairColoring] = useState(0);
  const [furniture, setFurniture] = useState(0);
  const [brushes, setBrushes] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await axios.get(
          "http://localhost:8000/api/Product/products"
        );
        setProductCount(productResponse.data.length);

        const appointmentsResponse = await axios.get(
          "http://localhost:8000/api/Book/appointments"
        );
        setAppointmentsCount(appointmentsResponse.data.length);

        const schedulesResponse = await axios.get(
          "http://localhost:8000/api/schedu/schedules"
        );
        setScheduleCount(schedulesResponse.data.length);

        const employeesResponse = await axios.get(
          "http://localhost:8000/api/employees/emps"
        );
        setEmployeesCount(employeesResponse.data.length);

        const financeResponse = await axios.get(
          "http://localhost:8000/api/Fin/trans"
        );
        setFinance(finance.data);

        let incomeTotal = 0;
        let expenseTotal = 0;

        financeResponse.data.forEach((transaction) => {
          if (transaction.type === "Income") {
            incomeTotal += transaction.amount;
          } else if (transaction.type === "Expenses") {
            expenseTotal += transaction.amount;
          }
        });

        setTotalIncome(incomeTotal);
        setTotalExpense(expenseTotal);

        const inventoryResponse = await axios.get(
          "http://localhost:8000/api/Product/products"
        );
        setInventory(inventory.data);

        let mensCount = 0;
        let womensCount = 0;
        let kidsCount = 0;
        let hairColoringCount = 0;
        let furnitureCount = 0;
        let brushesCount = 0;

        inventoryResponse.data.forEach((inventoryitem) => {
          if (inventoryitem.type === "Mens") {
            mensCount += 1;
          } else if (inventoryitem.type === "Womens") {
            womensCount += 1;
          } else if (inventoryitem.type === "Kids") {
            kidsCount += 1;
          } else if (inventoryitem.type === "Hair coloring products") {
            hairColoringCount += 1;
          } else if (inventoryitem.type === "Furniture") {
            furnitureCount += 1;
          } else if (inventoryitem.type === "Brushes") {
            brushesCount += 1;
          }
        });

        setMens(mensCount);
        setWomens(womensCount);
        setKids(kidsCount);
        setHairColoring(hairColoringCount);
        setFurniture(furnitureCount);
        setBrushes(brushesCount);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const incomePercentage = (
      (totalIncome / (totalIncome + totalExpense)) *
      100
    ).toFixed(2);
    const expensePercentage = (
      (totalExpense / (totalIncome + totalExpense)) *
      100
    ).toFixed(2);

    const balance = totalIncome - totalExpense;

    setFinanceChart({
      options: {
        colors: ["#2E93fA", "#66DA26", "#546E7A", "#E91E63", "#FF9800"],
        chart: {
          type: "donut",
          height: 350,
        },
        labels: ["Income", "Expenses"],
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return `${parseFloat(val).toFixed(2)}%`;
          },
        },

        plotOptions: {
          pie: {
            donut: {
              size: "70%",
            },
          },
          total: {
            show: true,
            showAlways: true,
            label: "Balance",
            fontSize: "22px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 600,
            color: "black",
            formatter: function (val) {
              return val.globals.seriesTotals.reduce((a, b) => {
                return a + b;
              }, 0);
            },
          },
        },
      },
      series: [totalIncome, totalExpense],
    });
  }, [totalIncome, totalExpense]);

  const [financeChart, setFinanceChart] = useState({
    options: {},
    series: [],
    labels: [],
  });

  useEffect(() => {
    setInventoryChart({
      options: {
        colors: [
          "#2E93fA",
          "#66DA26",
          "#546E7A",
          "#E91E63",
          "#FF9800",
          "#f0e802",
        ],
        chart: {
          id: "basic-bar",
        },
        xaxis: {
          categories: [""],
        },
      },
      series: [
        {
          name: "Mens",
          data: [Mens],
        },
        {
          name: "Womens",
          data: [Womens],
        },
        {
          name: "Kids",
          data: [Kids],
        },
        {
          name: "Hair Coloring Products",
          data: [hairColoring],
        },
        {
          name: "Furniture",
          data: [furniture],
        },
        {
          name: "Brushes",
          data: [brushes],
        },
      ],
    });
  }, [Mens, Womens, Kids, hairColoring, furniture, brushes]);

  const [inventoryChart, setInventoryChart] = useState({
    options: {
      colors: ["#2E93fA", "#66DA26", "#546E7A", ],
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [""],
      },
    },
    series: [
      {
        name: "Mens",
        data: [Mens],
      },
      {
        name: "Womens",
        data: [Womens],
      },
      {
        name: "Kids",
        data: [Kids],
      },
      {
        name: "Hair Coloring Products",
        data: [hairColoring],
      },
      {
        name: "Furniture",
        data: [furniture],
      },
      {
        name: "Brushes",
        data: [brushes],
      },
    ],
  });

  return (
    <div>
      <Header />
      <div className="dashboard-page">
        <div className="dashboard-header">
          <div className="dashboard-header-left">
            <Sidebar />
            <h1>Dashboard</h1>
          </div>
        </div>
        <div className="dashboard-body">
          <div className="dashboard-summary">
            <div className="summary-block1">
              Products
              <FaShoppingCart className="summary-block-icon" />
              <p className="count">{productCount}</p>
            </div>
            <div className="summary-block2">
              Appointments
              <AiFillSchedule className="summary-block-icon" />
              <p className="count">{appointmentsCount}</p>
            </div>
            <div className="summary-block3">
              Schedules
              <PiBellFill className="summary-block-icon" />
              <p className="count">{scheduleCount}</p>
            </div>
            <div className="summary-block4">
              Employees
              <ImUsers className="summary-block-icon" />
              <p className="count">{employeesCount}</p>
            </div>
          </div>
          <div className="dashboard-charts">
            <div className="chart1">
              <Chart
                options={financeChart.options}
                series={financeChart.series}
                type="donut"
                width="400"
              />
            </div>
            <div className="chart2">
              <Chart
                options={inventoryChart.options}
                series={inventoryChart.series}
                type="bar"
                width="500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
