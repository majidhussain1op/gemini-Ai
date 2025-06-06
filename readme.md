# SnapSite - Website Screenshot Tool

SnapSite is a Node.js web application that allows users to take screenshots of any website and download them. It features a modern SaaS-style interface with dark mode, micro-animations, and various informational sections.

## Features

*   Take screenshots of any public website URL.
*   Download screenshots in PNG format.
*   Modern, responsive user interface.
*   Dark/Light mode toggle.
*   Placeholder ad banners.
*   Sections: Hero with Tool, Process, Features, Pricing (Free), FAQs.

## Tech Stack

*   **Backend:** Node.js, Express.js, Puppeteer
*   **Frontend:** HTML, CSS (with CSS Variables for theming), Vanilla JavaScript

## Prerequisites

*   Node.js (v14 or later recommended)
*   npm (comes with Node.js)
*   A web browser (for using the app)

## Getting Started

1.  **Clone the repository (or download the files):**
    ```bash
    # If you had this in a git repo:
    # git clone <repository-url>
    # cd snap-site-app
    # For now, just make sure you have server.js, index.html, and this README.md in a folder.
    ```

2.  **Create a `screenshots` directory:**
    The application will save screenshots into a directory named `screenshots` in the root of the project. Create this folder manually:
    ```bash
    mkdir screenshots
    ```

3.  **Install Dependencies:**
    Navigate to the project directory in your terminal and run:
    ```bash
    npm install express puppeteer
    ```
    This will install Express.js (for the web server) and Puppeteer (for taking screenshots).

4.  **Run the Application:**
    ```bash
    node server.js
    ```

5.  **Access the Application:**
    Open your web browser and go to `http://localhost:3000`.

## How to Use

1.  Open the application in your browser.
2.  In the "Enter Website URL" field, type or paste the full URL of the website you want to capture (e.g., `https://example.com`).
3.  Click the "Capture Screenshot" button.
4.  Wait for the process to complete. A preview of the screenshot will appear.
5.  Click the "Download Screenshot" button to save the image to your computer.

## Notes

*   **Puppeteer:** Puppeteer downloads a version of Chromium when installed. This can take some time and disk space on the first `npm install`.
*   **Error Handling:** Basic error handling is in place. If a URL is invalid or a site is inaccessible, an error message should appear.
*   **Ad Placeholders:** The ad banners are currently placeholders. You would need to integrate with an ad network like Google AdSense to display real ads.
*   **Security:** Be cautious about URLs submitted to the tool if it were publicly hosted, as it interacts with external websites.

## File Structure