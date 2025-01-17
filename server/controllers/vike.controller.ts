import { RequestHandler } from "express";
import { renderPage } from "vike/server";
import { UNAUTHORIZED } from "../constants/http";

export const vikeHandler: RequestHandler = async (req, res) => {
  const user =
    req.statusCode === UNAUTHORIZED
      ? // when no access token found in the request,
        // or when the access token is expired.
        null
      : {
          id: req.userId,
          sessionId: req.sessionId,
          role: req.userRole,
        };

  const pageContextInit = {
    urlOriginal: req.originalUrl,
    headersOriginal: req.headers,
    // when the access token is expired,
    // set the user to undefined instead of null.
    // This is how we tell Vike what is what.
    user: req.tokenExp ? undefined : user,
    tokenExp: req.tokenExp,
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
