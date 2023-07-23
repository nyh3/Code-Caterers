import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EditPromotionPage from '../../test/editpromotion'; 

jest.mock('react-native-paper', () => ({
  Text: 'Text',
  TextInput: 'TextInput',
  Button: 'Button',
  ActivityIndicator: 'ActivityIndicator',
}));

describe('EditPromotionPage', () => {
  it('should press the Delete Promotion button and trigger deletion logic', async () => {
    const { getByText } = render(<EditPromotionPage />);
    fireEvent.press(getByText('Delete Promotion'));
  });
});