import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Options from "../Options";
import React from "react";

test("displays image for each scoop option from server", async () => {
  render(<Options optionType="scoops" />);

  // Find images
  const scoopImages = await screen.findAllByRole("img", { name: /scoop$/i });
  expect(scoopImages).toHaveLength(2);

  // Confirm alt text of images
  const altText = scoopImages.map((element) => (element as HTMLImageElement).alt);
  expect(altText).toEqual(["Chocolate scoop", "Vanilla scoop"]);
});

test("Displays image for each toppings option from server", async () => {
  render(<Options optionType="toppings" />);

  // Find images, expect 3 based on what msw returns
  const images = await screen.findAllByRole("img", { name: /topping$/i });
  expect(images).toHaveLength(3);

  // Check the actual alt text for the images
  const imageTitles = images.map((img) => (img as HTMLImageElement).alt);
  expect(imageTitles).toEqual([
    "Cherries topping",
    "M&Ms topping",
    "Hot fudge topping",
  ]);
});

test("don't update total if scoops input is invalid", async () => {
  const user = userEvent.setup();
  render(<Options optionType="scoops" />);

  // Wait for the vanillaInput to appear after the server call
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });

  // Find the scoops subtotal, which starts out at $0.00
  const scoopsSubtotal = screen.getByText("Scoops total: $0.00");

  // Clear the input
  await user.clear(vanillaInput);

  // Type "2.5" and check that the total hasn't updated
  await user.type(vanillaInput, "2.5");
  expect(scoopsSubtotal).toHaveTextContent("$0.00");

  // Do the same test for "100"
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "100");
  expect(scoopsSubtotal).toHaveTextContent("$0.00");

  // Do the same test for "-1"
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "-1");
  expect(scoopsSubtotal).toHaveTextContent("$0.00");
});