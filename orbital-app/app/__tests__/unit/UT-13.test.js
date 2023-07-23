import { render, fireEvent } from '@testing-library/react-native';
import UpdateProfile from '../../test/updateprofile2';

describe('UpdateProfile', () => {
    test('displays username input field', () => {
        const { getByPlaceholderText } = render(<UpdateProfile />);
        const usernameInput = getByPlaceholderText('Username');
        expect(usernameInput).toBeTruthy();
    });

    test('displays change profile image button', () => {
        const { getByText } = render(<UpdateProfile />);
        const changeProfileImageButton = getByText('Change Profile Image');
        expect(changeProfileImageButton).toBeTruthy();
    });

    test('displays update profile button', () => {
        const { getByText } = render(<UpdateProfile />);
        const updateProfileButton = getByText('Update Profile');
        expect(updateProfileButton).toBeTruthy();
    });

    test('displays error message if username is empty on form submission', () => {
        const { getByText } = render(<UpdateProfile />);
        const updateProfileButton = getByText('Update Profile');
        fireEvent.press(updateProfileButton);

        const errorMessage = getByText('Username cannot be empty');
        expect(errorMessage).toBeTruthy();
    });
});
