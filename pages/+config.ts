import vikeReact from "vike-react/config";
import type { Config } from "vike/types";
import vikeReactQuery from "vike-react-query/config";

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/Layout

  // https://vike.dev/head-tags
  title: "My Vike App",
  description: "Demo showcasing Vike",

  extends: [vikeReact, vikeReactQuery],

  // https://vike.dev/passToClient
  passToClient: ["user"],

  queryClientConfig: {
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  },
} satisfies Config;
