import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import PromotionForm from "../../test/promotionform"; 

jest.mock("react-native-paper", () => ({
  Text: "Text",
  TextInput: "TextInput",
  Button: "Button",
  ActivityIndicator: "ActivityIndicator",
}));

describe("PromotionForm", () => {
  it("should submit the form with valid inputs and update promotion successfully", async () => {
    const { getByLabelText, getByText } = render(<PromotionForm />);
    fireEvent.changeText(getByLabelText("Title"), "Updated Promotion Title");
    fireEvent.changeText(getByLabelText("Description"), "This is an updated promotion.");
    fireEvent.press(getByText("Start Date: 23/07/23"));
    fireEvent.press(getByText("End Date: No end date"));
    const submitButton = getByText("Submit");
    expect(getByLabelText("Title").props.value).toBe("Updated Promotion Title");
    expect(getByLabelText("Description").props.value).toBe("This is an updated promotion.");
    fireEvent.press(submitButton);
    await waitFor(() => { });
  });
});