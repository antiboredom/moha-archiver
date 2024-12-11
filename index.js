const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { parse } = require("csv-parse/sync");

function main() {
  const data = fs.readFileSync("sites.csv", "utf-8");
  const sites = parse(data, {
    columns: true,
    skip_empty_lines: true,
  });

  for (const site of sites) {
    const outname = path.join("pdfs", `${site.Autonumber}.pdf`);
    if (!fs.existsSync(outname)) {
      console.log("Downloading", site.URL, "to", outname);
      try {
        spawnSync("./node_modules/.bin/percollate", [
          "pdf",
          "-o",
          outname,
          site.URL,
        ]);
      } catch (e) {
        console.error("Failed to download", site.URL, "to", outname);
        console.error(e);
      }
    }
  }
}

main();
