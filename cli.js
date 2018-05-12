#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const run = require('./index');

__dirname = process.cwd();

// Grab provided args
const [,,...args] = process.argv;

// Parse args
const config = args.reduce( (result, argument, i) => {
  if( args[i-1] && (args[i-1][0] === "-") ) {
    return result;
  }
  if(argument === '-n') {
    argument = args[++i];
    if(!isNaN(parseInt(argument)) && isFinite(argument)) {
      result.numberOfProcesses = parseInt(argument);
    } else {
      console.error('Number of processes is incorrect!');
    }
  } else if(argument === '-h') {
    argument = args[++i];
    result.hosts = JSON.parse(fs.readFileSync( __dirname + path.sep + argument, 'utf8'));
  } else {
    if(!parseInt(argument)) {
      result.filename = argument;
    }
  }
  return result;
}, { filename: '', numberOfProcesses: 0, hosts: '' } )

// Run script
run(config);