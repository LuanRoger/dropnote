import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

type ActionButtonProperties = React.ComponentProps<typeof Button> & {
  isLoading?: boolean;
  loadingText?: string;
};

export default function ActionButton({
  isLoading,
  loadingText,
  ...props
}: ActionButtonProperties) {
  const loadingContent = loadingText ?? props.children;

  return (
    <Button disabled={isLoading} {...props}>
      {isLoading && <Spinner />}
      {isLoading ? loadingContent : props.children}
    </Button>
  );
}
