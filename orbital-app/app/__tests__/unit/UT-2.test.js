import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginPage from '../../test/loginuser';
describe('LoginPage', () => {
  it('should display error message if email is empty', async () => {
    const { getByText, getByTestId, queryByText } = render(<LoginPage />);

    const signInButton = getByText('Sign In');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(queryByText('Please provide a valid email address.')).toBeTruthy();
      expect(queryByText('Please provide a valid password.')).toBeFalsy();
    });
  });

  it('should display error message if password is empty', async () => {
    const { getByText, getByTestId, queryByText } = render(<LoginPage />);

    const signInButton = getByText('Sign In');
    fireEvent.press(signInButton);

    const emailInput = getByTestId('emailInput');
    fireEvent.changeText(emailInput, 'test@example.com');

    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(queryByText('Please provide a valid email address.')).toBeFalsy();
      expect(queryByText('Please provide a valid password.')).toBeTruthy();
    });
  });

  it('should not display any error message when both email and password are provided', async () => {
    const { getByText, getByTestId, queryByText } = render(<LoginPage />);

    const emailInput = getByTestId('emailInput');
    fireEvent.changeText(emailInput, 'test@example.com');

    const passwordInput = getByTestId('passwordInput');
    fireEvent.changeText(passwordInput, 'testpassword');

    const signInButton = getByText('Sign In');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(queryByText('Please provide a valid email address.')).toBeFalsy();
      expect(queryByText('Please provide a valid password.')).toBeFalsy();
    });
  });
});
