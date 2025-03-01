import { schema } from "./custom-schemas";

// Since we are using a custom schema for the BlockNote,
// using the default BlockNoteEditor and PartialBlock type
// to anotate our editor and the editor content (document) simply won't work.
// TypeScript will complaint about missing custom block!
// https://www.blocknotejs.org/docs/custom-schemas#usage-with-typescript
export type CustomBlockNoteEditor = typeof schema.BlockNoteEditor;
export type CustomBlock = typeof schema.Block;
export type CustomPartialBlock = typeof schema.PartialBlock;
