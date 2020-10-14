const util = require('util')
const exec = util.promisify(require('child_process').exec)
const axios = require('axios')
const { webhookURL } = require('./config')

class IPChecker {
  constructor () {
    this.ipAddress = null
  }
  
  async getIPAddress () {
    const { stdout: ipAddress } = await exec('curl -s httpbin.org/ip | jq .origin')
    return ipAddress.trim().replace(/"/g, '')
  }

  async sendAlert (ipAddress) {
    let message
    if (!this.ipAddress) {
      message = `Initialized IPChecker.\nCurrent IP address is \`${ipAddress}\`.`
    } else {
      message = `IP address changes detected.\nNew IP address is \`${ipAddress}\`.\n(Old address is ${this.ipAddress}.)`
    }

    await axios.post(webhookURL, { text: message })
  }

  async run () {
    const ipAddress = await this.getIPAddress()
    if (this.ipAddress === ipAddress) return

    await this.sendAlert(ipAddress)
    this.ipAddress = ipAddress
  }
}

module.exports = IPChecker

