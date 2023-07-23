import { render, fireEvent } from '@testing-library/react-native';
import UserPage from '../../test/explore2';

describe('UserCard', () => {
  it('should render the user card with the correct username', () => {
    const user = { id: 1, username: 'User 1', image: 'user1.jpg' };
    const { getByText } = render(<UserPage />);
    expect(getByText(user.username)).toBeTruthy();
  });

  it('should render the recommended user card with the correct username', () => {
    const recommendedUser = { id: 1, username: 'User 1', image: 'user1.jpg' };
    const { getByText } = render(<UserPage />);
    expect(getByText(recommendedUser.username)).toBeTruthy();
  });

  it('should update the search query state when the search input value changes', () => {
    const { getByPlaceholderText } = render(<UserPage />);
    const searchInput = getByPlaceholderText('Search for users...');
    fireEvent.changeText(searchInput, 'Test User');
    expect(searchInput.props.value).toBe('Test User');
  });

  it('should filter users based on the search query', () => {
    const { getByPlaceholderText, getByText } = render(<UserPage />);
    const searchInput = getByPlaceholderText('Search for users...');
    fireEvent.changeText(searchInput, 'User 1');
    expect(getByText('User 1')).toBeTruthy();
    expect(() => getByText('User 2')).toThrow();
    expect(() => getByText('User 3')).toThrow();
  });
});
