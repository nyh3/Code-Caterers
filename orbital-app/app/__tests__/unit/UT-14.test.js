import { render, fireEvent } from '@testing-library/react-native';
import DietaryRestrictions from '../../test/restriction2';

describe('DietaryRestrictions Component', () => {
    test('should add a new dietary restriction', () => {
        const { getByPlaceholderText, getByText, getByTestId } = render(<DietaryRestrictions />);

        const input = getByPlaceholderText('Update your dietary restrictions or food allergies:');
        const addButton = getByText('Add Restriction');

        fireEvent.changeText(input, 'New Restriction');
        fireEvent.press(addButton);

        const restriction = getByTestId('restriction-0');
        expect(restriction.props.children).toBe('NEW RESTRICTION');
    });

    test('should show an error message for duplicate restriction', () => {
        const { getByPlaceholderText, getByText } = render(<DietaryRestrictions />);

        const input = getByPlaceholderText('Update your dietary restrictions or food allergies:');
        const addButton = getByText('Add Restriction');

        fireEvent.changeText(input, 'New Restriction');
        fireEvent.press(addButton);

        fireEvent.changeText(input, 'New Restriction');
        fireEvent.press(addButton);

        const errorMessage = getByText('This restriction has already been added.');
        expect(errorMessage).toBeDefined();
    });

    test('should show an error message for restricted restriction', () => {
        const { getByPlaceholderText, getByText } = render(<DietaryRestrictions />);

        const input = getByPlaceholderText('Update your dietary restrictions or food allergies:');
        const addButton = getByText('Add Restriction');

        fireEvent.changeText(input, 'HALAL');
        fireEvent.press(addButton);

        const errorMessage = getByText('Adding HALAL or VEGETARIAN as a restriction is not allowed.');
        expect(errorMessage).toBeDefined();
    });
});
