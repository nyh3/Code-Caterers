import { render, fireEvent } from '@testing-library/react-native';
import SavedPage from '../../test/saved2';

describe('SavedPage Component', () => {
  test('should render saved menu items', () => {
    const { getByTestId } = render(<SavedPage />);

    const savedMenuItem1 = getByTestId('saved-menu-item-1');

    expect(savedMenuItem1).toBeDefined();
  });

  test('should switch tabs', () => {
    const { getByTestId } = render(<SavedPage />);

    const menuTabButton = getByTestId('menu-tab-button');

    const profilesTabButton = getByTestId('profiles-tab-button');

    fireEvent.press(profilesTabButton);
  });

  test('should display "User has not saved any menu items." when no menu items are available', () => {
    const { getByText } = render(<SavedPage />);
    const noSavedMenuItemsText = getByText('User has not saved any menu items.');

    expect(noSavedMenuItemsText).toBeDefined();
  });

  test('should display "User has not saved any profiles." when no profiles are available', () => {
    const { getByText } = render(<SavedPage />);
    const noSavedProfilesText = getByText('User has not saved any profiles.');

    expect(noSavedProfilesText).toBeDefined();
  });

});
