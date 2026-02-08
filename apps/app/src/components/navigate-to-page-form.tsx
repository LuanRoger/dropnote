"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
} from "@repo/design-system/components/ui/field";
import { Input } from "@repo/design-system/components/ui/input";
import { PenIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import {
  type NavigateToPageSchema,
  navigateToPageSchema,
} from "@/utils/schemas/navigate-to-page-schema";

const MotionButton = motion.create(Button);

export default function NavigateToPageForm() {
  const form = useForm<NavigateToPageSchema>({
    resolver: standardSchemaResolver(navigateToPageSchema),
    defaultValues: {
      code: "",
    },
  });
  const currentCodeValueLength = form.watch("code").length;
  const canDisableSubmitButton = currentCodeValueLength < 3;
  const router = useRouter();

  function onSubmit(data: NavigateToPageSchema) {
    const { code } = data;
    router.push(`/${code}`);
  }

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup className="contents">
        <Controller
          control={form.control}
          name="code"
          render={({ field, fieldState }) => (
            <Field className="gap-1">
              {fieldState.invalid && (
                <FieldError className="text-end" errors={[fieldState.error]} />
              )}
              <Input
                autoComplete="off"
                className="w-full"
                placeholder="slug"
                {...field}
              />
            </Field>
          )}
        />
      </FieldGroup>
      <MotionButton
        className="self-end text-xs"
        disabled={canDisableSubmitButton}
        layout
        size="sm"
        type="submit"
      >
        write.
        <AnimatePresence>
          {!canDisableSubmitButton && (
            <motion.div
              animate={{
                y: 0,
                width: "auto",
              }}
              exit={{
                y: -10,
                width: 0,
              }}
              initial={{
                y: -10,
                width: 0,
              }}
              style={{ overflow: "hidden" }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <PenIcon className="size-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </MotionButton>
    </form>
  );
}
