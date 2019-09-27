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

module.exports = {
  list,
  connect
};
