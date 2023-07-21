import React from 'react';
import renderer from 'react-test-renderer';

import StallPage from '../../(home)';

describe('<StallPage />', () => {
  it('has 1 child', () => {
    const tree = renderer.create(<StallPage />).toJSON();
    expect(tree.children.length).toBe(1);
  });
});
