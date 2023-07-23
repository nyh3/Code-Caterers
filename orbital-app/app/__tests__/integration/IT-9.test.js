import { render, fireEvent } from '@testing-library/react-native';
import FilterPage from '../../test/filter3';

describe('FilterPage Integration Test', () => {
    test('should filter food options based on selected preferences', async () => {
        const { getByText, getByPlaceholderText } = render(<FilterPage />);

        const budgetInput = getByPlaceholderText('Budget');
        fireEvent.changeText(budgetInput, '10');

        const locationButton = getByText('Select Location');
        fireEvent.press(locationButton);

        const cuisineButton = getByText('Select Cuisine');
        fireEvent.press(cuisineButton);

        const airConSwitch = getByText('Select Air Conditioning:');
        fireEvent.press(airConSwitch);

        const halalSwitch = getByText('Select Halal:');
        fireEvent.press(halalSwitch);

        const vegetarianSwitch = getByText('Select Vegetarian:');
        fireEvent.press(vegetarianSwitch);

        const resetButton = getByText('Reset Filter');
        fireEvent.press(resetButton);

        const filteredOptions = getByText('Here are your 3 Recommendations:');
        expect(filteredOptions).toBeTruthy();

        const selectedLocation = getByText('Select Location');
        expect(selectedLocation).toBeTruthy();

        const selectedCuisine = getByText('Select Cuisine');
        expect(selectedCuisine).toBeTruthy();

        const selectedAirCon = getByText('Select Air Conditioning:');
        expect(selectedAirCon).toBeTruthy();

        const selectedHalal = getByText('Select Halal:');
        expect(selectedHalal).toBeTruthy();

        const selectedVegetarian = getByText('Select Vegetarian:');
        expect(selectedVegetarian).toBeTruthy();
    });
});
