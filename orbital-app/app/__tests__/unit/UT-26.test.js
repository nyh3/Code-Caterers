import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import EditMenuPage from "../../test/editmenu"; 

jest.mock("react-native-paper", () => ({
  Text: "Text",
  TextInput: "TextInput",
  Button: "Button",
}));

describe("EditMenuPage", () => {
  it("should submit the form with valid inputs", async () => {
    const { getByLabelText, getByText, queryByTestId } = render(<EditMenuPage />);
    fireEvent.changeText(getByLabelText("Name"), "Sample Dish");
    fireEvent.changeText(getByLabelText("Description"), "This is a sample dish.");
    fireEvent.changeText(getByLabelText("Price"), "9.99");
    fireEvent.changeText(getByLabelText("Dietary Restrictions"), "No restrictions");
    expect(getByLabelText("Name").props.value).toBe("Sample Dish");
    expect(getByLabelText("Description").props.value).toBe("This is a sample dish.");
    expect(getByLabelText("Price").props.value).toBe("9.99");
    expect(getByLabelText("Dietary Restrictions").props.value).toBe("No restrictions");
    fireEvent.press(getByText("Submit & Update Menu"));
  });

  it("should show an error message for invalid dietary restrictions", async () => {
    const { getByLabelText, getByText, queryByText } = render(<EditMenuPage />);
    fireEvent.changeText(getByLabelText("Dietary Restrictions"), "halal");
    fireEvent.press(getByText("Add Restrictions"));
    const errorMessage = queryByText("Adding HALAL or VEGETARIAN as a restriction is not allowed.");
    expect(errorMessage).toBeTruthy();
  });

  it("should show an error message for duplicated dietary restrictions", async () => {
    const { getByLabelText, getByText, queryByText } = render(<EditMenuPage />);
    fireEvent.changeText(getByLabelText("Dietary Restrictions"), "Fish");
    fireEvent.press(getByText("Add Restrictions"));
    fireEvent.changeText(getByLabelText("Dietary Restrictions"), "Fish");
    fireEvent.press(getByText("Add Restrictions"));
    const errorMessage = queryByText("This restriction has already been added.");
    expect(errorMessage).toBeTruthy();
  });
});