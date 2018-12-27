require('format-unicorn');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const log = console.log;
const ora = require('ora');
const prettier = require('prettier');
const downloadRepo = require('../utils/downloadRepo');
const child_process = require('child_process');

const PATH_EXIST_MESSAGE_TEMPLATE = `
The directory ${chalk.green('{project}')} contains files that could conflict
\n
try using a new directory name
`;

const CURRENT_PATH = process.cwd();

module.exports = async function(project) {
  // prevent any symbol
  if (project.match(/\W/g)) {
    log(chalk.bold.red(`project name can't contains non word character`));
    process.exit();
  }

  const projectPath = path.join(CURRENT_PATH, project);
  const packageJsonPath = path.join(projectPath, 'package.json');
  if (fs.existsSync(projectPath)) {
    log(PATH_EXIST_MESSAGE_TEMPLATE.formatUnicorn({project}));
    process.exit();
  }

  const downloadSpinner = ora('Downloading project from github').start();
  try {
    await downloadRepo(projectPath);
    downloadSpinner.succeed();
  } catch (err) {
    downloadSpinner.fail(err.toString());
  }
  
  try {
    child_process.execSync(`yarn install --modules-folder ./${project}`, {stdio: 'inherit'});
  } catch (err) {
    child_process.execSync(`npm install --prefix ./${project}`, {stdio: 'inherit'});
  }

  // edit package.json file
  const packageJson = require(packageJsonPath);
  const modifiedJson = Object.assign({}, packageJson, {
    author: '',
    repository: '',
    name: project
  });
  const formattedJson = prettier.format(JSON.stringify(modifiedJson), {parser: 'json'});
  fs.writeFileSync(packageJsonPath, formattedJson, {
    encoding: 'utf8'
  });
}