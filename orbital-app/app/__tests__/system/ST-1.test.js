import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import DietaryRestrictions from './DietaryRestrictions';

describe('DietaryRestrictions Loading System Test', () => {
  test('updates dietary restrictions', async () => {
    const { getByText, getByTestId, queryByText } = render(<DietaryRestrictions />);

    // Wait for the component to load and display "Dietary Restrictions:"
    await waitFor(() => getByText('Dietary Restrictions:'));

    // Add a large number of restrictions
    const numberOfRestrictions = 50;
    for (let i = 1; i <= numberOfRestrictions; i++) {
      fireEvent.changeText(getByTestId('restriction-input'), `Restriction ${i}`);
      fireEvent.press(getByText('Add Restriction'));
      await waitFor(() => getByText(`Restriction ${i}`));
    }

    // Check if all added restrictions are displayed correctly
    for (let i = 1; i <= numberOfRestrictions; i++) {
      expect(getByText(`Restriction ${i}`)).toBeTruthy();
    }

    // Update the dietary restrictions and check for success message
    fireEvent.press(getByText('Update Dietary Restrictions'));
    await waitFor(() => getByText('Dietary restrictions updated successfully'));
    expect(getByText('Dietary restrictions updated successfully')).toBeTruthy();
  });
});
