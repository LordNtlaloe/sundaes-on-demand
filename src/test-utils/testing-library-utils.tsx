import { render } from "@testing-library/react";
import { OrderDetailsProvider } from "../contexts/OrderDetails";
import { JSX } from "react";

const renderWithContext = (ui: JSX.Element, options = {}) =>
  render(ui, { wrapper: OrderDetailsProvider, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { renderWithContext as render };
