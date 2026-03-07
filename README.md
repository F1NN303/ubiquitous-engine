# Cell Arena (iOS + GitHub Pages)

Cell Arena is now a **fully static one-file Agar-style game** that runs well on iOS Safari and can be hosted directly on **GitHub Pages** (no custom server needed).

## Play locally

You can open `index.html` directly, or run any static file server if you prefer:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish to GitHub Pages

This repository includes a GitHub Actions workflow that deploys the static site to the `gh-pages` branch automatically.

1. Make sure the repository visibility is **Public**.
2. Push this repository to GitHub.
3. In GitHub, go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch **`gh-pages`** and folder **`/ (root)`**.
6. Push to `main` (or trigger the workflow manually in **Actions**).
7. Your game will be available at:
   - `https://<your-username>.github.io/<repo-name>/`

## Mobile controls

- **Touch joystick (left)**: move
- **Split button**: split to attack
- **Eject button**: eject mass
- Keyboard fallback: `Space` (split), `W` (eject)

## iOS tips

- Open the GitHub Pages URL in Safari.
- Use **Share → Add to Home Screen** for an app-like full-screen experience.
