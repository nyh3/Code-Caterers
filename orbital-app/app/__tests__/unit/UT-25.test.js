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
  it("should press the Delete button and trigger deletion logic", async () => {
    const { getByText } = render(<EditMenuPage />);
    fireEvent.press(getByText("Delete Menu"));
  });
});