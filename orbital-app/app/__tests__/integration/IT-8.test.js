import { render, fireEvent } from '@testing-library/react-native';
import MenuDetailScreen from '../../test/menudetails3';

describe('MenuDetailScreen Integration Test', () => {
  it('should render menu details and handle save toggle', () => {
    const mockMenu = {
      id: 1,
      name: 'Sample Menu',
      rating: '4.5',
      price: '10.99',
      description: 'This is a sample menu item description.',
      dietary_restrictions: ['Vegan', 'Gluten-free'],
      image: 'https://example.com/sample-menu.jpg',
    };

    const { getByText, getByTestId } = render(<MenuDetailScreen menuId={mockMenu.id} />);

    const menuName = getByText(mockMenu.name);
    expect(menuName).toBeTruthy();

    const saveButton = getByTestId('save-button');
    expect(saveButton).toBeTruthy();

    fireEvent.press(saveButton);

    const updatedSaveButton = getByTestId('save-button');
  });

  it('should render reviews and handle review press', () => {
    const mockReviews = [
      {
        id: 1,
        profile: {
          username: 'JohnDoe',
          image: 'https://example.com/johndoe.jpg',
        },
        rating: '4.0',
        review_text: 'This is a sample review.',
        image: 'https://example.com/sample-review.jpg',
        updated_at: '2023-07-20T12:34:56Z',
      },
    ];

    const { getByText, getByTestId } = render(<MenuDetailScreen menuId={1} />);

    const reviewText = getByText(mockReviews[0].review_text);
    expect(reviewText).toBeTruthy();

    const reviewItem = getByTestId('review-item-1');
    fireEvent.press(reviewItem);
  });
});
