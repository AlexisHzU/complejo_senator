import { fileURLToPath } from "url"
import path from 'path'

import {reservaciones} from  "../database/senator_db.js"

export const enviar_html = (req, res) => {
    const file_name = fileURLToPath(import.meta.url)
    const primer_dir = path.dirname(file_name)
    const dirname = path.dirname(primer_dir)
    
    return res.sendFile(dirname + "/public/index.html")
};

export const enviar_reservacion = (req, res) => {
    let restaurante = req.params.restaurante;
    let nombre = req.params.nombre;
    let cantidad = parseInt(req.params.cantidad);
    let hora = req.params.hora;
    //dice la hora de llegada que el user mando
    let llegada = parseInt(hora[0]);
    //la de ida que el user mando si es un 8 da igual lo tomare correctamente
    let ida = parseInt(hora[2] + hora[3]);
    
    //toma un array de las reservaciones osea [ember, larimar, zao, grappa ]
    let reservacion = Object.keys(reservaciones);
    //un array con el orden de los restaurantes y sus maximas cantidades como esta arriba 
    let max_cantidades = [3,3,4,2];
    //cuenta las vueltas del bucle y cuando llega a 5 termina pues no hay mas de 4 restaurantes ni pueden entrar mas de 4 personas
    let contador = 0;
    
    while (contador < 4){
        //el restaurante se verifica a ver si existe   la cantidad se verifica si no supera 3 para ember y asi
        if ((restaurante == reservacion[contador]) && (cantidad <= max_cantidades[contador])){
            //se verifica si el horario es correcto y no sale de los parametros
            if ((llegada < 6) || (ida > 10) || (llegada == ida) || (hora.length > 4)){
                return res.send({value: "hubo un error, el horario no cuadra con nuestros horarios de apertura y cierrre", error: ""});
            }
            //verifica que la hora sea correcta en comparacion con las que ya hay guardadas
            for (let h in reservaciones[restaurante]["hora"]){
                //estas variables obtienen la hora guardada, y verifican la llegada y la ida, una por una
                let verificador_llegada = parseInt(reservaciones[restaurante]["hora"][h][0])
                let verificador_ida = parseInt(reservaciones[restaurante]["hora"][h][2] + reservaciones[restaurante]["hora"][h][3])
                
                //el if verifica si esta bien o no la hora de llegada y de ida, esto busca evitar lo sigt:
                //horario 1: 6-8
                //otro cliente llega a las 7-8 (no cuadra pues a las 7 esta ocupado)
                if ((llegada == verificador_llegada) || (ida == verificador_ida)){
                    return res.send('error la hora que usted esta eligiendo esta ocupada ¡lo sentimos!')
                }
            };
            
            //si todo ha salido bien se manda su recibo de reservacion por asi decirlo /./_/./☝️
            let mensaje = `<h2>la reservacion se ha hecho correctamente: <br>
            a nombre de: ${nombre} <br>
            en el restaurante: ${restaurante} <br>
            cantidad de personas: ${cantidad} <br>
            hora de llegada y de ida: ${hora}pm <br>
            </h2>`;
            //como sabemos que restaurante esta correcto ya lo ponemos directamente y push para mandar data a  arrays
            reservaciones[restaurante]["nombre"].push(nombre);
            reservaciones[restaurante]["cantidad"].push(cantidad);
            reservaciones[restaurante]["hora"].push(hora);
            
            return res.send(mensaje);
        };
    };
};

export const ver_reservaciones = (req, res) =>{
    try{
    const restaurante = req.params.restaurante;
    const hora = req.params.hora;
    
    const reservacion = Object.keys(reservaciones);
    const verificador = parseInt(hora[0]);
    
    let guardado = [];
    let contador = 0;
    
    while (contador < 4){
        let primera_hora = parseInt(reservaciones[restaurante]["hora"][contador]);
        
        if (restaurante == reservacion[contador]){
            if (primera_hora >= verificador){
                guardado.push(reservaciones[restaurante]["nombre"]);
                guardado.push(reservaciones[restaurante]["cantidad"]);
                guardado.push(reservaciones[restaurante]["hora"]);
            };
        };

        contador++
    };
    
    let mensaje = ``;
    let elementos = guardado[0].length;
    contador = 0;
    
    while (contador < elementos){
        mensaje += `<h2>reservaciones ${restaurante} numero ${contador + 1}</h2>`
        mensaje += `<h3>a nombre de:${guardado[0][contador]}</h3>`
        mensaje += `<h3>cantidad de personas: ${guardado[1][contador]}</h3>`
        mensaje += `<h3>horario: ${guardado[2][contador]}pm</h3>`
        
        contador++
    };
    
    return res.send(mensaje)
    } catch (error){
        
        if (TypeError(error)){
            return res.send('<h2>No hay elementos en el restaurante favor volver a /restaurante</h2>')
        }
    };
    
    
    
    
    
};
