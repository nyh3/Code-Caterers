import { render, fireEvent } from '@testing-library/react-native';
import AddReview from '../../test/newreview2';

describe('AddReview', () => {
    test('handles comment change correctly', () => {
        const { getByTestId } = render(<AddReview />);
        const commentInput = getByTestId('comment-input');

        fireEvent.changeText(commentInput, 'This is a test comment');

        expect(commentInput.props.value).toBe('This is a test comment');
    });

    test('handles image upload correctly', () => {
        const { getByText, getByTestId } = render(<AddReview />);
        const uploadButton = getByText('Upload Image');

        fireEvent.press(uploadButton);

        const image = getByTestId('uploaded-image');
        expect(image.props.source.uri).toBe('https://example.com/test-image.jpg');
    });

    test('handles review submission correctly', () => {
        const { getByText, getByTestId } = render(<AddReview />);
        const commentInput = getByTestId('comment-input');
        const uploadButton = getByText('Upload Image');
        const submitButton = getByText('Submit');

        fireEvent.changeText(commentInput, 'This is a test comment');
        fireEvent.press(uploadButton);

        fireEvent.press(submitButton);

        expect(commentInput.props.value).toBe('This is a test comment');
        expect(getByTestId('uploaded-image').props.source.uri).toBe('https://example.com/test-image.jpg');
    });
});
