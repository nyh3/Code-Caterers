import { render } from '@testing-library/react-native';
import ViewReviewScreen from '../../test/reviewdetails2';

describe('ViewReviewScreen', () => {
  test('stall owner can view reviews of their dishes', () => {
    const { getByTestId, getByText } = render(<ViewReviewScreen />);

    const profileImage = getByTestId('profile-image');
    expect(profileImage.props.source.uri).toBe('https://example.com/user1.jpg');

    const usernameText = getByText('User1');
    expect(usernameText).toBeTruthy();

    const reviewText = getByText('Good menu item!');
    expect(reviewText).toBeTruthy();

    const reviewImage = getByTestId('review-image');
    expect(reviewImage.props.source.uri).toBe('https://example.com/review1.jpg');

    const updatedAtText = getByTestId('updated-at');
    expect(updatedAtText.props.children).toBe('2023-07-23');
  });
});