# Deployment Guide - Creative Design Showcase

Your project is a static web application (HTML, CSS, JS), which makes it extremely easy to host for free. Here are the three best ways to take your gallery live.

## 🚀 Option 1: Vercel (Easiest / Recommended)
Vercel is incredibly fast and specialized in high-performance frontend hosting.

1.  **Install Vercel CLI**: `npm i -g vercel` (if you have Node.js).
2.  **Deploy**: Navigate to your project folder in the terminal and run:
    ```bash
    vercel
    ```
3.  **Follow the prompts**: Vercel will detect your static files and give you a live URL in seconds.

---

## 🐙 Option 2: GitHub Pages
Best if you already have your code in a GitHub repository.

1.  **Push to GitHub**: Ensure your project is in a public or private repo.
2.  **Enable Pages**:
    - Go to **Settings** > **Pages**.
    - Under "Build and deployment", set the source to **Deploy from a branch**.
    - Select your `main` branch and the `/ (root)` folder.
3.  **Wait**: Your site will be live at `https://<your-username>.github.io/<repo-name>/` within a minute.

---

## ⚡ Option 3: Netlify "Drag and Drop"
Perfect if you don't want to use the terminal or GitHub.

1.  Go to [Netlify Drop](https://app.netlify.com/drop).
2.  Drag the entire `project-gallery` folder into the browser window.
3.  **Done**: You'll get a randomly generated URL immediately that you can customize later.

---

## ⚠️ Pre-Deployment Checklist
- **YouTube IDs**: Double-check `projects.js` to ensure all `videoId` values are valid.
- **External Links**: Ensure your `link` fields point to the correct project pages.
- **Assets**: If you added local images to the `image` field, make sure they are included in the folder you deploy.
- **Clean Up**: You can delete `project_data.js` if you are exclusively using the new `projects.js` format.
