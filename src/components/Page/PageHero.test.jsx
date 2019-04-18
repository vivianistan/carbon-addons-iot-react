import React from 'react';
import { mount } from 'enzyme';

import PageHero from './PageHero';

const commonPageHeroProps = {
  title: 'Your Devices',
  blurb:
    'Your data lake displays a detailed view of the entity types that are connected in Watson IoT Platform. To explore the metrics and dimensions of your entities in more detail, select Entities. To start applying calculations and analyzing your entity data, select Data.',
  big: true,
  rightContent: <div>Right Content</div>,
};

describe('Page Hero', () => {
  // handle click function test
  test('onClick switcher', () => {
    const commonSwitchProps = {
      onChange: jest.fn(),
      switcher: [
        {
          switcherId: 'allDevices',
          switcherText: 'All Devices',
          onClick: jest.fn(),
          disabled: null,
        },
        { switcherId: 'diagnose', switcherText: 'Diagnose', onClick: jest.fn(), disabled: null },
      ],
    };
    const wrapper = mount(<PageHero {...commonPageHeroProps} switchers={commonSwitchProps} />);

    wrapper
      .find('Switch[onClick]')
      .last()
      .simulate('click');

    expect(
      wrapper
        .find('Switch[onClick]')
        .last()
        .props().selected
    ).toEqual(true);
  });
});