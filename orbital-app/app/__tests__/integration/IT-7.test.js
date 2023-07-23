import { render, fireEvent } from '@testing-library/react-native';
import StallPage from '../../test/index3';

jest.mock('expo-router', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

describe('StallPage Integration Test', () => {
    it('should render stalls and handle search and sorting', () => {
        const mockStalls = [
            {
                id: 1,
                name: 'Stall 1',
                location: {
                    name: 'Location 1',
                },
                cuisine: {
                    name: 'Chinese',
                },
                rating: 4.5,
                stallImage: 'https://example.com/stall1.jpg',
            },
        ];

        const mockPromotions = [
            {
                id: 1,
                title: 'Promotion 1',
                description: 'This is a promotion.',
                start_date: '2023-07-20T00:00:00Z',
                end_date: '2023-07-31T23:59:59Z',
            },
        ];

        const { getByText, getByPlaceholderText } = render(<StallPage />, {
            initialState: {
                stalls: mockStalls,
                promotions: mockPromotions,
            },
        });

        const stallName1 = getByText('Stall 1 @ Location 1');
        expect(stallName1).toBeTruthy();

        const searchInput = getByPlaceholderText('Search for stalls...');
        fireEvent.changeText(searchInput, 'Stall 1');
        expect(getByText('Stall 1 @ Location 1')).toBeTruthy();
        fireEvent.changeText(searchInput, '');

        const sortDropdown = getByText('Sort By:');
        fireEvent.press(sortDropdown);
        expect(getByText('Stall 1 @ Location 1')).toBeTruthy();
    });
});
