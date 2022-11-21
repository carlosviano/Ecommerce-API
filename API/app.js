let express = require("express");
let cors = require("cors");
let app = express();

app.use(cors());

app.get("/", function(request, response){
    response.send("Bienvenido a mi Ecommerce")
});
app.get("/productosdestacados", function(request,response){
    const productoUno = {
        nombre: "Bananas",
        stock: 120,
        precio: 10.9,
    };
    const productoDos = {
        nombre: "Manzana",
        stock: 80,
        precio: 10.8,
    };
    const productos = [productoUno,productoDos];
    response.send(productos)
});

app.listen(8000, function(){
    console.log("API lista para recibir llamadas")
})