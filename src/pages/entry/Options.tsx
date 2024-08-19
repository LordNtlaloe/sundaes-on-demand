import axios from "axios";
import { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import ScoopOption from "./ScoopOption";
import ToppingOption from "./ToppingOption";
import AlertBanner from "../common/AlertBanner";
import { pricePerItem } from "../../constants";
import { formatCurrency } from "../../utilities";
import { useOrderDetails } from "../../contexts/OrderDetails";
import React from "react";

// Define the props for the Options component
interface OptionsProps {
  optionType: "scoops" | "toppings"; // Restrict to these specific strings
}

interface Item {
  name: string;
  imagePath: string;
}

export default function Options({ optionType }: OptionsProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<boolean>(false);
  const { totals } = useOrderDetails();

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`http://localhost:3030/${optionType}`, { signal: controller.signal })
      .then((response) => setItems(response.data))
      .catch((error) => {
        if (error.name !== "CanceledError") setError(true);
      });

    return () => controller.abort();
  }, [optionType]);

  if (error) {
    return <AlertBanner message={undefined} variant={undefined} />;
  }

  const ItemComponent = optionType === "scoops" ? ScoopOption : ToppingOption;
  const title = optionType[0].toUpperCase() + optionType.slice(1).toLowerCase();

  const optionItems = items.map((item) => (
    <ItemComponent key={item.name} name={item.name} imagePath={item.imagePath} />
  ));

  return (
    <>
      <h2>{title}</h2>
      <p>{formatCurrency(pricePerItem[optionType])} each</p>
      <p>
        {title} total: {formatCurrency(totals[optionType])}
      </p>
      <Row>{optionItems}</Row>
    </>
  );
}
