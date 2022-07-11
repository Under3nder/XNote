class File {
  constructor(filePath=null, content='') {
    this.content = content;
    this.filePath = filePath;
    this.modified = false;
  }
}
exports.File = File;
