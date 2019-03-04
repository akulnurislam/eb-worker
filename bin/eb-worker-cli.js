#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const program = require('commander');
const { name, version } = require('../package');

let workerName;
program
  .name(name)
  .version(version, '-v, --version')
  .usage('<name>')
  .arguments('<name>')
  .command('<name>', 'generate worker')
  .action(name => {
    workerName = name
  })
  .parse(process.argv);

const BASE_DIRECTORY = path.join(process.cwd(), workerName);
const TEMPLATE_PROJECT_DIRECTORY = path.join(__dirname, '..', 'template');

if (workerName !== '.') {
  createDirectory(BASE_DIRECTORY);
} else {
  workerName = getBaseDirectoryName();
}

copyDirectory(TEMPLATE_PROJECT_DIRECTORY, BASE_DIRECTORY);
createPackageJson(workerName);
createReadme(workerName);

console.info(`${workerName} worker has been created.`);
console.info();

function createDirectory(directoryName) {
  try {
    const MODE_755 = parseInt('0755', 8)
    fs.mkdirSync(directoryName, { mode: MODE_755 });
  } catch (err) {
    console.error(`Failed create worker directory`);
    console.error(err.message);
    process.exit(1);
  }
}

function copyDirectory(source, destination) {
  fs.readdirSync(source, { encoding: 'utf8' })
    .forEach(fileName => {
      const sourceName = path.join(source, fileName);
      const destinationName = path.join(destination, fileName);

      const stats = fs.statSync(sourceName);

      if (stats.isFile()) {
        fs.copyFileSync(sourceName, destinationName);
      } else {
        createDirectory(destinationName);
        copyDirectory(sourceName, destinationName);
      }
    });
}

function createPackageJson(name) {
  const package = {
    name,
    version: '0.0.1',
    description: 'created with love by eb-worker generator',
    main: 'index.js',
    scripts: {
      start: 'node index.js'
    },
    license: 'MIT',
    dependencies: {
      dotenv: '^6.2.0',
      express: '^4.16.4',
      morgan: '^1.9.1'
    }
  };

  fs.writeFileSync(path.join(BASE_DIRECTORY, 'package.json'), JSON.stringify(package, null, 2), { encoding: 'utf8' });
}

function createReadme(name) {
  const readmeFile = path.join(BASE_DIRECTORY, 'README.md');
  const readme = fs.readFileSync(readmeFile, { encoding: 'utf8' }).replace(/{{workerName}}/, name);
  fs.writeFileSync(readmeFile, readme, { encoding: 'utf8' });
}

function getBaseDirectoryName() {
  return process.cwd().split(path.sep).pop();
}
