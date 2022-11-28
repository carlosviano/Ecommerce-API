let express = require("express");
let cors = require("cors");
let mysql = require("mysql");
let app = express();

/**
 * Constantes
 */
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
    password: "holahola"
};

const usuarioDos = {
    email: "nachoviano@gmail.com",
    password: "holahola123"
}

const usuarios = [usuarioUno,usuarioDos];
/**
 * MySQL
 */

let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"12345",
    database: "ecommerce"
});


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
    connection.connect(function(error){
        if (error){
            console.log(`No es posible conectarse al servidor:  ${error}`)
    
            return;
        }
        console.log("Conectado a MySQL")
    });

    connection.query('Select * from usuario',[],function(error,results,fields){
        if (error){ 
            console.log(`Se ha producido un error al mostrar la query: ${error}`);
            return;
        }
        console.log(results)
        response.send(results)
    })
    
    // connection.end(function(error){
    //     if (error){
    //         console.log(`No se ha podido cerrar la conexion: ${error}`);
    //         return;
    //     }
    //     console.log("Conexion con MySQL cerrada");
    // }); 
});

app.post("/loginBBDD",function(request,response){ //login comparando el usuario y contraseña con los datos en la bbdd
    const email= request.body.email;
    const password = request.body.password;
    connection.connect(function(error){
        if (error){
            console.log(`No es posible conectarse al servidor:  ${error}`)
    
            return;
        }
        console.log("Conectado a MySQL")
    });
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
    connection.connect(function(error){
        if(error){
            console.log(`No es posible conectarse al servidor: ${error}`)
            return;
        }
        console.log("Conectado a MySQL")
    });
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
    connection.connect(function(error){ 
        if(error){
            console.log(`No es posible conectarse al servidor: ${error}`)
            return;
        }
        console.log("Conectado a MySQL")
    });
 
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

app.listen(8000, function(){
    console.log("API lista para recibir llamadas")
});

