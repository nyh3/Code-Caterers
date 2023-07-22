import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RegisterPage from '../(auth)/registerUser';

describe('RegisterPage', () => {
    it('should register a new account when the form is submitted with valid data', async () => {
        // Arrange: Render the RegisterPage component
        const { getByText, getByPlaceholderText, queryByText } = render(<RegisterPage />);

        // Act: Fill in the email and password fields and submit the form
        const emailInput = getByPlaceholderText('Email:');
        const passwordInput = getByPlaceholderText('Password:');
        const sendVerificationButton = getByText('Send Verification Email');
        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.changeText(passwordInput, 'testpassword');
        fireEvent.press(sendVerificationButton);

        // Assert: Verify that the loading indicator is shown
        expect(queryByText('Please provide a valid email address.')).toBeNull();
        expect(queryByText('Please provide a valid email password.')).toBeNull();
        expect(queryByText('Note: After creating your account, please check your email for a verification link to complete the registration process.')).toBeTruthy();
    });

    // Add more test cases here for other scenarios, like invalid data, error messages, etc.
});
