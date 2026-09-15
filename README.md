# IQ Test

A static, single-page IQ test. No accounts, no backend, no data leaves the browser.

## Run it

Just open `index.html` in a browser, or serve the folder with any static file server:

```
npx serve .
```

## How it works

- `questions.js` — the question bank (30 questions across logical, numerical, verbal, and spatial reasoning, each with a difficulty weight).
- `script.js` — test flow: shuffles questions and answer order each run, runs a 20-minute countdown, scores answers, and maps the weighted score to an estimated IQ using a modeled normal distribution (mean 100, SD 15).
- `style.css` — styling, responsive and theme-aware (light/dark).

## Disclaimer

This is an entertainment / self-assessment tool, not a clinically validated psychometric instrument. It should not be used for diagnosis, employment, education, or any official decision.
