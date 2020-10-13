const util = require('util')
const exec = util.promisify(require('child_process').exec)
const axios = require('axios')

class IPChecker {
  constructor (webhookURL) {
    this.webhookURL = webhookURL
    this.ipAddress = null
  }
  
  async getIPAddress () {
    const { stdout: ipAddress } = await exec('curl -s httpbin.org/ip | jq .origin')
    return ipAddress.trim().replace(/"/g, '')
  }

  async sendAlert (ipAddress) {
    let message
    if (!this.ipAddress) {
      message = `Initialized IPChecker.\n Current IP address is \`${ipAddress}\`.`
    } else {
      message = `IP address changes detected.\n New IP address is ${ipAddress}.\n (Old address is ${this.ipAddress}.)`
    }

    await axios.post(this.webhookURL, { text: message })
  }

  async run () {
    const ipAddress = await this.getIPAddress()
    if (this.ipAddress === ipAddress) return

    await this.sendAlert(ipAddress)
    this.ipAddress = ipAddress
  }
}

module.exports = IPChecker

