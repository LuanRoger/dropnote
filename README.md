# Dropnote

Create, edit, and share text instantly.

Dropnote is a simple, fast, and secure way to create and share text notes. It allows you to write notes quickly without the need for an account or complex setup. You can share your notes with others by simply copying the URL.

## Features

- **Instant Note Creation**: Start writing immediately without any registration.
- **Shareable Links**: Easily share your notes with others via a unique URL.
- **Privacy Focused**: Your notes are not stored permanently, ensuring your privacy.
- **Simple Interface**: A clean and intuitive interface for distraction-free writing.
- **WYSIWYG**: Write in a What You See Is What You Get editor, making formatting easy.
- **Markdown Support**: Use Markdown syntax for advanced formatting options.
- **No Account Required**: Just open the app and start writing.
- **Auto-Save**: Your notes are automatically saved as you type.
- **Cross-Platform**: Accessible from any device with a web browser.
- **Image support**: Embed images in your notes.
- **Code Blocks**: Write and share code snippets with syntax highlighting.
- **Dark Mode**: It's dark mode.

## Pre-requisites

Before you begin, ensure you have met the following requirements:

- **Docker**: Install [Docker](https://www.docker.com/get-started) on your machine.
- **Node.js**: Install [Node.js](https://nodejs.org/) (version 22 or later).
- **MongoDB**: Have a running instance of [MongoDB](https://www.mongodb.com/) (version 5 or later).

## Installation

1. **Clone the Repository**:

```bash
git clone git@github.com:LuanRoger/dropnote.git
cd dropnote
```

> SSH recommended for cloning.

2. **Install Dependencies**:

```bash
npm install
```

3. **Configure Environment Variables**:
   Duplicate the `env.example`, rename to `.env` and set the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/dropnote
```

4. **Run the Application**:

```bash
npm run dev
```

5. **Access the Application**:

Open your web browser and navigate to `http://localhost:3000`.

## Docker Deployment

To deploy Dropnote using Docker, follow these steps:

1. **Build the Docker Image**:

```bash
docker build -t dropnote .
```

2. **Run the Docker Container**:

```bash
docker run -d -p 3000:3000 --name dropnote dropnote
```

3. **Access the Application**:

Open your web browser and navigate to `http://localhost:3000`.

## Docker Compose

You can also use Docker Compose to run Dropnote along with MongoDB. Just go to the root directory and run the command:

```bash
docker-compose up
```
