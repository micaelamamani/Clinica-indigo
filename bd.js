const mysql= require("mysql2"); 
// conexion a mysql
 const db= mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin200804",
    database: "clinica_indigo"
});
db.connect((error) => {
    if (error) {
        console.log("Error conexión MySQL:", error);
    } else {
        console.log("Conectado a MySQL");
    }
});
module.exports= db;