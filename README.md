# ublog
Small and powerful blogging engine using Node and React

## Tech Details
- No huge frameworks. Only bare minimum: node.js + Express, React + Webpack
- No syntax sugar. Less code = less bugs = less security vulnerabilities

## Installation
For development:
- npm install -g nodemon
- npm install -g gulp
- npm install

## Running in Development Mode
gulp run

This will run the server at http://localhost:4000 and will automatically rebuild everything.
You just need to refresh your webpage to reload latest changes.

## Coding Style
- JavaScript Coding Style
  - "use strict"
  - Single quotes for javascript code, double quotes for embedded HTML code/strings
  - { on the same line as the previous statement
  - Comments should explain "why", not "what" is being done
  - Use "async" module to handle async tasks
- CSS Style: [TODO]

## Software Architecture
The UBlog blogging platform consists of two big parts: backend (server) and frontend (client).
These parts share the components (isomorphic javascript) thanks to using React technology.
