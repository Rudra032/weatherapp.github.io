const fs = require("fs");
const requests = require("requests");
const http = require("http");
const PORT = process.env.PORT || 3000;
const homeFile = fs.readFileSync("index.html", "utf8");

const replaceVal = (tempVal, orgval) => {
  let temperature = tempVal.replace("{%tempval%}", orgval.main.temp);
  temperature = temperature.replace("{%tempMin%}", orgval.main.temp_min);
  temperature = temperature.replace("{%tempMax%}", orgval.main.temp_max);
  temperature = temperature.replace("{%location%}", orgval.sys.country);
  temperature = temperature.replace("{%country%}", orgval.name);
  temperature = temperature.replace("{%tempstatus%}", orgval.weather[0].main);
  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=Indore,%20In&appid=71ebe78f2799bc0281f331180405a099&units=metric"
    )
      .on("data", (chunk) => {
        const objData = JSON.parse(chunk);
        const arrData = [objData];
        // console.log(arrData[0].main.temp);
        const realtimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realtimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("listening on server");
});
