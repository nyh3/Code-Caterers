import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import PromotionForm from "../../test/promotionform"; 

jest.mock("react-native-paper", () => ({
  Text: "Text",
  TextInput: "TextInput",
  Button: "Button",
  ActivityIndicator: "ActivityIndicator",
}));

describe("PromotionForm", () => {
  it("should submit the form with valid inputs", async () => {
    const { getByLabelText, getByText, queryByTestId } = render(<PromotionForm />);
    fireEvent.changeText(getByLabelText("Title"), "Sample Promotion");
    fireEvent.changeText(getByLabelText("Description"), "This is a sample promotion.");
    const startDateButton = getByText("Start Date: 23/07/23");
    const endDateButton = getByText("End Date: No end date");
    expect(getByLabelText("Title").props.value).toBe("Sample Promotion");
    expect(getByLabelText("Description").props.value).toBe("This is a sample promotion.");
    expect(startDateButton).toBeTruthy();
    expect(endDateButton).toBeTruthy();
    fireEvent.press(getByText("Submit"));
  });
});