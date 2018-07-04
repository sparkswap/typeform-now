#!/usr/bin/env node

const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const { execSync } = require('child_process')
const createDeployment = require('../')

const optionDefinitions = [
  {
    name: 'url',
    type: String,
    defaultOption: true,
    description: 'The typeform URL to deploy, usually of the form https://<yourname>.typeform.com/to/<yourform>',
    typeLabel: '<url>'
  },
  {
    name: 'dev',
    alias: 'd',
    type: Boolean,
    description: 'Deploy the typeform locally using `serve`.'
  },
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Display this usage guide.'
  }
]

const usageSections = [
  {
    header: 'typeform-now',
    content: 'Deploy your typeform to a custom URL using now.sh'
  },
  {
    header: 'Options',
    optionList: optionDefinitions
  },
  {
    header: 'Options for `now` and `serve`',
    content: 'To pass command line options to `now` and `serve`, put them behind a double dash (`--`), as in:' +
             '\ntypeform-now <your-type-form-url> -- --extra-arg'
  },
  {
    content: 'Project home: {underline https://github.com/kinesis-exchange/typeform-now}'
  }
]

async function deploy () {
  const options = commandLineArgs(optionDefinitions, { stopAtFirstUnknown: true })

  if (options.help || !options.url) {
    console.log(commandLineUsage(usageSections))
    process.exit()
  }

  const path = await createDeployment(options.url)
  const extraArgs = options._unknown || []
  let passThroughArgs = ''

  if (extraArgs.length && extraArgs[0] === '--') {
    passThroughArgs = extraArgs.slice(1).join(' ')
  }

  if (options.dev) {
    execSync(`../../node_modules/.bin/serve ${passThroughArgs}`, { stdio: 'inherit', cwd: path })
  } else {
    execSync(`../../node_modules/.bin/now ${passThroughArgs}`, { stdio: 'inherit', cwd: path })
  }
}

deploy()
