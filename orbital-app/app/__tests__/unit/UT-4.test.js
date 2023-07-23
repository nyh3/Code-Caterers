import { render, fireEvent } from '@testing-library/react-native';
import StallPage from '../../test/index2';

const mockHandleStallPress = jest.fn();

const testStalls = [
  {
    id: 1,
    name: 'Stall 1',
    location: { name: 'Location 1' },
    stallImage: 'https://example.com/stall1.jpg',
    rating: '4.5',
    cuisine: { name: 'Chinese' },
  },
  {
    id: 2,
    name: 'Stall 2',
    location: { name: 'Location 2' },
    stallImage: 'https://example.com/stall2.jpg',
    rating: '3.8',
    cuisine: { name: 'Western' },
  },
];

describe('StallPage', () => {
  it('should render stalls correctly', () => {
    const { getByText } = render(
      <StallPage stalls={testStalls} handleStallPress={mockHandleStallPress} />
    );

    const stall1 = getByText('Stall 1 @ Location 1');
    const stall2 = getByText('Stall 2 @ Location 2');
    expect(stall1).toBeTruthy();
    expect(stall2).toBeTruthy();

    const chineseCuisineTag = getByText('Chinese');
    const backgroundColor = chineseCuisineTag.props.style.find(
      (style) => style.backgroundColor
    );
    expect(backgroundColor.backgroundColor).toBe('#FFD700');
  });

  it('should call handleStallPress when a stall is pressed', () => {
    const { getByText } = render(
      <StallPage stalls={testStalls} handleStallPress={mockHandleStallPress} />
    );

    const stallItem = getByText('Stall 1 @ Location 1');
    fireEvent.press(stallItem);

    expect(mockHandleStallPress).toHaveBeenCalledWith(testStalls[0]);
  });
});