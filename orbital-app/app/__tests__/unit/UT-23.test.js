import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import AddMenuPage from "../../test/addmenu"; 

jest.mock("react-native-paper", () => ({
    Text: "Text",
    TextInput: "TextInput",
    Button: "Button",
}));

describe("AddMenuPage", () => {
    it("should submit the form with valid inputs", async () => {
        const { getByLabelText, getByText, queryByTestId } = render(<AddMenuPage />);
        fireEvent.changeText(getByLabelText("Name"), "Sample Dish");
        fireEvent.changeText(getByLabelText("Description"), "This is a sample dish.");
        fireEvent.changeText(getByLabelText("Price"), "9.99");
        fireEvent.changeText(getByLabelText("Dietary Restrictions"), "No restrictions");
        expect(getByLabelText("Name").props.value).toBe("Sample Dish");
        expect(getByLabelText("Description").props.value).toBe("This is a sample dish.");
        expect(getByLabelText("Price").props.value).toBe("9.99");
        expect(getByLabelText("Dietary Restrictions").props.value).toBe("No restrictions");
        fireEvent.press(getByText("Submit"));
    });
});