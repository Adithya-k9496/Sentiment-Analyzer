# 🧠 Sentiment Analyzer – Deep Text Analytics

Welcome to the **Sentiment Analyzer** — a premium, fully client-side web application designed to analyze text, extract emotional markers, and highlight semantic words in real-time. 

Built with modern web technologies, the app runs entirely in the browser, requires no server or backend, and is 100% ready for hosting on **GitHub Pages**.

---

## 🔗 Live Site Demo

Once deployed, your live site will be hosted here:  
👉  https://adithya-k9496.github.io/Sentiment-Analyzer/

---

## 🎯 Key Features

* **Real-time Scoring**: Instantly calculates a sentiment score from `-5.0` (Highly Negative) to `+5.0` (Highly Positive) as you type.
* **Dynamic Sentiment Gauge**: An animated, circular SVG gauge that updates color dynamically (Green for Positive, Red for Negative, Amber for Neutral).
* **Semantic Word Highlights**: Automatically highlights positive words in green and negative words in red in the preview window to show the analysis rationale.
* **Primary Emotion Breakdown**: Analyzes text to display relative levels of **Joy**, **Sadness**, **Anger**, and **Fear** using animated progress bars.
* **Text Statistics**: Measures character count, word count, sentence count, and average reading time in real-time.
* **Session History Log**: Logs recent analysis inputs and their scores during your session so you can compare reviews.
* **Premium Glassmorphism Style**: Built with Outfit & Inter Google Fonts, glassmorphic cards (`backdrop-filter`), smooth gradients, and transitions.
* **Light & Dark Mode**: Supports manual theme toggling, with theme preference persisted in the browser's `localStorage`.

---

## 🗂 Project Structure

```text
sentiment-analyzer/
├── index.html        # HTML5 structure, layouts, and input dashboard
├── style.css         # Glassmorphic themes, custom variables, responsive grid, and dark mode
├── script.js          # Lexicon mapping, emotion analysis engine, UI handlers, and history log
└── README.md         # Documentation and guide (this file)
```

---

## 🚀 Getting Started

### Run Locally
1. Download or clone this directory.
2. Double-click **`index.html`** to launch the application directly in any modern web browser.
3. Type custom text or click the sample review buttons (**Positive Review**, **Negative Review**, or **Neutral Info**) to test the engine.

### How to Deploy to GitHub Pages (Free Hosting)
1. Log in to [GitHub](https://github.com/) and create a new public repository named `sentiment-analyzer`.
2. Commit and upload the project files (`index.html`, `style.css`, `script.js`, and `README.md`) to the repository.
3. Inside your repository, go to **Settings** > **Pages**.
4. Under **Build and deployment** > **Source**, make sure **Deploy from a branch** is selected.
5. Set the branch to `main` (or `master`) and directory to `/ (root)`.
6. Click **Save**. Wait 1–2 minutes, and your site will be live at `https://<your-username>.github.io/sentiment-analyzer/`!
