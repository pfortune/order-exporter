const Client = require("ftp");

var c = new Client();

const list = () => {
  c.on("ready", function() {
    c.list(function(err, list) {
      if (err) throw err;
      console.dir(list);
      c.end();
    });
  });
};

const connect = () => {
  c.connect({
    host: process.env.FTPHOST,
    password: process.env.FTPPASS,
    user: process.env.FTPUSER
  });
};

const upload = (file, remote) => {
  console.log("file", file);
  console.log("remote", remote);
  c.on("ready", function() {
    c.put(file, remote, function(err) {
      if (err) throw err;
      c.end();
    });
  });
};

module.exports = {
  list,
  connect,
  upload
};
