import React, { useState } from "react";
import { monokaiSublime } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import SyntaxHighlighter from "react-syntax-highlighter";
import CopyToClipboard from "react-copy-to-clipboard";
import { CircleCheck, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/core/lib/utils";

interface CodeBlockProps {
  code?: string;
  language?: string;
  className?: string;
  enableCopy?: boolean;
}

export const CodeBlock = ({ code = "", language = "javascript", className, enableCopy = true }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const notify = () => {
    toast(<ToastDisplay className="bg-neutral-700 m-2" />);
    copy();
  };

  function ToastDisplay(className: { className: string }) {
    return (
      <div className={cn("m-2", className)}>
        <p className="text-md">Copied to clipboard !</p>
      </div>
    );
  }
  const copy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        data-button-type="code-block"
        className={cn("absolute flex items-center gap-1 top-0 right-0 p-3", className)}
      >
        <div className="m-1 pb-1 text-xs">{language}</div>
        {enableCopy && (
          <CopyToClipboard text={code} onCopy={() => notify()}>
            {copied ? (
              <CircleCheck size={16} className="text-lg m-1 text-green-500" />
            ) : (
              <Copy size={16} className="text-lg m-1 hover:text-white" />
            )}
          </CopyToClipboard>
        )}
      </button>
      <SyntaxHighlighter
        className="rounded-md"
        language={language}
        style={monokaiSublime}
        wrapLines={true}
        wrapLongLines={true}
        showLineNumbers={false}
        showInlineLineNumbers={false}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};
