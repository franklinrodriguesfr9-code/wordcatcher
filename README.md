# WordCatcher

WordCatcher is a local-first PWA for studying English words with listening and shadowing practice. It stores all data in the browser with `localStorage`; there is no backend, login, cloud database, or paid API.

## Install

```bash
npm install
```

## Run in development

```bash
npm run dev
```

Open the local URL shown by Vite. Because this project is configured for GitHub Pages, the app path is `/wordcatcher/`.

## Run tests

```bash
npm test
npm run test:e2e
```

## Build for production

```bash
npm run build
```

The production files are generated in `dist`.

## Preview the production build

```bash
npm run preview
```

Open the preview URL with `/wordcatcher/` at the end. Example:

```text
http://127.0.0.1:4173/wordcatcher/
```

## Deploy to GitHub Pages

This project includes a GitHub Actions workflow at `.github/workflows/deploy.yml`.

1. Create a GitHub repository named `wordcatcher`.
2. Push this project to the `main` branch.
3. In the repository settings, open `Pages`.
4. Set `Build and deployment` to `GitHub Actions`.
5. Push a commit to `main`, or run the workflow manually from the `Actions` tab.

The app is built with this Vite base path:

```ts
base: "/wordcatcher/"
```

If the repository name changes, update `base`, `start_url`, `scope`, and the PWA icon path in `vite.config.ts` before deploying.

After deployment, the public app URL will use this format:

```text
https://USERNAME.github.io/wordcatcher/
```

Replace `USERNAME` with your GitHub username.

## Install and use as a PWA

After WordCatcher is published on GitHub Pages, the notebook does not need to stay on. GitHub Pages hosts the production app, and the installed PWA runs from the published URL.

On Android:

1. Open `https://USERNAME.github.io/wordcatcher/` in Chrome.
2. Use `Install app` or `Add to Home screen`.
3. Open WordCatcher from the home screen icon.

On iPhone:

1. Open `https://USERNAME.github.io/wordcatcher/` in Safari.
2. Tap the share button.
3. Use `Add to Home Screen`.
4. Open WordCatcher from the home screen icon.

## Local data and backups

WordCatcher saves data locally in the browser on each device.

- Words saved on the phone stay on the phone.
- Words saved on the notebook stay on the notebook.
- To move data between devices, use `Export Words` and `Import Words` in the `Backup` tab.
- Export a backup from time to time so your words are not lost if browser data is cleared.

## Manual mobile layout checklist

- Add a word on a narrow screen.
- Confirm all four tabs are easy to reach.
- Confirm long words and long translations wrap inside cards.
- Confirm buttons are large enough to tap comfortably.
- Generate and copy a review prompt.
- Export a backup and import it again.
- Install the app as a PWA and open it from the installed icon.
