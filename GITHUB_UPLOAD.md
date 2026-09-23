# Upload this arcade to GitHub

This ZIP contains the complete source for all fifteen Dora & Enzo browser games. Extract it first; GitHub does not unpack a ZIP uploaded through the repository file uploader.

1. Create an empty GitHub repository.
2. Extract the archive and upload its contents to that repository, preserving the folders. For larger uploads, use Git locally:

   ```sh
   git init
   git add .
   git commit -m "Add Dora and Enzo arcade"
   git branch -M main
   git remote add origin https://github.com/YOUR-USER/YOUR-REPO.git
   git push -u origin main
   ```

3. To play locally, install Node.js 22.13 or newer, then run `npm ci` and `npm run dev`. Open `http://localhost:3000`.

The site uses Vinext and Three.js. GitHub Actions checks the code on pushes. GitHub Pages cannot run this server app directly; deploy it to a compatible host if you want a public game URL. The included `.openai/hosting.json` retains the existing Sites project ID for continuing that deployment.
