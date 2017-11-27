function retrieveBinaryFileStreams (sftp, folder, files) {
  return Promise.all(files.map((file) => {
    return sftp.get(folder + file.name, false, null);
  }));
}

module.exports = retrieveBinaryFileStreams;