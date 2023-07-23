import { render, fireEvent } from '@testing-library/react-native';
import UserProfilePage, { testIDs } from '../../test/userprofile2';

describe('UserProfilePage', () => {
    it('should render reviews tab by default', () => {
        const { getByTestId } = render(<UserProfilePage />);
        expect(getByTestId(testIDs.reviewsTab)).toBeTruthy();
    });

    it('should render saved menus tab when clicking on the tab button', () => {
        const { getByTestId } = render(<UserProfilePage />);
        const savedMenusTab = getByTestId(testIDs.savedMenusTab);
        fireEvent.press(savedMenusTab);
        expect(savedMenusTab).toBeTruthy();
    });

    it('should toggle save/unsave when clicking on the heart icon', () => {
        const { getByTestId } = render(<UserProfilePage />);
        const heartIcon = getByTestId('heartIcon');
        fireEvent.press(heartIcon);
        expect(heartIcon).toBeTruthy();
    });
});
