import { render, fireEvent } from '@testing-library/react-native';
import ReviewsPage from '../../test/reviews2';

describe('ReviewsPage Component', () => {
    test('should render "User has not written any reviews." when no reviews are available', () => {
        const { queryByText } = render(<ReviewsPage />);
        const noReviewsText = queryByText('User has not written any reviews.');

        expect(noReviewsText).toBeDefined();
    });

    test('should render reviews when reviews are available', () => {
        const { getByTestId } = render(<ReviewsPage />);
        const review1 = getByTestId('review-1');
        const review2 = getByTestId('review-2');
        expect(review1).toBeDefined();
        expect(review2).toBeDefined();
    });

    test('should handle pressing a review', () => {
        const { getByTestId } = render(<ReviewsPage />);
        const review1 = getByTestId('review-1');
        fireEvent.press(review1);
    });
});
