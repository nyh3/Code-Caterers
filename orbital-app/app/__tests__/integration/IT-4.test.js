import { render, fireEvent, waitFor } from '@testing-library/react-native';
import DietaryRestrictions from '../../test/restrictions3';

describe('DietaryRestrictions Integration Test', () => {
    it('updates dietary restrictions', async () => {
        const { getByText, getByTestId, queryByText } = render(<DietaryRestrictions />);

        await waitFor(() => getByText('Dietary Restrictions:'));

        fireEvent.changeText(getByTestId('restriction-input'), 'Fish');

        fireEvent.press(getByText('Add Restriction'));

        fireEvent.changeText(getByTestId('restriction-input'), 'Fish');
        fireEvent.press(getByText('Add Restriction'));

        expect(getByText('This restriction has already been added.')).toBeTruthy();

        fireEvent.changeText(getByTestId('restriction-input'), 'Halal');
        fireEvent.press(getByText('Add Restriction'));

        expect(getByText('Adding HALAL or VEGETARIAN as a restriction is not allowed.')).toBeTruthy();

        fireEvent.press(getByText('Delete'));

        expect(queryByText('Fish')).toBeNull();

        fireEvent.press(getByText('Update Dietary Restrictions'));

        await waitFor(() => getByText('Dietary restrictions updated successfully'));

        expect(getByText('Dietary restrictions updated successfully')).toBeTruthy();
    });
});
