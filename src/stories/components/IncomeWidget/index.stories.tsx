import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import IncomeWidget from '../../../components/IncomeWidget';
export default {
  title: 'Components/IncomeWidget',
  component: IncomeWidget,
} as ComponentMeta<typeof IncomeWidget>;

const Template: ComponentStory<typeof IncomeWidget> = args => (
  <IncomeWidget {...args} />
);

export const Init = Template.bind({});
Init.args = {
  email: 'mail@mail.com',
};