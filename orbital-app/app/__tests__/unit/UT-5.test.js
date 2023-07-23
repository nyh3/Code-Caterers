import { render, fireEvent } from '@testing-library/react-native';
import FilterPage from '../../test/filter2';

const locations = [
    { id: 1, name: 'Location 1' },
    { id: 2, name: 'Location 2' },
    { id: 3, name: 'Location 3' },
];

const cuisines = [
    { id: 1, name: 'Cuisine 1' },
    { id: 2, name: 'Cuisine 2' },
    { id: 3, name: 'Cuisine 3' },
];

describe('FilterPage', () => {
    it('should render all UI elements correctly', () => {
        const { getByText, getByPlaceholderText } = render(<FilterPage locations={locations} cuisines={cuisines} />);

        expect(getByText('Select your preferences:')).toBeTruthy();
        expect(getByText('Dietary Restrictions Retrieved:')).toBeTruthy();
        expect(getByText('Input Budget:')).toBeTruthy();
        expect(getByPlaceholderText('Budget')).toBeTruthy();
        expect(getByText('Select Location:')).toBeTruthy();
        expect(getByText('Select Cuisine:')).toBeTruthy();
        expect(getByText('Select Air Conditioning:')).toBeTruthy();
        expect(getByText('Select Halal:')).toBeTruthy();
        expect(getByText('Select Vegetarian:')).toBeTruthy();
        expect(getByText('Reset Filter')).toBeTruthy();
    });

    it('should update budget input correctly', () => {
        const { getByPlaceholderText } = render(<FilterPage locations={locations} cuisines={cuisines} />);

        const budgetInput = getByPlaceholderText('Budget');
        fireEvent.changeText(budgetInput, '10');

        expect(budgetInput.props.value).toBe('10');
    });

    it('should toggle air conditioning switch correctly', () => {
        const { getByTestId } = render(<FilterPage locations={locations} cuisines={cuisines} />);

        const airConSwitch = getByTestId('has-air-con-switch');
        fireEvent(airConSwitch, 'onValueChange', true);

        expect(airConSwitch.props.value).toBe(true);
    });

    it('should toggle halal switch correctly', () => {
        const { getByTestId } = render(<FilterPage locations={locations} cuisines={cuisines} />);

        const halalSwitch = getByTestId('has-halal-switch');
        fireEvent(halalSwitch, 'onValueChange', true);

        expect(halalSwitch.props.value).toBe(true);
    });

    it('should toggle vegetarian switch correctly', () => {
        const { getByTestId } = render(<FilterPage locations={locations} cuisines={cuisines} />);

        const vegetarianSwitch = getByTestId('is-vegetarian-switch');
        fireEvent(vegetarianSwitch, 'onValueChange', true);

        expect(vegetarianSwitch.props.value).toBe(true);
    });

    it('should reset filters correctly', () => {
        const { getByText, getByPlaceholderText, getByTestId } = render(<FilterPage locations={locations} cuisines={cuisines} />);

        const budgetInput = getByPlaceholderText('Budget');
        fireEvent.changeText(budgetInput, '10');

        const airConSwitch = getByTestId('has-air-con-switch');
        fireEvent(airConSwitch, 'onValueChange', true);

        const halalSwitch = getByTestId('has-halal-switch');
        fireEvent(halalSwitch, 'onValueChange', true);

        const vegetarianSwitch = getByTestId('is-vegetarian-switch');
        fireEvent(vegetarianSwitch, 'onValueChange', true);

        const resetButton = getByText('Reset Filter');
        fireEvent.press(resetButton);

        expect(budgetInput.props.value).toBe('');
        expect(airConSwitch.props.value).toBe(false);
        expect(halalSwitch.props.value).toBe(false);
        expect(vegetarianSwitch.props.value).toBe(false);
    });
})