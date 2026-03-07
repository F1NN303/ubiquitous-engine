#!/usr/bin/env python3
"""Simple static server for Cell Arena.

Serves files from this repository and binds to 0.0.0.0 by default so the game
can be accessed from other devices or through hosted/container web previews.
"""

from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import os


HOST = os.environ.get("HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", "8000"))


def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), SimpleHTTPRequestHandler)
    print(f"Serving Cell Arena at http://{HOST}:{PORT}/index.html")
    server.serve_forever()


if __name__ == "__main__":
    main()
