# Cell Arena (One-HTML, iOS-friendly)

This repository now contains a **single-file playable Agar-style game** built for mobile browsers (including iOS Safari).

## Run

Because browser security can block some features on `file://`, run the included web server:

```bash
python3 server.py
```

Then open:

- `http://localhost:8000/index.html` (same device)
- `http://<your-machine-ip>:8000/index.html` (from another device on your network)

You can also override host/port for cloud/container environments:

```bash
HOST=0.0.0.0 PORT=8080 python3 server.py
```

## Controls

- **Touch joystick (left)**: move
- **Split button**: split to attack
- **Eject button**: eject mass
- Keyboard fallback: `Space` (split), `W` (eject)
