const IPChecker = require('./IPChecker')
const { webhookURL, interval } = require('./config')

function sleep (sec) {
  return new Promise(r => setTimeout(r, sec * 1000))
}

async function main () {
  const ipChecker = new IPChecker(webhookURL)

  while (true) {
    try {
      await ipChecker.run()
    } catch (e) {
      console.log(e)
    } finally {
      await sleep(interval)
    }
  }
}

main().then(() => process.exit(0))