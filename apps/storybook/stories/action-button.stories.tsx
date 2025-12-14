import ActionButton from "@repo/design-system/components/action-button";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "components/ActionButton",
  component: ActionButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    isLoading: { control: "boolean" },
    loadingText: { control: "text" },
  },
  args: {
    isLoading: false,
  },
  render: (args) => <ActionButton {...args}>Click Me</ActionButton>,
} satisfies Meta<typeof ActionButton>;

export default meta;

type Story = StoryObj<typeof meta>;

/*
 * The default form of the action button.
 */
export const Default: Story = {};

/*
 * Use the `isLoading` prop to show a loading spinner and disable the button.
 */
export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

/*
 * Use the `loadingText` prop to customize the text shown when loading.
 */
export const LoadingWithCustomText: Story = {
  args: {
    isLoading: true,
    loadingText: "Loading...",
  },
};
