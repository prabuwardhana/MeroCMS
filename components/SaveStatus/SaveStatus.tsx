import React, { useEffect, useState } from "react";
import { formatDistance } from "date-fns";
import { CircleAlert, CircleCheck, CircleX } from "lucide-react";

const LAST_UPDATED_AT_REFRESH_TIME = 5000;

const LastSavedAt = ({ savedAt }: { savedAt: Date }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    const updatedLastUpdatedText = () => {
      if (!savedAt) return;

      setText(formatLastSavedAt(savedAt));
    };

    updatedLastUpdatedText();
    const interval = setInterval(updatedLastUpdatedText, LAST_UPDATED_AT_REFRESH_TIME);

    return () => clearInterval(interval);
  }, [savedAt]);

  return <span>{text}</span>;
};

const formatLastSavedAt = (savedAt: Date) => {
  const currentTime = new Date();

  return formatDistance(savedAt, currentTime, {
    addSuffix: true,
  });
};

const SaveStatus = ({
  savedAt,
  isPendingSave,
  isSaving,
  isError,
}: {
  savedAt: Date | undefined | null;
  isPendingSave: boolean;
  isSaving: boolean;
  isError: boolean;
}) => {
  return (
    <div className="flex items-center gap-x-1">
      {isSaving && (
        <>
          <CircleAlert size={16} className="text-orange-500" />
          <span className="text-xs text-secondary-foreground">Autosaving...</span>
        </>
      )}

      {isError && (
        <>
          <CircleX size={16} className="text-red-500" />
          <span className="text-xs text-secondary-foreground">Saving Failed.</span>
        </>
      )}

      {!savedAt || isPendingSave ? (
        <>
          <CircleAlert size={16} className="text-orange-500" />
          <span className="text-xs text-secondary-foreground">Not saved yet.</span>
        </>
      ) : (
        <>
          <CircleCheck size={16} className="text-green-500" />
          <span className="text-xs text-secondary-foreground">
            Last saved <LastSavedAt savedAt={savedAt} />.
          </span>
        </>
      )}
    </div>
  );
};

export default SaveStatus;
