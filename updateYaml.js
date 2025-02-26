const fs = require("fs");
const yaml = require("js-yaml");

// Load the existing YAML file
const yamlFilePath = "cooked_clash.yaml";
const pacFilePath = "pac.txt";

let yamlContents;
let pacContents;

// Read the PAC file
try {
  pacContents = fs.readFileSync(pacFilePath, "utf8");
} catch (e) {
  console.error(`Error reading PAC file: ${e}`);
  process.exit(1);
}

// Read the existing YAML file
try {
  yamlContents = fs.readFileSync(yamlFilePath, "utf8");
} catch (e) {
  console.error(`Error reading YAML file: ${e}`);
  process.exit(1);
}

// Parse the YAML content
let data;
try {
  data = yaml.load(yamlContents);
} catch (e) {
  console.error(`Error parsing YAML: ${e}`);
  process.exit(1);
}

// Process PAC contents and format rules
const pacLines = pacContents.split("\n").filter((line) => line.trim() !== "");
const formattedRules = pacLines
  .map((line) => {
    // Assuming each line in pac.txt is a domain or IP
    const trimmedLine = line.trim();
    if (trimmedLine) {
      return `DOMAIN-SUFFIX,${trimmedLine},REJECT`;
    }
    return null; // Prevent adding empty or malformed entries
  })
  .filter((rule) => rule !== null); // Filter out null entries

// Update the rules in the YAML data
data.rules = formattedRules;

// Write the updated YAML back to the file
try {
  const newYamlContents = yaml.dump(data);
  fs.writeFileSync(yamlFilePath, newYamlContents, "utf8");
  console.log("YAML file updated successfully.");
} catch (e) {
  console.error(`Error writing YAML file: ${e}`);
  process.exit(1);
}
