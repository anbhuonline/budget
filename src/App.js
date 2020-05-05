import React, { useState, useEffect } from "react";
import { v1 as uuid } from "uuid";
import Alert from "./Components/Alert";
import ExpenseForm from "./Components/ExpenseForm";
import ExpenseList from "./Components/ExpenseList";
import "./App.css";
import { MdAccountBalanceWallet } from "react-icons/md";

const initialExpenses = localStorage.getItem("expenses")
  ? JSON.parse(localStorage.getItem("expenses"))
  : [];

// const initialExpenses = [
//   {
//     id: uuid(),
//     charge: "rent",
//     amount: 6000,
//   },
//   {
//     id: uuid(),
//     charge: "eb",
//     amount: 2000,
//   },
//   {
//     id: uuid(),
//     charge: "water",
//     amount: 300,
//   },
// ];
function App() {
  //*********************state values**************************************************
  const [expenses, setExpenses] = useState(initialExpenses);
  const [charge, setCharge] = useState("");
  const [amount, setAmount] = useState("");
  const [alert, setAlert] = useState({ show: false });
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState(0);

  //********************* use effect**********************************************
  useEffect(() => {
    console.log("Effect");
    return () => {
      localStorage.setItem("expenses", JSON.stringify(expenses));
    };
  });

  //********************* functionalities**********************************************
  const handleCharge = (e) => {
    setCharge(e.target.value);
  };

  const handleAmount = (e) => {
    setAmount(e.target.value);
  };

  const handleEdit = (id) => {
    let expense = expenses.find((item) => item.id === id);
    setCharge(expense.charge);
    setAmount(expense.amount);
    setEdit(true);
    setId(id);
  };

  const handleDelete = (id) => {
    const tempExpense = expenses.filter((item) => item.id !== id);
    setExpenses(tempExpense);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (charge !== "" && amount > 0) {
      if (edit) {
        let tempExpense = expenses.map((item) => {
          return item.id === id ? { ...item, charge, amount } : item;
        });
        setExpenses(tempExpense);
        setEdit(false);
        handleAlert({ type: "success", text: "Edited successfully" });
      } else {
        const singleExpense = { id: uuid(), charge: charge, amount: amount };
        setExpenses([...expenses, singleExpense]);
        handleAlert({ type: "success", text: "Items added" });
      }
    } else {
      handleAlert({
        type: "danger",
        text: "expense or amount cannot be empty",
      });
    }
    setCharge("");
    setAmount("");
    setEdit(false);
  };

  const clearItems = (e) => {
    setExpenses([]);
    handleAlert({ type: "danger", text: "All items cleared" });
  };

  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ show: false });
    }, 3000);
  };

  return (
    <div>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      <Alert />
      <h1>
        Budget Expense Calculator
        <MdAccountBalanceWallet className="btn-icon" />
      </h1>

      <main className="App">
        <ExpenseForm
          charge={charge}
          amount={amount}
          handleCharge={handleCharge}
          handleAmount={handleAmount}
          handleSubmit={handleSubmit}
          edit={edit}
        />
        <ExpenseList
          expenses={expenses}
          clearItems={clearItems}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      </main>
      <h1>
        total spending : Rs.{""}
        <span className="total">
          {expenses.reduce((acc, curr) => {
            // console.log(curr.amount);
            return (acc += parseInt(curr.amount));
          }, 0)}
        </span>
      </h1>
    </div>
  );
}

export default App;
