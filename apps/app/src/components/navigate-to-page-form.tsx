"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
} from "@repo/design-system/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@repo/design-system/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/design-system/components/ui/tooltip";
import { CopyIcon, DicesIcon, PenIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useClipboard } from "react-haiku";
import { Controller, useForm } from "react-hook-form";
import {
  type NavigateToPageSchema,
  navigateToPageSchema,
} from "@/utils/schemas/navigate-to-page-schema";
import { generateRandomSlug } from "@/utils/slug";

const MotionWriteButton = motion(Button);
const MotionCopySlugButton = motion(InputGroupButton);

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
  const clipboard = useClipboard();

  function onSubmit(data: NavigateToPageSchema) {
    const { code } = data;
    router.push(`/${code}`);
  }

  function generateSlug() {
    const newSlug = generateRandomSlug();

    form.setValue("code", newSlug, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  function copyToClipboard() {
    const codeValue = form.getValues("code");
    if (!codeValue) {
      return;
    }

    clipboard.copy(codeValue);
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
          render={({ field, fieldState }) => {
            const isInvalid = fieldState.invalid;
            const isEmptyField = !field.value;
            const variants = {
              visible: {
                opacity: 1,
              },
              hidden: {
                opacity: 0,
              },
            };

            return (
              <Field className="gap-1">
                {isInvalid && (
                  <FieldError
                    className="text-end"
                    errors={[fieldState.error]}
                  />
                )}
                <InputGroup>
                  <InputGroupInput
                    autoComplete="off"
                    className="w-full"
                    placeholder="slug"
                    {...field}
                  />
                  <InputGroupAddon align="inline-end">
                    <MotionCopySlugButton
                      animate={isEmptyField ? "hidden" : "visible"}
                      className="transition-none"
                      exit={"hidden"}
                      initial={"hidden"}
                      onClick={copyToClipboard}
                      size="icon-xs"
                      type="button"
                      variants={variants}
                    >
                      <CopyIcon />
                    </MotionCopySlugButton>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            );
          }}
        />
      </FieldGroup>
      <div className="flex justify-between">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={generateSlug}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <DicesIcon color="var(--muted-foreground)" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Generate a random slug.</TooltipContent>
        </Tooltip>
        <MotionWriteButton
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
        </MotionWriteButton>
      </div>
    </form>
  );
}
