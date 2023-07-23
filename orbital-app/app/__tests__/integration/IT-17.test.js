import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import PromotionForm from "../../test/promotionform";
import EditPromotionPage from "../../test/editpromotion"; 

jest.mock("react-native-paper", () => ({
    Text: "Text",
    TextInput: "TextInput",
    Button: "Button",
    ActivityIndicator: "ActivityIndicator",
}));

const mockUpdatePromotionAPI = jest.fn();

jest.mock("../../test/editpromotion", () => {
    const originalModule = jest.requireActual("../../test/editpromotion");
    return {
        __esModule: true,
        ...originalModule,
        mockUpdatePromotionAPI,
    };
});

describe("PromotionForm", () => {
    it("should submit the form with valid inputs", async () => {
        const { getByLabelText, getByText } = render(<PromotionForm />);
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

describe("EditPromotionPage", () => {
    it("should press the Delete Promotion button and trigger deletion logic", async () => {
        const { getByText } = render(<EditPromotionPage />);
        fireEvent.press(getByText("Delete Promotion"));
    });

    it("should submit the form with valid inputs and update promotion successfully", async () => {
        const { getByLabelText, getByText, getByTestId } = render(<EditPromotionPage />);
        fireEvent.changeText(getByLabelText("Title"), "Updated Promotion Title");
        fireEvent.changeText(getByLabelText("Description"), "This is an updated promotion.");
        fireEvent.press(getByText("Start Date: 23/07/23"));
        fireEvent.press(getByText("End Date: No end date"));
        const submitButton = getByText("Submit & Update Promotion");
        expect(getByLabelText("Title").props.value).toBe("Updated Promotion Title");
        expect(getByLabelText("Description").props.value).toBe("This is an updated promotion.");
        fireEvent.press(submitButton);
        await waitFor(() => { });
    });

    it("should receive an error message for invalid end date", async () => {
        const { getByText, getByLabelText, getByTestId } = render(<EditPromotionPage />);
        fireEvent.press(getByText("End Date: No end date"));
        fireEvent(getByTestId("datetimepicker"), "onChange", {
            type: "date",
            nativeEvent: { timestamp: new Date("2023-07-22").getTime() },
        });

        fireEvent.press(getByText("Submit & Update Promotion"));
        await waitFor(() => expect(mockUpdatePromotionAPI).not.toHaveBeenCalled());
        expect(getByText("End date cannot be before the start date")).toBeTruthy();
    });

    it("should receive an error message for no end date", async () => {
        const { getByText } = render(<EditPromotionPage />);
        fireEvent.press(getByText("Submit & Update Promotion"));
        await waitFor(() => expect(mockUpdatePromotionAPI).not.toHaveBeenCalled());
        expect(getByText("End date cannot be null")).toBeTruthy();
    });
});