import { render, fireEvent, waitFor } from '@testing-library/react-native';
import UpdateProfile from '../../test/updateprofile3';

describe('UpdateProfile Integration Test', () => {
    it('updates username and profile image', async () => {
        const handleProfileUpdateMock = jest.fn();
        const { getByText, getByTestId, queryByText } = render(<UpdateProfile onProfileUpdate={handleProfileUpdateMock} />);

        await waitFor(() => getByText('Username:'));

        fireEvent.changeText(getByTestId('username-input'), 'newtestuser');

        fireEvent.press(getByText('Update Profile'));

        await waitFor(() => queryByText('Profile updated successfully:'));

        expect(handleProfileUpdateMock).toHaveBeenCalledWith({
            username: 'newtestuser',
        });
    });
});
