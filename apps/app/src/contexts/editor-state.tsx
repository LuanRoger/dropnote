import { createContext, useState } from "react";

export interface EditorStateContextProps {
  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;
}

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
        isSaving: isSaving,
        setIsSaving: setIsSaving,
      }}
    >
      {children}
    </EditorStateContext.Provider>
  );
}
