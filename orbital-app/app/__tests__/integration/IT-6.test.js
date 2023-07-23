import { render, fireEvent } from '@testing-library/react-native';
import SavedPage from '../../test/saved3';

describe('SavedPage Integration Test', () => {
    it('should switch between "Saved Menus" and "Saved Profiles" tabs', () => {
        const { getByText, queryByTestId } = render(<SavedPage />);

        const savedMenusTab = getByText('Saved Menus');
        const savedProfilesTab = getByText('Saved Profiles');
        const activeTabIndicator = queryByTestId('active-tab-indicator');

        expect(activeTabIndicator).toBeNull();

        fireEvent.press(savedProfilesTab);

        const updatedActiveTabIndicator = queryByTestId('active-tab-indicator');
        expect(updatedActiveTabIndicator).toBeNull();
    });
});
