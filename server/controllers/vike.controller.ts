import { RequestHandler } from "express";
import { renderPage } from "vike/server";

export const vikeHandler: RequestHandler = async (req, res) => {
  const pageContextInit = {
    urlOriginal: req.originalUrl,
    headersOriginal: req.headers,
  };

  const pageContext = await renderPage(pageContextInit);

  if (pageContext.errorWhileRendering) {
    // Install error tracking here, see https://vike.dev/error-tracking
  }

  const { httpResponse } = pageContext;

  if (res.writeEarlyHints)
    res.writeEarlyHints({
      link: httpResponse.earlyHints.map((e) => e.earlyHintLink),
    });

  httpResponse.headers.forEach(([name, value]) => res.setHeader(name, value));
  res.status(httpResponse.statusCode);
  httpResponse.pipe(res);
};
