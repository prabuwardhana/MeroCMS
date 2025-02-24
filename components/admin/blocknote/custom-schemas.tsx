import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { Alert } from "./custom-blocks/Alert";
import { CodeBlockEditor } from "./custom-blocks/CodeBlockEditor";

// Disable the Audio and Image blocks from the built-in schema
// This is done by picking out the blocks you want to disable
const { codeBlock, ...remainingBlockSpecs } = defaultBlockSpecs;

// Our schema with block specs, which contains the configs and implementations for blocks
// that we want our editor to use.
export const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Adds all default blocks.
    ...remainingBlockSpecs,
    // Adds the custom blocks.
    alert: Alert,
    procode: CodeBlockEditor,
  },
});
