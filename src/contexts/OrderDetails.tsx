import React, { createContext, useContext, useState, ReactNode } from "react";
import { pricePerItem } from "../constants";

// Define the structure of the order details context
interface OptionCounts {
  [key: string]: { [itemName: string]: number };
}

interface OrderDetailsValue {
  optionCounts: OptionCounts;
  totals: {
    scoops: number;
    toppings: number;
  };
  updateItemCount: (itemName: string, newItemCount: number, optionType: string) => void;
  resetOrder: () => void;
}

interface OrderDetailsProviderProps {
  children: ReactNode;
}

type OptionType = "scoops" | "toppings";

// Create context with undefined initial value
const OrderDetails = createContext<OrderDetailsValue | undefined>(undefined);

// Custom hook to check whether we're in a provider
export function useOrderDetails() {
  const contextValue = useContext(OrderDetails);

  if (!contextValue) {
    throw new Error("useOrderDetails must be called from within an OrderDetailsProvider");
  }

  return contextValue;
}

// Provider component
export function OrderDetailsProvider({ children }: OrderDetailsProviderProps) {
  const [optionCounts, setOptionCounts] = useState<OptionCounts>({
    scoops: {},
    toppings: {},
  });

  function updateItemCount(itemName: string, newItemCount: number, optionType: string) {
    // Make a copy of existing state
    const newOptionCounts = { ...optionCounts };

    // Update the copy with the new information
    newOptionCounts[optionType][itemName] = newItemCount;

    // Update the state with the updated copy
    setOptionCounts(newOptionCounts);
  }

  function resetOrder() {
    setOptionCounts({ scoops: {}, toppings: {} });
  }

  // Utility function to derive totals from optionCounts state value
  function calculateTotal(optionType: OptionType) {
    // Get an array of counts for the option type (for example, [1, 2])
    const countsArray = Object.values(optionCounts[optionType]);
  
    // Total the values in the array of counts for the number of items
    const totalCount = countsArray.reduce((total, value) => total + value, 0);
  
    // Multiply the total number of items by the price for this item type
    return totalCount * pricePerItem[optionType];
  }
  

  const totals = {
    scoops: calculateTotal("scoops"),
    toppings: calculateTotal("toppings"),
  };

  const value: OrderDetailsValue = { optionCounts, totals, updateItemCount, resetOrder };
  
  return <OrderDetails.Provider value={value}>{children}</OrderDetails.Provider>;
}
