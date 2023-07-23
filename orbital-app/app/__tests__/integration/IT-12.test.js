import { render, fireEvent } from '@testing-library/react-native';
import UserProfilePage from '../../test/userprofile3';

describe('UserProfilePage Integration Test', () => {
    const dummyReviews = [
    ];

    const dummySavedMenus = [
    ];

    it('should display user profile and reviews by default', () => {
        const { getByText, getByTestId } = render(<UserProfilePage />);

        expect(getByText('John Doe')).toBeDefined();
        expect(getByTestId('userImage')).toBeDefined();

        dummyReviews.forEach((review) => {
            expect(getByText(review.menu_id.name)).toBeDefined();
            expect(getByText(`Price: $${review.menu_id.price}`)).toBeDefined();
        });

        expect(getByText('User has not written any reviews.')).toBeDefined();
    });

    it('should switch to Saved Menu Items tab and display saved menu data', () => {
        const { getByText } = render(<UserProfilePage />);

        fireEvent.press(getByText('Saved Menu Items'));

        dummySavedMenus.forEach((menu) => {
            expect(getByText(menu.name)).toBeDefined();
            expect(getByText(menu.stall.name)).toBeDefined();
            expect(getByText(menu.stall.location.name)).toBeDefined();
        });

        expect(getByText('User has not saved any menu items.')).toBeDefined();
    });
});
