import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Home from "../../test/stallownerhome";

describe("Home", () => {
    it("should call the onLogout event handler when Log Out button is pressed", () => {
        const mockOnLogout = jest.fn();
        const { getByText } = render(
            <Home
                name="John Doe"
                stallImage="https://example.com/stallImage.jpg"
                onStallProfile={() => { }}
                onMenu={() => { }}
                onPromotions={() => { }}
                onReviews={() => { }}
                onLogout={mockOnLogout} 
            />
        );
        const logOutButton = getByText("Log Out");
        fireEvent.press(logOutButton);
        expect(mockOnLogout).toHaveBeenCalledTimes(1);
    });
});