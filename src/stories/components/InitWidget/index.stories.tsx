import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import InitWidget from '../../../components/InitWidget';
export default {
  title: 'Components/InitWidget',
  component: InitWidget,
} as ComponentMeta<typeof InitWidget>;

const Template: ComponentStory<typeof InitWidget> = args => (
  <InitWidget {...args} />
);

export const Init = Template.bind({});
Init.args = {
  label: 'Init',
};
