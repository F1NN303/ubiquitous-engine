# Cell Arena (iOS + GitHub Pages)

Cell Arena is now a **fully static one-file Agar-style game** that runs well on iOS Safari and can be hosted directly on **GitHub Pages** (no custom server needed).

## Play locally

You can open `index.html` directly, or run any static file server if you prefer:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish to GitHub Pages

This repository includes a GitHub Actions workflow that deploys `index.html` automatically.

1. Push this repository to GitHub.
2. In GitHub, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions** as the source.
4. Push to `main` (or trigger the workflow manually in **Actions**).
5. Your game will be available at:
   - `https://<your-username>.github.io/<repo-name>/`

## Mobile controls

- **Touch joystick (left)**: move
- **Split button**: split to attack
- **Eject button**: eject mass
- Keyboard fallback: `Space` (split), `W` (eject)

## iOS tips

- Open the GitHub Pages URL in Safari.
- Use **Share → Add to Home Screen** for an app-like full-screen experience.
