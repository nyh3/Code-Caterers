import { render } from '@testing-library/react-native';
import UserPage from '../../test/explore3';
import * as responsiveScreen from 'react-native-responsive-screen';

jest.mock('react-native-responsive-screen', () => ({
  setWidth: jest.fn(),
  setHeight: jest.fn(),
  setFontScale: jest.fn(),
}));

responsiveScreen.setWidth(375);
responsiveScreen.setHeight(667);
responsiveScreen.setFontScale(1);

describe('UserPage', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<UserPage />);
    expect(toJSON()).toMatchSnapshot();
  });
});
