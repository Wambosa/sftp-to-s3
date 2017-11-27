var AWS = require('aws-sdk')
AWS.config.setPromisesDependency(require('bluebird'));

function putBatch(config, streams) {
  let logger  = config.logger;

  logger.debug("create s3 connection");
  let s3 = new AWS.S3(config.aws);
  let s3Stream = require('s3-upload-stream')(s3);

  logger.info(`begin upload of ${streams.length} streams`);

  return Promise.all(streams.map((readStream) => {
    
    return new Promise((resolve, reject) => {
      let upload = s3Stream.upload({
        Bucket: config.aws.bucket,
        Key: readStream.path.replace(config.fileDownloadDir, '')
      });

      upload.on('error', err => reject(err));
      upload.on('uploaded', msg => resolve(msg));
      upload.on('part', detail => logger.trace(detail));
      readStream.pipe(upload);
    });
  }));
}

module.exports = {
  putBatch: putBatch
}
