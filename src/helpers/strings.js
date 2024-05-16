function parseSlashes(dirName) {
  if (dirName.startsWith("/")) {
    dirName = dirName.substring(1, dirName.length);
  }

  if (dirName.endsWith("/")) {
    dirName = dirName.substring(0, dirName.length-1);
  }

  return dirName;
}

module.exports = {parseSlashes}