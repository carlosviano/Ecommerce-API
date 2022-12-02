let express = require("express");
let cors = require("cors");
let mysql = require("mysql");
const {MongoClient} = require("mongodb");
let app = express();

/**
 * MySQL
 */

let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"12345",
    database: "ecommerce"
});

function conectar(){
    connection.connect(function(error){
        if (error){
            console.log(`No es posible conectarse al servidor:  ${error}`)
    
            return;
        }
        console.log("Conectado a MySQL")
    });
}
conectar();

function ejecutarQuery(query,params,callback){
    connection.query(query,params,function(error,results,fields){
        if(error){
            console.log(`Se ha producido un error al mostrar la query ${error}`);
            return;
        }
        callback(results)
    });

}

/** 
 * MONGODB
*/

const mongoClient = new MongoClient("mongodb://localhost:27017");
function ejecutarQueryMongoDB(collection,filtro,orden,callbackPorDocumento,callback,error){
    mongoClient.db("ecommerce")
    .collection(collection)
    .find(filtro)
    .sort(orden)
    .forEach(callbackPorDocumento)
    .then(callback)
    .catch(error);
}

/**
 * Servicios API
 */
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
    const email= request.body.email;
    const password = request.body.password;

    console.log(email,password);

    for(const u of usuarios){
        if(email === u.email && password === u.password){
            response.status(200).send();
        }
    }

    response.status(401).send();

})

app.get("/productoBaseDatos",function(request,response){
    connection.query('Select * from usuario',[],function(error,results,fields){
        if (error){ 
            console.log(`Se ha producido un error al mostrar la query: ${error}`);
            return;
        }
        console.log(results)
        response.send(results)
    })
    
});

app.post("/loginBBDD",function(request,response){ //login comparando el usuario y contraseña con los datos en la bbdd
    const email= request.body.email;
    const password = request.body.password;
    connection.query('Select * from usuario where email = ? && password = ?',[email,password],function(error,results,fields){
        if(error){
            console.log(`Se ha producido un error al mostrar la query ${error}`);
            return;
        } if (results.length > 0){ 
            response.status(200).send();
        }
        console.log(results);
        response.status(401).send();
    });
})

app.post("/registroBBDD", function(request,response){ 
    const usuarioRegistro = request.body.usuarioRegistro;
    const emailRegistro = request.body.emailRegistro;
    const passwordRegistro = request.body.passwordRegistro;
    const nombreRegistro = request.body.nombreRegistro;
    const apellidoRegistro = request.body.apellidoRegistro;
    connection.query(`Insert into usuario (usuario,email,password,nombre,apellidos) VALUES (?,?,?,?,?)`,[usuarioRegistro,emailRegistro,passwordRegistro,nombreRegistro,apellidoRegistro],function(error,results,fields){
        if(error){
            console.log(`Se ha producido un error al mostrar la query: ${error}`);
            response.status(401).send();
        } 
       response.send(results)
       console.log(results)
    })

})

app.post("/finalizarPedido", function(request,response){ 
  const total = request.body.t;
  const productos = request.body.p; 
  const tarjeta = request.body.tar;

    console.log(productos)
 
        connection.query(`Insert into pedido (usuario,total,fecha,cupon,tarjeta,direccion,estado,envio,tipopago) VALUES (?,?,?,?,?,?,?,?,?)`,["1",total,"2022-11-28","1","7","1","pagado","5","Tarjeta"],function(error,results,fields){ 
        if(error){
            console.log(`Se ha producido un error al mostrar la query: ${error}`);
            response.status(400).send();
        }
        console.log(results)
        let numeroPedido = results.insertId
       for(const p of productos){
        connection.query(`Insert into pedidodetalle (pedido,producto,cantidad,precio,cupon,opinion) VALUES (?,?,?,?,?,?)`,[numeroPedido,p.id,1,p.precio,"1","1"],function(error,results,fields){
            if(error){
                console.log(`Se ha producido un error al mostrar la query: ${error}`);
                response.status(400).send();
            }
        })
       }
        response.send(results);
        console.log(results)
    });

});

/**
 * Llamadas API MongoDB
 */

 app.get("/productos",function(request,response){
    let productos = []
    ejecutarQueryMongoDB("Productos",{},{id: -1},
    (producto)=> productos.push(
        {id:producto._id,
        nombre:producto.nombre,
        categoria:producto.categoria,
        stock:producto.stock,
        precio: producto.precio,
        img: producto.img    
    }), 
    ()=> response.send(productos), 
    () => response.status(400));
});

app.get("/pedidos",function(request,response){ 
    let pedidos = [];
    ejecutarQueryMongoDB("Pedidos",{},{"_id": 1},
    (pedido)=> pedidos.push(
        {id:pedido._id,
        usuario:pedido.usuario,
        productos:pedido.productos,
        total:pedido.total,
        direccion:pedido.direccion,
        estado:pedido.estado
    }),
    () => response.send(pedidos),
    ()=> response.status(400));
});

app.get("/productosDestacadosMongoDB",function(request,response){
    let productosDestacados = []
    ejecutarQueryMongoDB("Productos",{},{},
    (producto)=> productosDestacados.push(
        {id:producto._id,
            nombre:producto.nombre,
            categoria:producto.categoria,
            stock:producto.stock,
            precio: producto.precio,
            img: producto.img
        }),
        ()=> response.send(productosDestacados),
        () => response.status(400));
})

app.post("/loginMongoDB",function(request,response){
    let usuarios = [];
    ejecutarQueryMongoDB("Usuario",{email: request.body.email, password: request.body.password},{},
    (usuario)=> usuarios.push({email: usuario.email, password: usuario.password}),
    ()=> {
    if(usuarios.length > 0){
        response.send(usuarios)
    }
    response.status(401).send()},
    ()=> response.status(400));
})


mongoClient.connect().then(function(){
    console.log("Conectado a MongoDB")

    // mongoClient.db("ecommerce")  //Esto y ejecutarQueryMongoDB es exactamente lo mismo pero refactprizado
    // .collection("Usuario")
    // .find({})
    // .sort({})
    // .forEach((usuario) => console.log(usuario))
    // .then(() => console.log("Ok"))
    // .catch(() => console.log("Error"));

    // ejecutarQueryMongoDB("Usuario",{},{},
    // (usuario)=> console.log(usuario), 
    // ()=> console.log("ok!"), 
    // () => console.log("Error"))
    
    app.listen(8000, function(){
    console.log("API lista para recibir llamadas")
});
}).catch(function(){
    console.log("Error: no se puede conectar a MongoDB");
});

