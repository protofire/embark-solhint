const fs = require("fs");
const { processStr } = require("solhint");

const ERROR_SEVERITY = 2
const WARN_SEVERITY = 3

class Logger {
  constructor(logger) {
    this.logger = logger
  }

  report({line, column, severity, message, ruleId}, path) {
    const formattedMessage = `${path}:${line}:${column}  ${message}  (${ruleId})`
    if (severity === WARN_SEVERITY) {
      this.warn(formattedMessage)
    } else if (severity === ERROR_SEVERITY) {
      this.error(formattedMessage)
    }
  }

  log(...args) {
    this.logger.log('[Solhint]', ...args)
  }

  info(...args) {
    this.logger.info('[Solhint]', ...args)
  }

  warn(...args) {
    this.logger.warn('[Solhint]', ...args)
  }

  error(...args) {
    this.logger.error('[Solhint]', ...args)
  }
}

module.exports = function(embark) {
  const logger = new Logger(embark.logger)

  let config = {
    extends: 'solhint:recommended'
  }

  if (fs.existsSync('.solhint.json')) {
    config = JSON.parse(fs.readFileSync('.solhint.json').toString())
  }

  embark.events.on("file-change", (fileType, path) => {
    if (fileType !== 'contract') {
      return
    }

    try {
      const content = fs.readFileSync(path).toString();
      const { reports } = processStr(content, config)

      if (reports.length === 0) {
        logger.info('No errors found')
      } else {
        for (const report of reports) {
          logger.report(report, path)
        }
      }
    } catch (e) {
      logger.error(e.message);
    }
  });
};
