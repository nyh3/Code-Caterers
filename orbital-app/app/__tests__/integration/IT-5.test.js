import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ReviewsPage from '../../test/reviews3';

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useIsFocused: jest.fn(() => true),
}));

const mockReviews = [
    {
        id: 1,
        menu: {
            name: 'Menu Item 1',
            stall: {
                name: 'Stall 1',
            },
        },
        rating: 4.5,
        review_text: 'This is a great menu item!',
        image: 'https://example.com/image1.jpg',
        updated_at: '2023-07-23T12:34:56',
    },
];

describe('ReviewsPage Integration Test', () => {
    it('displays user reviews', async () => {
        const { getByText, getByTestId } = render(
            <ReviewsPage userId="user123" reviews={mockReviews} loading={false} onEditReview={() => { }} />
        );

        await waitFor(() => getByText('Reviews Written:'));

        expect(getByText('Menu Item 1, Stall 1')).toBeTruthy();
        expect(getByText('This is a great menu item!')).toBeTruthy();
        expect(getByTestId('review-1')).toBeTruthy();
    });

    it('displays "No reviews" message if no reviews are available', async () => {
        const { getByText } = render(
            <ReviewsPage userId="user123" reviews={[]} loading={false} onEditReview={() => { }} />
        );

        await waitFor(() => getByText('User has not written any reviews.'));

        expect(getByText('User has not written any reviews.')).toBeTruthy();
    });

    it('calls onEditReview callback when a review is edited', async () => {
        const mockOnEditReview = jest.fn();

        const { getByText, getByTestId } = render(
            <ReviewsPage userId="user123" reviews={mockReviews} loading={false} onEditReview={mockOnEditReview} />
        );

        await waitFor(() => getByText('Reviews Written:'));

        fireEvent.press(getByTestId('review-1'));

        expect(mockOnEditReview).toHaveBeenCalledWith(1);
    });
});
