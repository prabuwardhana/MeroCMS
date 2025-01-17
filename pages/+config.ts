import vikeReact from "vike-react/config";
import type { Config } from "vike/types";
import vikeReactQuery from "vike-react-query/config";

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/head-tags
  title: "My Vike App",
  description: "Demo showcasing Vike",

  extends: [vikeReact, vikeReactQuery],

  // https://vike.dev/passToClient
  passToClient: ["user"],

  // https://github.com/vikejs/vike-react/tree/main/packages/vike-react-query#settings
  queryClientConfig: {
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  },
} satisfies Config;
