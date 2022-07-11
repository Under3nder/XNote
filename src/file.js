class File {
  constructor(filePath=null, content='') {
    this.content = content;
    this.filePath = filePath;
    this.modified = false;
  }
}

try {
  exports.File = File;
} catch (e) {
  // do nothing
}
