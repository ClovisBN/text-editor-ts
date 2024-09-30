const fs = require("fs");
const path = require("path");

const directoryPath = path.join(__dirname, "dist");

function addJsExtensionToImports(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const updatedContent = content.replace(
    /(import .* from\s+['"])(.*?)(['"];)/g,
    (match, p1, p2, p3) => {
      // Si l'import n'a pas déjà l'extension .js
      if (!p2.endsWith(".js")) {
        return `${p1}${p2}.js${p3}`;
      }
      return match; // Ne pas changer la ligne si l'extension est déjà présente
    }
  );
  fs.writeFileSync(filePath, updatedContent, "utf8");
}

function processDirectory(directoryPath) {
  fs.readdirSync(directoryPath).forEach((file) => {
    const fullPath = path.join(directoryPath, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith(".js")) {
      addJsExtensionToImports(fullPath);
    }
  });
}

processDirectory(directoryPath);
