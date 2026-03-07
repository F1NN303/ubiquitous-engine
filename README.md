# Cell Arena (One-HTML, iOS-friendly)

This repository now contains a **single-file playable Agar-style game** built for mobile browsers (including iOS Safari).

## Run

Because browser security can block some features on `file://`, run a tiny local server:

```bash
python3 -m http.server 8000
```

Then open:

- `http://localhost:8000/index.html`

## Controls

- **Touch joystick (left)**: move
- **Split button**: split to attack
- **Eject button**: eject mass
- Keyboard fallback: `Space` (split), `W` (eject)
