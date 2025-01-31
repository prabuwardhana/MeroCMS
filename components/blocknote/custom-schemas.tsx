import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { Alert } from "./custom-blocks/alert";

// Our schema with block specs, which contains the configs and implementations for blocks
// that we want our editor to use.
export const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Adds all default blocks.
    ...defaultBlockSpecs,
    // Adds the custom blocks.
    alert: Alert,
  },
});
