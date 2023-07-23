import { render, fireEvent } from '@testing-library/react-native';
import EditReview from '../../test/editreview2';

describe('EditReview Component', () => {
    test('should render and update comment field', () => {
        const { getByTestId, getByPlaceholderText } = render(<EditReview />);

        const commentInput = getByTestId('comment-input');

        fireEvent.changeText(commentInput, 'This is a test comment.');

        expect(commentInput.props.value).toBe('This is a test comment.');
    });

    test('should render and submit review', () => {
        const { getByTestId, getByText } = render(<EditReview />);

        const commentInput = getByTestId('comment-input');

        fireEvent.changeText(commentInput, 'This is a test comment.');

        const submitButton = getByText('Update & Submit Review');

        fireEvent.press(submitButton);

        expect(commentInput.props.value).toBe('');
    });
});
