let configs = {
  "files": [{ 
    "include": "./**/*.js", 
    "ignore": [
        "./**/*.route.js",
        "./index.js",
        "./model-binder.config.js"
      ] 
    }
  ],
  "rootDir": __dirname
};

export { configs }