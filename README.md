
# AI Photo Pro

AI Photo Pro is a modern, web-based photo editing application that leverages the power of Google's Gemini AI to analyze, enhance, and apply professional styles to your images. Built with React, TypeScript, and Tailwind CSS, this app provides a seamless and intuitive user experience.

![App Screenshot](https://picsum.photos/1200/600)

## Features

- **AI-Powered Image Analysis**: Automatically detects image quality, including resolution, sharpness, lighting, and flaws.
- **High-Resolution Enhancement**: Instantly upgrades your photos to a higher resolution, improving clarity and detail.
- **One-Click Professional Styling**: Apply a variety of professional styles like "DSLR Quality", "Cinematic", or "Vintage Film".
- **Custom Style Prompts**: Describe any style you can imagine, and the AI will apply it to your photo.
- **Intuitive Interface**: A simple drag-and-drop uploader and a clear, step-by-step editing process.
- **Responsive Design**: Looks and works great on all devices, from desktops to mobile phones.

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **AI Model**: Google Gemini (`gemini-2.5-flash-image`) via `@google/genai` SDK

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### 1. Obtain a Google Gemini API Key

This application requires a Google Gemini API key to function.

1.  Go to the [Google AI Studio](https://aistudio.google.com/).
2.  Sign in with your Google account.
3.  Click on the "**Get API key**" button on the top left.
4.  Click "**Create API key in new project**".
5.  Copy the generated API key. **Keep this key secure and do not share it publicly.**

### 2. Project Setup

**Prerequisites:**
- [Node.js](https://nodejs.org/) (version 18 or later recommended)
- `npm` or `yarn` package manager

**Installation:**

1.  **Clone the repository (or download the source files):**
    ```bash
    git clone https://github.com/your-username/ai-photo-pro.git
    cd ai-photo-pro
    ```

2.  **Install dependencies:**
    The necessary dependencies are listed in `dependencies.json`. To install them, you would typically run:
    ```bash
    # Using npm
    npm install @google/genai react react-dom
    npm install -D @types/react @types/react-dom typescript
    
    # Or using yarn
    yarn add @google/genai react react-dom
    yarn add -D @types/react @types/react-dom typescript
    ```

3.  **Create an environment file:**
    Copy the example environment file `.env.example` to a new file named `.env.local`.
    ```bash
    cp .env.example .env.local
    ```
    Open `.env.local` in your text editor and paste your Google Gemini API key:
    ```
    # .env.local
    API_KEY="YOUR_GOOGLE_GEMINI_API_KEY_HERE"
    ```
    *Note: If you are using Create React App, your variable must be prefixed with `REACT_APP_`. For Vite, it must be `VITE_`. The code uses `process.env.API_KEY`, assuming the build tool is configured to replace this.*

### 3. Running Locally

Once the setup is complete, you can run the development server.

```bash
# Using npm
npm start

# Or using yarn
yarn start
```

This will start the application, and you can access it in your browser, usually at `http://localhost:3000`.

---

## Deployment

This is a client-side React application. To deploy it, you need to build the static files and host them on a static hosting provider.

### 1. Build the Application

Run the build command to generate a `build` or `dist` folder containing the optimized static assets.

```bash
# Using npm
npm run build

# Or using yarn
yarn build
```

### 2. Deploying to a Static Host

You can deploy the contents of the generated `build` (or `dist`) folder to any static hosting service.

**Important Note on API Keys:** Since this is a client-side app, your `API_KEY` will be exposed in the browser. For a production application, you should create a backend server (e.g., using Node.js/Express) that acts as a proxy to the Gemini API. The client would make requests to your backend, and your backend would securely call the Gemini API with your key. However, for personal projects or demos, client-side usage is simpler.

#### Example: Deploying to Render

1.  Push your code to a GitHub repository.
2.  Go to the [Render Dashboard](https://dashboard.render.com/) and click "**New +**" -> "**Static Site**".
3.  Connect your GitHub repository.
4.  Configure the settings:
    - **Build Command**: `npm run build` (or `yarn build`)
    - **Publish Directory**: `build` (or `dist`)
5.  Add your environment variable:
    - Click on the "**Environment**" tab.
    - Add a secret file or environment variable with the key `API_KEY` and your Gemini API key as the value. Your build tool must be configured to use this at build time.
6.  Click "**Create Static Site**". Render will automatically build and deploy your site.

#### Example: Deploying to Vercel or Netlify

The process is very similar for Vercel and Netlify.
1.  Connect your Git repository.
2.  They will likely auto-detect that it's a React project.
3.  Set the build command and publish directory if they aren't detected correctly.
4.  Go to the project's settings and add your `API_KEY` as an environment variable.
5.  Deploy.

### 3. Deploying to a VPS or Local Network

1.  Build the application as described above.
2.  Copy the contents of the `build` (or `dist`) folder to your server.
3.  Use a web server like **Nginx** or **Apache** to serve the static files.

**Example Nginx Configuration:**

Create a new server block configuration file (e.g., `/etc/nginx/sites-available/ai-photo-pro`):

```nginx
server {
    listen 80;
    server_name your-domain.com; # or your server's IP address

    root /var/www/ai-photo-pro; # Path to your build files
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
```

Enable the site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/ai-photo-pro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

This will make your application accessible over your local network (using the server's local IP) or the internet (if configured with a domain).
