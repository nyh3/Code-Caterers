import { render, fireEvent } from '@testing-library/react-native';
import UserOrOwner from '../../test/choose2';
import '@testing-library/jest-native/extend-expect';

describe('UserOrOwner', () => {
    it('should change selected group to "User" when "User" button is clicked', () => {
        const { getByText } = render(<UserOrOwner />);

        const userButton = getByText('User');
        fireEvent.press(userButton);

        const selectedGroup = userButton.props.children;
        expect(selectedGroup).toBe('User');
    });

    it('should change selected group to "Stall Owner" when "Stall Owner" button is clicked', () => {
        const { getByText } = render(<UserOrOwner />);

        const stallOwnerButton = getByText('Stall Owner');
        fireEvent.press(stallOwnerButton);

        const selectedGroup = stallOwnerButton.props.children;
        expect(selectedGroup).toBe('Stall Owner');
    });
});
