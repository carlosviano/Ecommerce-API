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

const usuarioUno = {
    email: "carlitosviano@gmail.com",
    password: "12345"
};

const usuarioDos = {
    email: "nachoviano@gmail.com",
    password: "holahola123"
}

const usuarios = [usuarioUno,usuarioDos];

app.use(cors());
app.use(express.json());

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
        descripcion: "kfewpfwmfpwodw`pdpkdnqidjqbdkdLDkdñqoifj"
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

for(const p of productos){
    if(productoId == p.id){
        response.send(p)
    }
}
});

app.post("/login", function(request, response){
    const email = request.body.email;
    const password = request.body.password;

    console.log(email,password);

    for(const u of usuarios){
        if(email === u.email && password === u.password){
            response.status(200).send();
        }
    }

    response.status(401).send();

})

app.listen(8000, function(){
    console.log("API lista para recibir llamadas")
})