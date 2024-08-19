import React from 'react';
import { render, screen } from "@testing-library/react";
import App from "../App";
import userEvent from "@testing-library/user-event";

test("Order phases for happy path", async () => {
  const user = userEvent.setup();
  
  // Render app
  const { unmount } = render(<App />);

  // Add ice cream scoops and toppings
  const vanillaInput = await screen.findByRole("spinbutton", { name: "Vanilla" });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1");

  const chocolateInput = screen.getByRole("spinbutton", { name: "Chocolate" });
  await user.clear(chocolateInput);
  await user.type(chocolateInput, "2");

  const cherriesCheckbox = await screen.findByRole("checkbox", { name: "Cherries" });
  await user.click(cherriesCheckbox);

  // Click order summary button
  const orderSummaryButton = screen.getByRole("button", { name: /order sundae/i });
  await user.click(orderSummaryButton);

  // Check summary subtotals and items
  expect(screen.getByRole("heading", { name: "Order Summary" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Scoops: $6.00" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Toppings: $1.50" })).toBeInTheDocument();

  expect(screen.getByText("1 Vanilla")).toBeInTheDocument();
  expect(screen.getByText("2 Chocolate")).toBeInTheDocument();
  expect(screen.getByText("Cherries")).toBeInTheDocument();

  // Accept terms and click button
  const tcCheckbox = screen.getByRole("checkbox", { name: /terms and conditions/i });
  await user.click(tcCheckbox);

  const confirmOrderButton = screen.getByRole("button", { name: /confirm order/i });
  await user.click(confirmOrderButton);

  // Expect "loading" to show
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // Check confirmation page text
  expect(await screen.findByRole("heading", { name: /thank you/i })).toBeInTheDocument();
  expect(screen.queryByText("loading")).not.toBeInTheDocument();
  expect(await screen.findByText(/order number/i)).toBeInTheDocument();

  // Click "new order" button
  await user.click(screen.getByRole("button", { name: /new order/i }));

  // Check that scoops and toppings have been reset
  expect(await screen.findByText("Scoops total: $0.00")).toBeInTheDocument();
  expect(screen.getByText("Toppings total: $0.00")).toBeInTheDocument();

  // Unmount component to trigger network call cancellation on cleanup
  unmount();
});

test("Toppings header is not on summary page if no toppings ordered", async () => {
  const user = userEvent.setup();
  
  // Render app
  render(<App />);

  // Add ice cream scoops but no toppings
  const vanillaInput = await screen.findByRole("spinbutton", { name: "Vanilla" });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1");

  const chocolateInput = screen.getByRole("spinbutton", { name: "Chocolate" });
  await user.clear(chocolateInput);
  await user.type(chocolateInput, "2");

  // Click order summary button
  const orderSummaryButton = screen.getByRole("button", { name: /order sundae/i });
  await user.click(orderSummaryButton);

  // Check scoops and confirm that toppings heading is not present
  expect(screen.getByRole("heading", { name: "Scoops: $6.00" })).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: /toppings/i })).not.toBeInTheDocument();
});
