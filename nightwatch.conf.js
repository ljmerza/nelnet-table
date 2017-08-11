var CLI_ARGS = {
  "webdriver.chrome.driver" : "./chromedriver.exe",
}  
var SELENIUM_CONFIGURATION = {
  start_process: true,
  server_path: './selenium-server-standalone-2.53.1.jar',
  host: '127.0.0.1',
  port: 4444,
  cli_args: CLI_ARGS
};

var CHROME_CONFIGURATION = {
  browserName: 'chrome',
  javascriptEnabled: true,
  acceptSslCerts: true
};

var DEFAULT_CONFIGURATION = {
  launch_url: 'http://localhost',
  selenium_port: 4444,
  selenium_host: 'localhost',
  desiredCapabilities: CHROME_CONFIGURATION,
  globals: {
    waitForConditionTimeout: 15000
  }
};

var ENVIRONMENTS = {
  default: DEFAULT_CONFIGURATION
};

module.exports = {
  src_folders: ['test'],
  selenium: SELENIUM_CONFIGURATION,
  test_settings: ENVIRONMENTS
};