"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/design-system/components/ui/form";
import { Input } from "@repo/design-system/components/ui/input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  type NavigateToPageSchema,
  navigateToPageSchema,
} from "@/utils/schemas/navigate-to-page-schema";

export default function NavigateToPageForm() {
  const form = useForm<NavigateToPageSchema>({
    resolver: zodResolver(navigateToPageSchema),
    defaultValues: {
      code: "",
    },
  });
  const router = useRouter();

  function onSubmit(data: NavigateToPageSchema) {
    const { code } = data;
    router.push(`/${code}`);
  }

  return (
    <Form {...form}>
      <form
        className="flex h-12 flex-row gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input className="h-full" placeholder="some-slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="h-full" type="submit">
          Go
        </Button>
      </form>
    </Form>
  );
}
