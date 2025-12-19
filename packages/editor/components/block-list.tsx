"use client";

import { isOrderedList } from "@platejs/list";
import {
  useTodoListElement,
  useTodoListElementState,
} from "@platejs/list/react";
import { Checkbox } from "@repo/design-system/components/ui/checkbox";
import { cn } from "@repo/design-system/lib/utils";
import type {
  BasePluginContext,
  Path,
  PluginConfig,
  RenderElementProps,
  TElement,
  TListElement,
} from "platejs";
import {
  type EditorPlatePlugin,
  type PlateEditor,
  type PlateElementProps,
  type RenderNodeWrapper,
  useReadOnly,
} from "platejs/react";

const config: Record<
  string,
  {
    Li: React.FC<PlateElementProps>;
    Marker: React.FC<PlateElementProps>;
  }
> = {
  todo: {
    Li: TodoLi,
    Marker: TodoMarker,
  },
};

export const BlockList: RenderNodeWrapper = (props) => {
  if (!props.element.listStyleType) return;

  const BlockListComponent = (
    props: React.JSX.IntrinsicAttributes &
      BasePluginContext<PluginConfig> & {
        editor: PlateEditor;
        plugin: EditorPlatePlugin<PluginConfig>;
      } & { ref?: any } & RenderElementProps<TElement> & { path: Path } & {
        className?: string;
        style?: React.CSSProperties;
      }
  ) => <List {...props} />;
  BlockListComponent.displayName = "BlockListComponent";
  return BlockListComponent;
};

function List(props: PlateElementProps) {
  const { listStart, listStyleType } = props.element as TListElement;
  const { Li, Marker } = config[listStyleType] ?? {};
  const List = isOrderedList(props.element) ? "ol" : "ul";

  return (
    <List
      className="relative m-0 p-0"
      start={listStart}
      style={{ listStyleType }}
    >
      {Marker && <Marker {...props} />}
      {Li ? <Li {...props} /> : <li>{props.children}</li>}
    </List>
  );
}

function TodoMarker(props: PlateElementProps) {
  const state = useTodoListElementState({ element: props.element });
  const { checkboxProps } = useTodoListElement(state);
  const readOnly = useReadOnly();

  return (
    <div contentEditable={false}>
      <Checkbox
        className={cn(
          "absolute top-1 -left-6",
          readOnly && "pointer-events-none"
        )}
        {...checkboxProps}
      />
    </div>
  );
}

function TodoLi(props: PlateElementProps) {
  return (
    <li
      className={cn(
        "list-none",
        (props.element.checked as boolean) &&
          "text-muted-foreground line-through"
      )}
    >
      {props.children}
    </li>
  );
}
