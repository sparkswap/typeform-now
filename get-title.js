const getMetadata = require('url-metadata')

async function getTitle (url) {
  const metadata = await getMetadata(url)

  return metadata.title
}

module.exports = getTitle
