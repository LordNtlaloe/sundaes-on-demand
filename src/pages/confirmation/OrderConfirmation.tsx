import { useEffect, useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { useOrderDetails } from "../../contexts/OrderDetails";
import AlertBanner from "../common/AlertBanner";
import React from "react";

// Define a type for the order phase to avoid magic strings
type OrderPhase = "inProgress" | "completed" | "pending";

interface OrderConfirmationProps {
  setOrderPhase: (phase: OrderPhase) => void;
}

export default function OrderConfirmation({ setOrderPhase }: OrderConfirmationProps) {
  const { resetOrder } = useOrderDetails();
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    axios
      // In a real app, we would get order details from context and send them with the POST request
      .post(`http://localhost:3030/order`)
      .then((response) => {
        setOrderNumber(response.data.orderNumber);
      })
      .catch(() => setError(true));
  }, []);

  function handleClick() {
    // Clear the order details
    resetOrder();

    // Send back to order page
    setOrderPhase("inProgress");
  }

  const newOrderButton = <Button onClick={handleClick}>Create new order</Button>;

  if (error) {
    return (
      <>
        <AlertBanner message="An error occurred. Please try again." variant="danger" />
        {newOrderButton}
      </>
    );
  }

  if (orderNumber !== null) {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>Thank You!</h1>
        <p>Your order number is {orderNumber}</p>
        <p style={{ fontSize: "25%" }}>
          As per our terms and conditions, nothing will happen now
        </p>
        {newOrderButton}
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}
