# Contributing to CodeMinds

Hey there! Thanks for checking out CodeMinds. I'm a first-year student and I'm learning a lot through open source, so any help is super appreciated!

Here is a quick guide if you want to contribute:

## Setup Instructions

1. Fork the repo and clone it locally
2. Run `npm install` to get the dependencies
3. If you want to run the backend AI stuff, you'll need the API keys in a `.env` file (ask the maintainer for details). If you just want to test frontend stuff, `npm run dev` should still show the UI!
4. Run `npm run dev` to start the frontend and `node server.js` for the backend.

## Branch Naming

Try to keep branch names simple so everyone knows what they are for. For example:
- `feat/add-new-button` for new features
- `fix/typing-bug` for bug fixes
- `docs/update-readme` for documentation changes

## PR Guidelines

Before you open a PR, make sure everything works locally!
When you open a PR, just add a short description of what you changed and why. If it fixes an issue, link the issue so it closes automatically.

## What to touch (and what not to)

**What you can touch:**
- Frontend UI components in `src/components`
- CSS and styling stuff (Tailwind)
- Adding new cool features or fixing bugs in the UI

**What NOT to touch:**
- Please don't mess with the `server.js` or API routes unless it's a critical bug.
- Don't change the existing AI persona prompts because they are tuned carefully!
- Environment variables logic

Thanks for helping out! 😄
