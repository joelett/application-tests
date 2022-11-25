let sql = require("mssql")

const connectconfig = {
    user: "usb6368",
    password: "6368",
    server: 'usbsrv17.usb-bochum.de',
    database: 'AIS_USB_Bochum_Test',
    connectionTimeout: 1000,
    options: {
      encrypt: true,
      trustServerCertificate: true
    }
};

function runQuery(query,inputs=[]) {
    return sql.connect(connectconfig).then((pool) => {
      let req = pool.request()
      console.log(inputs)
      for(let key in inputs){
        console.log(key+" "+inputs[key])
        req.input(key,inputs[key])
      }
      return req.query(query)
    })
}

module.exports={runQuery}