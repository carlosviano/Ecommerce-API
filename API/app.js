let express = require("express");
let cors = require("cors");
let app = express();

const productoUno = {
    id: 1,
    nombre: "Bananas",
    stock: 120,
    precio: 10.9,
};
const productoDos = {
    id:2,
    nombre: "Manzana",
    stock: 80,
    precio: 10.8,
};
const productos = [productoUno,productoDos];

app.use(cors());

app.get("/", function(request, response){
    response.send("Bienvenido a mi Ecommerce")
});
app.get("/productosdestacados", function(request,response){

    response.send(productos)
});

app.get("/detalleProducto", function(request,response){
    const detalleUno = {
        id:1,
        nombre: "Bananas",
        stock: 120,
        descripcion: "kfewpfwmfpwodw`pdpkdnqidjqbdkdLDkdñqoifj´`"
    };
    const detalleDos = {
        id:2,
        nombre: "Manzana",
        stock: 13,
        descripcion: "akdnqojdnwmwmfekfnejfnenm"
    };
    const detalles = [detalleUno, detalleDos];
    response.send(detalles)
});

app.get("/producto/:id", function(request, response){
const productoId = request.params.id

for(p of productos){
    if(productoId == p.id){
        response.send(p)
    }
}

});

app.listen(8000, function(){
    console.log("API lista para recibir llamadas")
})