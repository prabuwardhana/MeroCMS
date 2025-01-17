export const config = {
  ssr: false,
  meta: {
    data: {
      // By default, the data() hook is loaded and executed only on the server-side.
      // We want the data() hook to be loaded and executed onl on the client-side.
      env: { server: false, client: true },
    },
  },
};
