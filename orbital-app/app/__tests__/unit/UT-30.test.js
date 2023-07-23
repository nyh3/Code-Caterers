import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EditPromotionPage from '../../test/editpromotion';

const mockUpdatePromotionAPI = jest.fn();
jest.mock('../../test/editpromotion', () => {
  const originalModule = jest.requireActual('../../test/editpromotion');
  return {
    __esModule: true,
    ...originalModule,
    mockUpdatePromotionAPI,
  };
});

describe('EditPromotionPage', () => {
  test('owners receive error message for invalid end date', async () => {
    const mockPromotionItem = {
      id: 1,
      title: 'Sample Promotion',
      description: 'This is a sample promotion.',
      image: null,
      start_date: new Date(),
      end_date: null,
    };

    const { getByText, getByLabelText, getByTestId } = render(<EditPromotionPage />);
    fireEvent.press(getByText('End Date: No end date'));
    fireEvent(getByTestId('datetimepicker'), 'onChange', {
      type: 'date',
      nativeEvent: { timestamp: new Date('2023-07-22').getTime() },
    });
    fireEvent.press(getByText('Submit & Update Promotion'));
    await waitFor(() => expect(mockUpdatePromotionAPI).not.toHaveBeenCalled());
    expect(getByText('End date cannot be before the start date')).toBeTruthy();
  });

  test('owners receive error message for no end date', async () => {
    const mockPromotionItem = {
      id: 1,
      title: 'Sample Promotion',
      description: 'This is a sample promotion.',
      image: null,
      start_date: new Date(),
      end_date: null,
    };

    const { getByText } = render(<EditPromotionPage />);
    fireEvent.press(getByText('Submit & Update Promotion'));
    await waitFor(() => expect(mockUpdatePromotionAPI).not.toHaveBeenCalled());
    expect(getByText('End date cannot be null')).toBeTruthy();
  });
});