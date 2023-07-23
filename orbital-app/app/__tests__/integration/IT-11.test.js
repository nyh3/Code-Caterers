import { render, fireEvent } from '@testing-library/react-native';
import UserPage from '../../test/explore3';

describe('UserPage Integration Test', () => {
  test('renders recommended users and all users', () => {
    const { getByText } = render(<UserPage />);

    const recommendedUsersText = getByText('Recommended Users');
    expect(recommendedUsersText).toBeTruthy();

    const allUsersText = getByText('All Users');
    expect(allUsersText).toBeTruthy();
  });

  test('renders users and recommended users based on search query', () => {
    const { getByTestId, getByText, queryByText } = render(<UserPage />);

    const searchInput = getByTestId('searchInput');
    fireEvent.changeText(searchInput, 'User 1');
    expect(queryByText('User 1')).toBeTruthy();
  });
});
