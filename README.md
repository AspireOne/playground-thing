<div align="center">
<img src="./dist/assets/icon.jpeg" alt="Web Extension Template" \>
</div>

# Playground Thing

A small extension that elevates the OpenAi Playground experience.

## :sparkle: Features

* Markdown for A.I. messages
* Code highlighting & copy-on-click
* Automatically refocus input textbox & restore cursor position on page refocus (very handy when creating a prompt and switching back and forth between windows)
* Default system prompt
* Decreased system prompt div width (more free real estate for messages)
* More (this readme will very likely get out of date)

## :shield: How to use
* To load the extension, go to ```chrome://extensions``` and load the ```dist``` folder.
* The extension will run automatically in the background - no manual intervention needed.
* To develop, scroll down to Setup.



---



## :open_file_folder: Project Structure

* **src/**: TypeScript source files
* **src/assets**: Static files
* **src/assets/images/**: Image files
* **dist**: The Extension directory (this is what you'll load in ```chrome://extensions```)
* **dist/scripts**: Generated JavaScript files

## :hammer: Setup

* To Install: ```pnpm install```
* To Run & develop (& watch for changes): ```pnpm dev```
* To Build (Note: ```pnpm dev``` also builds it): ```pnpm build```
* Install "biome" extension for formatting & linting

## :eye_speech_bubble: Technologies

* **Biomejs** for linting & formatting (note: install the biome extension)
* Webpack
* React support
* Typescript

![screenshot](https://github.com/AspireOne/playground-thing/assets/57546404/0832e53d-70cf-4d4f-bfaa-d21195a2f959)
