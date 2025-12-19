import { createContext, useState } from "react";

export type EditorStateContextProps = {
  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;
};

export const EditorStateContext = createContext<EditorStateContextProps>({
  isSaving: false,
  setIsSaving: () => {},
});

export function EditorStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSaving, setIsSaving] = useState(false);

  return (
    <EditorStateContext.Provider
      value={{
        isSaving,
        setIsSaving,
      }}
    >
      {children}
    </EditorStateContext.Provider>
  );
}
