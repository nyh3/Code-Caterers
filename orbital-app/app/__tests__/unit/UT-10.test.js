import { render, fireEvent } from '@testing-library/react-native';
import MenuDetailScreen from '../../test/menudetails2';

describe('MenuDetailScreen', () => {
    test('renders without crashing', () => {
        render(<MenuDetailScreen />);
    });

    test('clicking "Add Review" button should trigger handleAddReview', () => {
        const { getByText } = render(<MenuDetailScreen />);
        const addReviewButton = getByText('Add Review');
        fireEvent.press(addReviewButton);
    });

    test('clicking the heart icon should trigger handleSaveToggle', () => {
        const { getByTestId } = render(<MenuDetailScreen />);
        const heartIcon = getByTestId('heart-button');
        fireEvent.press(heartIcon);
    });

    test('displays dietary restrictions correctly', () => {
        const { getByText } = render(<MenuDetailScreen />);
        const vegetarianTag = getByText('Vegetarian');
        const glutenFreeTag = getByText('Gluten-free');
    });

    test('clicking on a review should trigger handleReviewPress', () => {
        const { getByText } = render(<MenuDetailScreen />);
        const reviewText = 'Good menu item!';
        const review = getByText(reviewText);
        fireEvent.press(review);
    });
});
