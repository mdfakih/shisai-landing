import { Writable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";

/** Render one route to HTML for scripts/prerender.mjs, waiting for lazy pages to resolve. */
export function render(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let html = "";
    const sink = new Writable({
      write(chunk, _encoding, done) {
        html += chunk.toString();
        done();
      },
    });
    sink.on("finish", () => resolve(html));
    const stream = renderToPipeableStream(
      <StaticRouter location={url}>
        <App />
      </StaticRouter>,
      {
        onAllReady: () => stream.pipe(sink),
        onShellError: reject,
        onError: reject,
      },
    );
  });
}
