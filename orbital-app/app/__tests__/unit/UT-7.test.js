import { render, fireEvent } from '@testing-library/react-native';
import PromotionPage from '../../test/promotions2';

describe('PromotionPage', () => {
    const mockMenuItems = [
        {
            id: 1,
            image: 'https://example.com/promo1.jpg',
            title: 'Promotion 1',
            start_date: '2023-07-23',
            end_date: '2023-07-28',
        },
        {
            id: 2,
            image: 'https://example.com/promo2.jpg',
            title: 'Promotion 2',
            start_date: '2023-07-25',
            end_date: '2023-07-30',
        },
    ];

    it('should render the PromotionPage component', () => {
        const { getByText } = render(<PromotionPage menuItems={mockMenuItems} />);

        expect(getByText('Recent Promotions & Deals:')).toBeTruthy();

        expect(getByText('Promotion 1')).toBeTruthy();
        expect(getByText('Promotion 2')).toBeTruthy();
    });

    it('should call the correct callback function on promotion item press', () => {
        const mockHandlePromotionPress = jest.fn();
        const { getByText } = render(
            <PromotionPage menuItems={mockMenuItems} handlePromotionPress={mockHandlePromotionPress} />
        );

        fireEvent.press(getByText('Promotion 1'));

        expect(mockHandlePromotionPress).toHaveBeenCalledTimes(1);
        expect(mockHandlePromotionPress).toHaveBeenCalledWith(1);
    });

    it('should make the promotion items pressable', () => {
        const mockHandlePromotionPress = jest.fn();
        const { getByText } = render(
            <PromotionPage menuItems={mockMenuItems} handlePromotionPress={mockHandlePromotionPress} />
        );

        const promotionItem = getByText('Promotion 1');
        fireEvent.press(promotionItem);

        expect(mockHandlePromotionPress).toHaveBeenCalledTimes(1);
        expect(mockHandlePromotionPress).toHaveBeenCalledWith(1);
    });
});
