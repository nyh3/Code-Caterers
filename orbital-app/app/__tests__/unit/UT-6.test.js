import { render, fireEvent } from "@testing-library/react-native";
import UserProfile from "../../test/profile2";

describe("UserProfile", () => {
  const userData = {
    image: "https://example.com/profile.jpg",
    username: "JohnDoe",
  };

  it("should render the UserProfile component", () => {
    const { getByText, getByTestId } = render(
      <UserProfile userData={userData} />
    );

    expect(getByText(userData.username)).toBeTruthy();
    expect(getByTestId("update-profile-button")).toBeTruthy();
    expect(getByTestId("restrictions-button")).toBeTruthy();
    expect(getByTestId("reviews-button")).toBeTruthy();
    expect(getByTestId("saved-button")).toBeTruthy();
    expect(getByTestId("sign-out-button")).toBeTruthy();
  });

  it("should call the correct callback functions on button press", () => {
    const mockUpdateProfile = jest.fn();
    const mockRestrictions = jest.fn();
    const mockReview = jest.fn();
    const mockSaved = jest.fn();
    const mockSignOut = jest.fn();

    const { getByTestId } = render(
      <UserProfile
        userData={userData}
        onUpdateProfile={mockUpdateProfile}
        onRestrictions={mockRestrictions}
        onReview={mockReview}
        onSaved={mockSaved}
        onSignOut={mockSignOut}
      />
    );

    fireEvent.press(getByTestId("update-profile-button"));
    fireEvent.press(getByTestId("restrictions-button"));
    fireEvent.press(getByTestId("reviews-button"));
    fireEvent.press(getByTestId("saved-button"));
    fireEvent.press(getByTestId("sign-out-button"));

    expect(mockUpdateProfile).toHaveBeenCalledTimes(1);
    expect(mockRestrictions).toHaveBeenCalledTimes(1);
    expect(mockReview).toHaveBeenCalledTimes(1);
    expect(mockSaved).toHaveBeenCalledTimes(1);
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
