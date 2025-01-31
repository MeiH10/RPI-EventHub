# Backend Project Structure Guide

Hey there! 👋 This doc explains how our backend is organized. Keep this handy for future reference!

---

## 📁 Folder Structure
Here's what the `backend/` directory looks like:

```text
backend/
├── config/ # Some config settings live here
├── controller/ # Controllers (they handle HTTP stuff)
├── logs/ # Auto-generated logs (DON'T COMMIT THIS! It's in .gitignore)
├── models/ # MongoDB schemas & database models
├── node_modules/ # Dependencies (DON'T COMMIT THIS, EVER!)
├── routes/ # Route definitions (but we mostly use index.js for routes)
├── services/ # Core logic
├── useful_script/ # Handy scripts (like image/poster processing)
├── .env # Environment variables (DON'T COMMIT THIS!)
├── BACKEND_DEV_NOTE.md # You're reading this right now 😉
├── cleanData.js # Nuke database data (use carefully!)
├── counter.js # Count events in DB
├── index.js # Main entry point - server starts here
├── package.json # Project metadata & dependencies
├── package-lock.json# Lockfile (DON'T COMMIT THIS!)
├── pm2.config.js # PM2 config for production
└── sqldb.js # MongoDB connection setup
```


---

## 🗂 Key Directories Explained

### `config/`
- **What's inside**: Configuration files (Azure Storage Configuration, for event changes log)
- **Pro tip**: Use `config.js` to manage environment-specific settings.

### `controller/`
- **What it does**: Handles incoming HTTP requests.
- **Example**: If a user creates an event, the controller validates the request and passes it to services.

### `models/`
- **What's inside**: Blueprints for MongoDB data.
- **Example**: `Event.js` defines what an event looks like in the database.

### `services/`
- **Most important folder!** Contains the actual business logic.
- **Example**: `eventService.js` handles creating events, deleting events, etc.

### `useful_script/`
- **Handy tools**:
    - `uploadUtils.js`: multer setup for image uploads.
    - `imageUtils.js`: Resize images for thumbnails.
    - `tagFunction.js`: Tagging events with keywords.

---

## 📄 Important Files

### `.env`
- **Secret stuff**: Database URLs, API keys, JWT secrets. ASK A TEAMMATE FOR THIS!
- **🚨 NEVER COMMIT THIS FILE!** Duplicate `.env.example` instead for reference.

### `index.js`
- **The heart**: Starts the Express server, connects routes, and initializes middlewares.

### `pm2.config.js`
- **Production setup**: Configures how PM2 (process manager) runs our app in production.

### `sqldb.js`
- **Database connection**: Sets up MongoDB connection using Mongoose.

---

## 💡 Tips
1. **Git Hygiene**:
    - `node_modules/`, `.env`, `logs/`, and `package-lock.json` are in `.gitignore` for a reason!
2. **Workflow**:
    - Controllers → Call Services → Services use Models → Profit! 🚀

---