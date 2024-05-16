function backup() {
  console.log("CREATING A BACKUP!");
  console.log(generateTimestamp());
}

function generateTimestamp(){
  const d = new Date();
  const day = d.getDate();
  const month = 1 + d.getMonth(); //zerobased so we add one to it
  const year = d.getFullYear();
  const hour = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();

  const timestamp = `${year}-${month}-${day}-${hour}-${minutes}-${seconds}`;
  return timestamp;
}

module.exports = {backup}