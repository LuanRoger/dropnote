"use client";

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import {
  navigateToPageSchema,
  NavigateToPageSchema,
} from "@/utils/schemas/navigate-to-page-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

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
        className="flex flex-row gap-2 h-12"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="some-slug" className="h-full" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="h-full">
          Go
        </Button>
      </form>
    </Form>
  );
}
