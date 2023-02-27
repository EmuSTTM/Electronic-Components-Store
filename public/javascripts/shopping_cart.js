
const contenedorCarrito = document.getElementById("cart-container")
const productos = document.getElementsByClassName("product-cart")


let carrito = [];

const contadorCarrito = document.getElementById('cart-count')

console.log("este es el cart-container:  " + contenedorCarrito )
console.log(contenedorCarrito)

console.log("puso al final todo jejeejejejejej")
console.log(productos)
console.log(productos.length)
// console.log(productos[0].value)
console.log(typeof productos)


// 3 PASO: Agregar al carrito
agregarAlCarrito = (product) =>{
    console.log("se ejecuto el agregar carrito! wowowowwowWOWOWOWWOWO")
    // Agregamos una validacion primero, para corroborar que si el carrito está
    // aumente la cantidad, en vez de agregar un nuevo recuadro del producto

            // .some() Comprueba si al menos un eleemento del Array cumple con la condicion    
           //implementada por la función proporcionada. Devuelve true o false;
        
    const existe = carrito.some(prod => prod.id === product.id);

    if(existe){
        const prod = carrito.map(prod => { 
            // Creamos un nuevo arreglo e iteramos sobre cada
            // curso y cuando map encuentre el igual al que está agregando, le suma 1 a
            // la cantidad
            if(prod.id === product.id){
                prod.cantidad++
            }
        })
    } else {
        product.cantidad = 1;
        carrito.push(product)
    }

    contadorCarrito.innerText = carrito.length
    localStorage.setItem('carrito',JSON.stringify(carrito))
    if (window.location.href.includes("/cart")) {
        actualizarCarrito()
        }
//     // Ahora actualizamos el numero del contador del carrito, arriba a la derecha en el header
    

    
    
}


if(productos.length != 0){
    for (let i = 0; i < productos.length; i++) {
        productos[i].addEventListener('click', function() {
          console.log("se ejecutò el addEvenetListener!!! OWOWWOWOWOWOWO")
          
          
          let product = JSON.parse(productos[i].value)
          product.cantidad = 1;
          agregarAlCarrito(product)
          console.log(carrito)
          console.log(product)
        });
      }
}




  const actualizarCarrito = () =>{
    console.log("se ejecuto el actualizar ")
    contenedorCarrito.innerHTML = "";

   // Tambien recordemos que estas funciones del carrito debemos añadirlo al modal,
   // el modal estará relacionado con los botones ya existentes en el DOM, referentes al carrito

   // Cargamos el estilo que va a tener cada elemento del carrito en el carrito 
   carrito.forEach(prod => {
       const div = document.createElement("DIV");
       div.classList.add("row", "producto-en-carrito", "w-100");

        let priceOfProduct = prod.price * prod.cantidad
  div.innerHTML = `
                <div class="col-2">
                    <img src="/images/${prod.image}" class="img-fluid" style="max-height: 100px; padding: 5px;">
                </div>

                <div class="col-5">
                    <p>${prod.name}</p>
                </div>

                <div class="col-3" >
                        <div class="input-group mb-3" style="border:1px solid #dfdfdf; border-radius: 3px; ">
                            <div class="input-group-prepend">
                                <button id="minus-btn-${prod.id}"class="btn btn-outline-secondary minus-btn"  type="button">-</button>
                            </div>
                            <span class="form-control quantity-text">${prod.cantidad}</span>
                            <div class="input-group-append">
                            
                                <button id="plus-btn-${prod.id}" class="btn btn-outline-secondary plus-btn"  type="button">+</button>
                            </div>
                        </div>
                </div>
                
                <div class="col-2">
                <p style="color:#4675b9">$ ${priceOfProduct.toLocaleString()}</p>
                </div>
            `;
            // agregarAlCarrito(${JSON.stringify(prod)})
       contenedorCarrito.appendChild(div)

       let plusButton = document.getElementById(`plus-btn-${prod.id}`);
       plusButton.addEventListener('click', () =>{
        agregarAlCarrito(prod)
       })

       let minusButton = document.getElementById(`minus-btn-${prod.id}`);
       minusButton.addEventListener('click', () =>{
        eliminarDelCarrito(prod.id)
       });
        
       

       // Esto guarda el carrito en el almacenamiento local para que no se pierda
       
       
   })
   localStorage.setItem('carrito',JSON.stringify(carrito))
   // Ahora actualizamos el numero del contador del carrito, arriba a la derecha en el header
   contadorCarrito.innerText = carrito.length
   

   // Agregamos el precio total del carrito
   // precioTotal.innerText = carrito.reduce((acumulado, prod) => acumulado + prod.cantidad * prod.price, 0)
   // .reduce() Ejecuta una función reductora a todos los elementos del array,
   // devolviendo un único valor. Esto sirve para int principalmente. El 0 es el valor del que parte la suma.

   // Aqui hacemos que cada vez que se actualice el carrito, su precio también
   
}


// Esto es para que el carrito pueda acceder a la información del LocalStorage
document.addEventListener('DOMContentLoaded', () => {
    console.log('se ejecuto el DOMContentLoaded')
    if (localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        contadorCarrito.innerText = carrito.length
    }

    if (window.location.href.includes("/cart")) {
        actualizarCarrito()
    }
})



// // Esto lo ponemos al inicio porque es sólo un addEvenetListener de algo que ya existia en el DOM
// const botonVaciar = document.getElementById("vaciar-carrito")
// botonVaciar.addEventListener("click", ()=>{
//     carrito.length = 0;
//     actualizarCarrito()
// })









// 5 PASO : Eliminar del carrito. Esto se podría mejorar con el mismo if else que existe en agregar carrito.
const eliminarDelCarrito = prodId =>{

    console.log(carrito)
    console.log(carrito.length)
    const item = carrito.find(prod => prod.id === prodId)
    console.log(item)
    if(item.cantidad == 1){

        const indice = carrito.indexOf(item) //Buscamos el index del item en carrito
        //Splice elimina desde ese indice hasta uno más adelante
        carrito.splice(indice, 1) 

    } else {
            const prod = carrito.map(prod => { 
            // Creamos un nuevo arreglo e iteramos sobre cada
            // curso y cuando map encuentre el igual al que está agregando, le suma 1 a
            // la cantidad
            if(prod.id === prodId){
                prod.cantidad--
            }
        })
    }
    // Tenemos que llamar a esta funcion siempre que se modifica el carrito
    actualizarCarrito()


}
