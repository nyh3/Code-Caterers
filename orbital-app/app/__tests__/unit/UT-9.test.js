import { render } from '@testing-library/react-native';
import StallDetailScreen from '../../test/stalldetails2';

describe('StallDetailScreen', () => {
  const mockMenu = [
    {
      id: 1,
      name: 'Menu Item 1',
      image: 'https://example.com/menu1.jpg',
      rating: '4.0',
      price: 10.99,
    },
    {
      id: 2,
      name: 'Menu Item 2',
      image: 'https://example.com/menu2.jpg',
      rating: '4.5',
      price: 12.99,
    },
  ];

  test('renders stall details correctly', () => {
    const { getByText, getByTestId } = render(<StallDetailScreen menu={mockMenu} />);

    expect(getByText('Stall Name, Location Name')).toBeTruthy();
    expect(getByText('Stall description')).toBeTruthy();

    expect(getByTestId('vegetarian-tag')).toBeTruthy();
    expect(getByTestId('halal-tag')).toBeTruthy();

    const cuisineTag = getByTestId('cuisine-tag');

    expect(cuisineTag).toBeTruthy();
    expect(cuisineTag.children[0].props.children).toBe('Chinese');

    expect(getByTestId('menu-list')).toBeTruthy();
  });
});
