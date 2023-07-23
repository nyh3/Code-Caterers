import { render, waitFor } from '@testing-library/react-native';
import ViewReviewScreen from '../../test/viewpromotions2';

describe('ViewReviewScreen', () => {
    it('should render loading indicator while fetching promotion details', async () => {
        const { getByTestId } = render(<ViewReviewScreen />);
        await waitFor(() => expect(getByTestId('promotionImage')).toBeTruthy());
    });

    it('should display promotion details', async () => {
        const { getByTestId, queryByText } = render(<ViewReviewScreen />);
        await waitFor(() => expect(getByTestId('promotionImage')).toBeTruthy());

        const promotionTitle = queryByText('Sample Promotion');
        const promotionDescription = queryByText('This is a sample promotion description.');
        const promotionLocation = queryByText('Sample Stall, Sample Location');

        expect(promotionTitle).toBeTruthy();
        expect(promotionDescription).toBeTruthy();
        expect(promotionLocation).toBeTruthy();
    });
});
