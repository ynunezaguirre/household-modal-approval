import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import MoffinWidget from '../../../components/MoffinWidget';
export default {
  title: 'Components/MoffinWidget',
  component: MoffinWidget,
} as ComponentMeta<typeof MoffinWidget>;

const Template: ComponentStory<typeof MoffinWidget> = args => (
  <MoffinWidget {...args} />
);

export const Init = Template.bind({});
Init.args = {
  email: 'testmail@mail.com',
  type: 'MOFFIN_BUREAU',
  inputData: {
    firstname: 'yamil',
    lastname: 'nunez'
  },
  callbackHandler: (s: boolean) => {
    console.log('s', s);
  },
  env: 'local',
};