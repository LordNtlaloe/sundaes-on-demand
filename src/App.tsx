import React, { useState, FC } from "react";
import Container from "react-bootstrap/Container";

import OrderConfirmation from "./pages/confirmation/OrderConfirmation";
import OrderEntry from "./pages/entry/OrderEntry";
import OrderSummary from "./pages/summary/OrderSummary";
import { OrderDetailsProvider } from "./contexts/OrderDetails";

// Define the possible order phases
type OrderPhase = "inProgress" | "review" | "completed";

export default function App() {
  const [orderPhase, setOrderPhase] = useState<OrderPhase>("inProgress");

  // Determine which component to render based on the orderPhase
  let Component: FC<any> = OrderEntry; // Use FC<any> for generic component type

  switch (orderPhase) {
    case "inProgress":
      Component = OrderEntry;
      break;
    case "review":
      Component = OrderSummary;
      break;
    case "completed":
      Component = OrderConfirmation;
      break;
    default:
      // Optional: handle unexpected cases or default to a specific component
      Component = OrderEntry;
      break;
  }

  return (
    <OrderDetailsProvider>
      <Container>
        <Component setOrderPhase={setOrderPhase} />
      </Container>
    </OrderDetailsProvider>
  );
}