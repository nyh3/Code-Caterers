import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import StallProfilePage from '../../test/stallprofile';

const mockSupabaseData = {
  id: 1,
  name: 'Sample Stall',
  location: { name: 'Location 1' },
  cuisine: { name: 'Cuisine 1' },
  has_air_con: true,
  is_halal: false,
  is_vegetarian: true,
  description: 'This is a sample description.',
};

describe('StallProfilePage', () => {
  it('should render all UI elements correctly', () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <StallProfilePage mockSupabaseData={mockSupabaseData} />
    );

    expect(getByText('Insert Stall Image')).toBeTruthy();
    expect(getByPlaceholderText('Stall Name')).toBeTruthy();
    expect(getByPlaceholderText('Description')).toBeTruthy();
    expect(getByText('Select Location')).toBeTruthy();
    expect(getByText('Select Cuisine')).toBeTruthy();
    expect(getByText('Yes')).toBeTruthy(); 
    expect(getByText('No')).toBeTruthy();
    expect(getByText('Yes')).toBeTruthy(); 
    expect(getByText('Submit / Update Stall Details')).toBeTruthy();
    expect(getByTestId('discard-return-button')).toBeTruthy();
  });

  it('should update stall name correctly', () => {
    const { getByPlaceholderText } = render(<StallProfilePage mockSupabaseData={mockSupabaseData} />);
    const stallNameInput = getByPlaceholderText('Stall Name');
    fireEvent.changeText(stallNameInput, 'Updated Stall Name');
    fireEvent.submitEditing(stallNameInput);
    expect(stallNameInput.props.value).toBe('Updated Stall Name');
  });

  it('should toggle air conditioning switch correctly', () => {
    const { getByTestId } = render(<StallProfilePage mockSupabaseData={mockSupabaseData} />);
    const airConButton = getByTestId('has-air-con-button');
    fireEvent.press(airConButton);
    return findByText('No').then((updatedAirConButton) => {
      expect(updatedAirConButton).toBeTruthy(); 
    });
  });

  it('should toggle halal switch correctly', () => {
    const { getByTestId } = render(<StallProfilePage mockSupabaseData={mockSupabaseData} />);
    const halalButton = getByTestId('is-halal-button');
    fireEvent.press(halalButton);
    return findByText('Yes').then((updatedHalalButton) => {
      expect(updatedHalalButton).toBeTruthy(); 
    });
  });

  it('should toggle vegetarian switch correctly', () => {
    const { getByTestId } = render(<StallProfilePage mockSupabaseData={mockSupabaseData} />);
    const vegetarianButton = getByTestId('is-vegetarian-button');
    fireEvent.press(vegetarianButton);
    return findByText('No').then((updatedVegetarianButton) => {
      expect(updatedVegetarianButton).toBeTruthy(); 
    });
  });

  it('should submit stall details correctly', () => {
    const { getByText, getByTestId } = render(<StallProfilePage mockSupabaseData={mockSupabaseData} />);
    const submitButton = getByText('Submit / Update Stall Details');
    fireEvent.press(submitButton);
  });

  it('should call handleDiscardAndReturn when discard & return button is pressed', () => {
    const mockHandleDiscardAndReturn = jest.fn();
    const { getByTestId } = render(
      <StallProfilePage mockSupabaseData={mockSupabaseData} handleDiscardAndReturn={mockHandleDiscardAndReturn} />
    );
    const discardReturnButton = getByTestId('discard-return-button');
    fireEvent.press(discardReturnButton);
  });
});