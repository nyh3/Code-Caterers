import { render } from '@testing-library/react-native';
import FilterPage from '../../test/filter3';
import * as responsiveScreen from 'react-native-responsive-screen';

jest.mock('react-native-responsive-screen', () => ({
  setWidth: jest.fn(),
  setHeight: jest.fn(),
  setFontScale: jest.fn(),
}));

responsiveScreen.setWidth(375);
responsiveScreen.setHeight(667);
responsiveScreen.setFontScale(1);

describe('FilterPage', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<FilterPage />);
    expect(toJSON()).toMatchSnapshot();
  });
});
