#!/usr/bin/env node
const ghdownload = require('github-download');
const path = require('path');
const fs = require('fs');
const program = require('commander');

// actions
const newAction = require('./action/new');

program
  .command('new <project>')
  .description('create new neira.js project')
  .action(newAction)

program.parse(process.argv);