import { render, fireEvent } from '@testing-library/react-native';
import PromotionPage from '../../test/promotions3';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

describe('PromotionPage Integration Test', () => {
  it('renders the list of promotions with correct data', () => {
    const mockMenuItems = [
      {
        id: 1,
        title: 'Promotion 1',
        image: 'image_url_1',
        start_date: '2023-07-20',
        end_date: '2023-07-25',
      },
      {
        id: 2,
        title: 'Promotion 2',
        image: 'image_url_2',
        start_date: '2023-07-22',
        end_date: '2023-07-28',
      },
    ];

    const { getByText, getByTestId } = render(<PromotionPage />, {
      menuItems: mockMenuItems,
    });

    expect(getByText('Promotion 1')).toBeTruthy();
    expect(getByText('Promotion 2')).toBeTruthy();

    expect(getByText('Valid from: 2023-07-20 to 2023-07-25')).toBeTruthy();
    expect(getByText('Valid from: 2023-07-22 to 2023-07-28')).toBeTruthy();

    const promotionImage1 = getByTestId('promotionImage_1');
    const promotionImage2 = getByTestId('promotionImage_2');
  });

  it('navigates to view promotion details when a promotion item is pressed', () => {
    const mockMenuItem = {
      id: 1,
      title: 'Promotion 1',
      image: 'image_url_1',
      start_date: '2023-07-20',
      end_date: '2023-07-25',
    };

    const { getByText } = render(<PromotionPage />, {
      menuItems: [mockMenuItem],
    });

    const promotionItem = getByText('Promotion 1');
    fireEvent.press(promotionItem);
  });
});
