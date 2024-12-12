const fs = require("fs");
const readline = require("readline");

function convertMarkdownToHtml(markdown) {
  const lines = markdown.split("\n");
  let html = "";

  lines.forEach((line) => {
    if (line.startsWith("# ")) {
      html += `<h1>${line.substring(2)}</h1>\n`;
    } else if (line.startsWith("## ")) {
      html += `<h2>${line.substring(3)}</h2>\n`;
    } else if (line.startsWith("### ")) {
      html += `<h3>${line.substring(4)}</h3>\n`;
    } else if (line.startsWith("- ")) {
      html += `<ul><li>${line.substring(2)}</li></ul>\n`;
    } else {
      html += `<p>${line}</p>\n`;
    }
  });

  return html;
}

function writeScaffold(html) {
  return `<!DOCTYPE html>
            <html>
            <head>
                <title>Super cool Converted Website</title>
            </head>
            <body>
                ${html}
            </body>
            </html>`;
}

async function processFile(inputFile, outputFile) {
  const fileStream = fs.createReadStream(inputFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let markdown = "";
  for await (const line of rl) {
    markdown += line + "\n";
  }

  const html = convertMarkdownToHtml(markdown);
  const scaffoldedHtml = writeScaffold(html);
  fs.writeFileSync(outputFile, scaffoldedHtml);
}

// Checks if the input file is provided
if (process.argv.length < 3) {
  console.error("Usage: node converter.js <inputFile>");
  process.exit(1);
}

const inputFile = process.argv[2];
const outputFile = "output.html";

processFile(inputFile, outputFile)
  .then(() => console.log("Conversion complete"))
  .catch((err) => console.error(err));
