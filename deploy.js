const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const TEMPLATE_PATH = './templates'
const INDEX_TEMPLATE_PATH = './index.html'
const INDEX_TEMPLATE = fs.readFileSync(path.resolve(__dirname, TEMPLATE_PATH, INDEX_TEMPLATE_PATH), 'utf8')
const DEPLOYMENTS_PATH = './deployments'

const skewered = require('skewered')
const getTitle = require('./get-title')

function createDeploymentDir (name) {
  const deploymentsPath = path.resolve(__dirname, DEPLOYMENTS_PATH)
  const deploymentPath = path.resolve(__dirname, DEPLOYMENTS_PATH, name)
  if (!fs.existsSync(deploymentsPath)) {
    fs.mkdirSync(deploymentsPath)
  }

  if (!fs.existsSync(deploymentPath)) {
    fs.mkdirSync(deploymentPath)
  }

  return deploymentPath
}

async function createDeployment (typeformUrl) {
  const title = await getTitle(typeformUrl)
  const name = skewered(title)
  const indexHtml = INDEX_TEMPLATE.replace(/{{title}}/g, title).replace(/{{url}}/g, typeformUrl)

  const deploymentPath = createDeploymentDir(name)

  fs.writeFileSync(path.resolve(deploymentPath, 'index.html'), indexHtml)

  console.log(`Created deployment in ${deploymentPath}`)

  return deploymentPath
}

module.exports = createDeployment
