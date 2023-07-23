import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import EditMenuPage from "../../test/editmenu"; 

jest.mock("react-native-paper", () => ({
  Text: "Text",
  TextInput: "TextInput",
  Button: "Button",
  ActivityIndicator: "ActivityIndicator",
}));

describe("EditMenuPage", () => {
  it("should submit the form with valid inputs", async () => {
    const { getByLabelText, getByText, queryByTestId } = render(<EditMenuPage />);
    fireEvent.changeText(getByLabelText("Name"), "Updated Dish");
    fireEvent.changeText(getByLabelText("Description"), "This is an updated dish.");
    fireEvent.changeText(getByLabelText("Price"), "12.99");
    fireEvent.changeText(getByLabelText("Dietary Restrictions"), "No restrictions");
    expect(getByLabelText("Name").props.value).toBe("Updated Dish");
    expect(getByLabelText("Description").props.value).toBe("This is an updated dish.");
    expect(getByLabelText("Price").props.value).toBe("12.99");
    expect(getByLabelText("Dietary Restrictions").props.value).toBe("No restrictions");
    fireEvent.press(getByText("Submit & Update Menu"));
  });
});