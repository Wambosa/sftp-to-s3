# sftp-to-s3

#### example

```javascript
const SftpToS3 = require('sftp-to-s3');
const config = {
  sftp: {
    host: process.env.hostname,
    username: process.env.user, 
    password: process.env.password,
    port: 6522,
    privateKey: fs.readFileSync(process.env['HOME'] + '/.ssh/first_data_key')
  },
  aws: {
    bucket: "bucket_name", accessKeyId: 'AKID', secretAccessKey: 'SECRET', region: 'us-west-2'
  },
  fileDownloadDir: "/",
  earliestTimestamp: new Date()
};

SftpToS3.batch(config)
  .then((successArray) => {
    console.log(successArray)
  })
  .catch((err) => {
    console.error(err)
  })
```

#### Gotchas

make sure `fileDownloadDir` is an absolute paths.  
Do not use a path such as `./myFolder`, becasue then a file will not be found...derp  
Additionally make sure the path ends with an `/` symbol, or else the error you get may be a permission denied or file does not exist.

if you have your aws set up properly with the `.aws` folder in home directory, you **will not** need to provide `secretAccessKey` or `region`, only `bucket` will need to be in the config.


[for complete aws s3 config options go here](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property "AWS S3 Config Doc")

[for complete sftp config options go here](https://github.com/jyu213/ssh2-sftp-client)
