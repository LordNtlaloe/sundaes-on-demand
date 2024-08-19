import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useOrderDetails } from "../../contexts/OrderDetails";

interface ScoopOptionsProps {
  name: string;
  imagePath: string;
}

export default function ScoopOptions({ name, imagePath }: ScoopOptionsProps) {
  const { updateItemCount } = useOrderDetails();
  const [isValid, setIsValid] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = event.target.value;
    const currentValueFloat = parseFloat(currentValue);
    const valueIsValid =
      0 <= currentValueFloat &&
      currentValueFloat <= 10 &&
      Math.floor(currentValueFloat) === currentValueFloat;

    setIsValid(valueIsValid);
    const newValue = valueIsValid ? parseInt(currentValue) : 0;
    updateItemCount(name, newValue, "scoops");
  };

  return (
    <Col xs={12} sm={6} md={4} lg={3} style={{ textAlign: "center" }}>
      <img
        style={{ width: "75%" }}
        src={`http://localhost:3030/${imagePath}`}
        alt={`${name} scoop`}
      />
      <Form.Group
        controlId={`${name}-count`}
        as={Row}
        style={{ marginTop: "10px" }}
      >
        <Form.Label column xs="6" style={{ textAlign: "right" }}>
          {name}
        </Form.Label>
        <Col xs="5" style={{ textAlign: "left" }}>
          <Form.Control
            type="number"
            defaultValue={0}
            onChange={handleChange}
            isInvalid={!isValid}
            aria-label={`${name} scoop count`}
          />
          {!isValid && (
            <Form.Control.Feedback type="invalid">
              Please enter a valid number between 0 and 10.
            </Form.Control.Feedback>
          )}
        </Col>
      </Form.Group>
    </Col>
  );
}
