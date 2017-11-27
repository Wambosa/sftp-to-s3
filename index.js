const Client = require('ssh2-sftp-client');
const configTool = require('./lib/configTool');
const uploadToS3 = require('./lib/uploadToS3');
const retrieveFileStreams = require('./lib/retrieveFileStreams');



module.exports = {

  batch: function(config) {
    const sftp = new Client();
    config = configTool.fix(config);
    const logger = config.logger;

    let check = configTool.check(config);

    if (!check.ok) {
      logger.error(check.errors);
      return process.exit(1);
    }

    return new Promise( (resolve, reject) => {

      logger.info(`connecting to sftp ${config.sftp.username}@${config.sftp.host}:${config.sftp.port}`);

      return sftp.connect(config.sftp)

        .then(() => {
          logger.info(`sftp.list files found in ${config.fileDownloadDir}`);
          return sftp.list(config.fileDownloadDir);
        })

        .then((fileList) => {
          const earliestTimestamp = config.earliestTime.getTime();
          const withinTimeRange = (fileObj) => fileObj.modifyTime > earliestTimestamp;
          const relevantFiles = fileList.filter(withinTimeRange);
          const totalSize = relevantFiles.map(x=>x.size).reduce( (a,b) => a+b);
          logger.info(`retrieve readStreams for ${relevantFiles.length} files of size ${totalSize} modified after epoch ${earliestTimestamp}`);
          logger.trace(fileList);
          return retrieveFileStreams(
            sftp,
            config,
            relevantFiles,
            "sftp"
          );
        })

        .then((streams) => {
          logger.info(`prepare upload of ${streams.length} readStreams`);
          logger.trace(streams);
          return uploadToS3.putBatch(config, streams);
        })

        .then((resolutions) => {
          logger.trace(resolutions);
          sftp.end();
          return resolve(`${resolutions.length} completed uploads to ${config.aws.bucket}`);
        })

        .catch( function(err) {
          logger.error(err);
          sftp.end();
          return reject(err);
        });
    });
  }
};