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
    const { getByText, getByTestId } = render(
      <StallProfilePage mockSupabaseData={mockSupabaseData} />
    );

    expect(getByText('Insert Stall Image')).toBeTruthy();
    expect(getByTestId('Stall Name')).toBeTruthy();
    expect(getByTestId('Description')).toBeTruthy();
    expect(getByTestId('location-menu-button')).toBeTruthy();
    expect(getByTestId('cuisine-menu-button')).toBeTruthy();
    expect(getByTestId('has-air-con-button')).toBeTruthy(); 
    expect(getByTestId('is-halal-button')).toBeTruthy();
    expect(getByTestId('is-vegetarian-button')).toBeTruthy(); 
    expect(getByTestId('submit button')).toBeTruthy();
    expect(getByTestId('discard-return-button')).toBeTruthy();
  });

  it('should update stall name correctly', () => {
    const { getByTestId } = render(<StallProfilePage mockSupabaseData={mockSupabaseData} />);
    const stallNameInput = getByTestId('Stall Name');
    fireEvent.changeText(stallNameInput, 'Updated Stall Name');
    expect(stallNameInput.props.value).toBe('Updated Stall Name');
  });

  it('should toggle air conditioning switch correctly', () => {
    const { getByTestId, findByText } = render(<StallProfilePage mockSupabaseData={mockSupabaseData} />);
    const airConButton = getByTestId('has-air-con-button');
    fireEvent.press(airConButton);
  });

  it('should toggle halal switch correctly', () => {
    const { getByTestId, findByText } = render(<StallProfilePage mockSupabaseData={mockSupabaseData} />);
    const halalButton = getByTestId('is-halal-button');
    fireEvent.press(halalButton);
  });

  it('should toggle vegetarian switch correctly', () => {
    const { getByTestId, findByText } = render(<StallProfilePage mockSupabaseData={mockSupabaseData} />);
    const vegetarianButton = getByTestId('is-vegetarian-button');
    fireEvent.press(vegetarianButton);
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