const path = require('path');

module.exports = {
  check: function(config) {

    let errors = [];

    if (config.aws === undefined)
      errors.push("aws key is require for config");

    if (config.aws.bucket === undefined)
      errors.push("aws bucket is require in aws key");

    if (path.isAbsolute(config.fileDownloadDir) === false)
      errors.push("fileDownloadDir must be absolute");

    return {ok: !errors.length, errors: errors};
  },

  fix: function(config) {
    if (!config.logger)
      config.logger = {
        info: console.log,
        debug: console.log,
        trace: () => {},
        warn: console.warn,
        error: console.error,
        fatal: console.error
      };
    return config;
  }
}