const fs = require("fs");
const path = require("path");

const files = ["manifest.json", "select-image.js"];

const inputDir = "src";
const outputDir = "dist";

fs.readdirSync(path.join(__dirname, inputDir, "icons")).forEach(file =>
  files.push(`icons/${file}`)
);

for (const file of files) {
  if (!fs.existsSync(path.join(__dirname, outputDir, "icons"))) {
    fs.mkdirSync(path.join(__dirname, outputDir, "icons"));
  }
  const inputPath = path.join(__dirname, inputDir, file);
  const outputPath = path.join(__dirname, outputDir, file);
  fs.copyFileSync(inputPath, outputPath);
}

const mainFile = "background.js";
const mainInputPath = path.join(__dirname, inputDir, mainFile);
const mainOutputPath = path.join(__dirname, outputDir, mainFile);
const mainContent = fs.readFileSync(mainInputPath, "utf8");
let mainContentWithCode = mainContent;
const requireRegex = /require\(['"](.*)['"]\);/g;
while (mainContentWithCode.match(requireRegex) !== null) {
  mainContentWithCode = mainContentWithCode.replace(
    requireRegex,
    (match, p1) => {
      const filePath = path.join(__dirname, inputDir, p1);
      return fs.readFileSync(filePath, "utf8");
    }
  );
}

fs.writeFileSync(mainOutputPath, mainContentWithCode);
