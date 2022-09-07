import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import AssetsWidget from '../../../components/AssetsWidget';
export default {
  title: 'Components/AssetsWidget',
  component: AssetsWidget,
} as ComponentMeta<typeof AssetsWidget>;

const Template: ComponentStory<typeof AssetsWidget> = args => (
  <AssetsWidget {...args} />
);

export const Init = Template.bind({});
Init.args = {
  email: 'mail@mail.com'
};