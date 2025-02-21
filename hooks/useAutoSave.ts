import { useState } from "react";
import type { PageType, PostType } from "@/lib/types";

const AUTOSAVE_DEBOUNCE_TIME = 2000;

export const useAutoSave = ({ onSave }: { onSave: (data: PostType | PageType) => void }) => {
  const [autoSaveTimer, setAutoSaveTimer] = useState<ReturnType<typeof setTimeout> | string | number | undefined>(
    undefined,
  );
  const [isPendingSave, setIsPendingSave] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isError, setIsError] = useState(false);

  const dispatchAutoSave = (formData: PostType | PageType) => {
    clearTimeout(autoSaveTimer);

    setIsPendingSave(true);

    const timer = setTimeout(() => triggerSave(formData), AUTOSAVE_DEBOUNCE_TIME);

    setAutoSaveTimer(timer);
  };

  const triggerManualSave = (formData: PostType | PageType) => {
    clearTimeout(autoSaveTimer);
    setIsPendingSave(true);
    triggerSave(formData);
  };

  const triggerSave = (formData: PostType | PageType) => {
    setIsError(false);
    setIsSaving(true);

    try {
      onSave(formData);

      setIsPendingSave(false);
    } catch (err) {
      setIsError(true);
      console.log(err);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    dispatchAutoSave,
    triggerManualSave,
    isPendingSave,
    isSaving,
    isError,
  };
};
