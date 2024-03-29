const contenedorCarrito = document.getElementById("cart-container");
const productos = document.getElementsByClassName("product-cart");

let carrito = [];

const contadoresCarrito = document.querySelectorAll(".cart-count");


agregarAlCarrito = (product) => {
  if (typeof product === "string") {
    product = JSON.parse(product);
  }

  if (
    product.cpu &&
    product.cabinet &&
    product.powerSupply &&
    product.motherboard &&
    Array.isArray(product.rams) && // verificamos si es un array
    product.rams.length !== 0 &&
    Array.isArray(product.storages) && // verificamos si es un array
    product.storages.length !== 0
  ) {
    for (let key in product) {
      if (typeof product[key] === "object" && product[key] !== null) {
        if (Array.isArray(product[key])) {
          // verificamos si es un array
          for (let item of product[key]) {
            // iteramos sobre cada elemento del array
            const existe = carrito.some((prod) => prod.id === item.id);
            if (existe) {
              carrito = carrito.map((prod) => {
                if (prod.id === item.id) {
                  prod.cantidad++;
                }
                return prod;
              });
            } else {
              item.cantidad = 1;
              carrito.push(item);
            }
          }
        } else {
          // si no es un array, asumimos que es un objeto normal
          const existe = carrito.some((prod) => prod.id === product[key].id);
          if (existe) {
            carrito = carrito.map((prod) => {
              if (prod.id === product[key].id) {
                prod.cantidad++;
              }
              return prod;
            });
          } else {
            product[key].cantidad = 1;
            carrito.push(product[key]);
          }
        }
      }
    }
    let armado = {
      name: "Armado de PC",
      id: 00000,
      price: 1500,
      image: "/static_images/armado_new.jpg",
      cantidad: 1,
    };

    let productoEncontrado = carrito.find((item) => item.id === 00000);

    if (productoEncontrado) {
      productoEncontrado.cantidad++;
    } else {
      carrito.push(armado);
    }

    contadoresCarrito.forEach(contador => {
      contador.innerText = carrito.length;
    });
    localStorage.setItem("carrito", JSON.stringify(carrito));
    if (window.location.href.includes("/cart")) {
      actualizarCarrito();
    }
    return;
  }

  const existe = carrito.some((prod) => prod.id === product.id);

  if (existe) {
    const prod = carrito.map((prod) => {
      if (prod.id === product.id) {
        prod.cantidad++;
      }
    });
  } else {
    product.cantidad = 1;
    carrito.push(product);
  }

  contadoresCarrito.forEach(contador => {
    contador.innerText = carrito.length;
  });
  localStorage.setItem("carrito", JSON.stringify(carrito));
  if (window.location.href.includes("/cart")) {
    actualizarCarrito();
  }
};

if (productos.length != 0) {
  for (let i = 0; i < productos.length; i++) {
    productos[i].addEventListener("click", function () {
      let product = JSON.parse(productos[i].value);
      product.cantidad = 1;
      agregarAlCarrito(product);
    });
  }
}

const actualizarCarrito = () => {
  contenedorCarrito.innerHTML = "";

  // Cargamos el estilo que va a tener cada elemento del carrito en el carrito
  carrito.forEach((prod) => {
    const div = document.createElement("DIV");
    div.classList.add("row", "producto-en-carrito", "w-100",);

    let priceOfProduct = prod.price * prod.cantidad;
    if (prod.id == 00000) {
      div.innerHTML = `
                <div class="col-3 image-cart_container">
                    <img src="${
                      prod.image
                    }" class="img-fluid" style="max-height: 100px;">
                </div>

                <div class="col-5 name-cart_container">
                    <p>${prod.name}</p>
                </div>

                <div class="col-3 count-cart_container" >
                        <div class="input-group mb-3" style="border:1px 
                        solid #dfdfdf; border-radius: 3px; ">
                    <div class="input-group-prepend">
                        <button id="minus-btn-${
                          prod.id
                        }"class="btn btn-outline-secondary minus-btn"  
                        type="button">-</button>
                    </div>
                    <span class="form-control quantity-text">${
                      prod.cantidad
                    }</span>
                    <div class="input-group-append">
                    
                        <button class="btn btn-outline-secondary 
                        plus-btn" style="color:red" type="button">+</button>
                    </div>
                    </div>
                </div>
                
                <div class="price-cart_container">
                <p style="color:#4675b9">
                $ ${priceOfProduct.toLocaleString()}</p>
                </div>
        `;
    } else {
      div.innerHTML = `
        <div class="col-2 image-cart_container">
            <img src="${
              prod.image
            }" class="img-fluid" style="max-height: 100%; padding: 5px;">
        </div>

        <div class="col-5 name-cart_container">
            <p>${prod.name}</p>
        </div>

        <div class="col-3 count-cart_container" >
                <div class="input-group mb-3" 
                style="border:1px solid #dfdfdf; border-radius: 3px; ">
                    <div class="input-group-prepend">
                        <button id="minus-btn-${
                          prod.id
                        }"class="btn btn-outline-secondary minus-btn"  
                        type="button">-</button>
                    </div>
                    <span class="form-control quantity-text">${
                      prod.cantidad
                    }</span>
                    <div class="input-group-append">
                    
                        <button id="plus-btn-${
                          prod.id
                        }" class="btn btn-outline-secondary plus-btn"  
                        type="button">+</button>
                    </div>
                </div>
        </div>
        
        <div class="col-2 price-cart_container">
        <p style="color:#4675b9">$ ${priceOfProduct.toLocaleString()}</p>
        </div>
    `;
    }

    // agregarAlCarrito(${JSON.stringify(prod)})
    contenedorCarrito.appendChild(div);

    let plusButton = document.getElementById(`plus-btn-${prod.id}`);
    if (plusButton) {
      plusButton.addEventListener("click", () => {
        agregarAlCarrito(prod);
      });
    }

    let minusButton = document.getElementById(`minus-btn-${prod.id}`);
    minusButton.addEventListener("click", () => {
      eliminarDelCarrito(prod.id);
    });

    // Esto guarda el carrito en el almacenamiento local para que no se pierda
  });
  localStorage.setItem("carrito", JSON.stringify(carrito));
  // Ahora actualizamos el numero del contador del carrito
  contadoresCarrito.forEach(contador => {
    contador.innerText = carrito.length;
  });
};

// Esto es para que el carrito pueda acceder a la información del LocalStorage
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
    contadoresCarrito.forEach(contador => {
      contador.innerText = carrito.length;
    });
  }

  if (window.location.href.includes("/cart")) {
    actualizarCarrito();
  }
});


// Eliminar del carrito. 
const eliminarDelCarrito = (prodId) => {
  const item = carrito.find((prod) => prod.id === prodId);
  if (item.cantidad == 1) {
    const indice = carrito.indexOf(item); 
    // Splice elimina desde ese indice hasta uno más adelante
    carrito.splice(indice, 1);
  } else {
    const prod = carrito.map((prod) => {
      /* 
      Creamos un nuevo arreglo e iteramos sobre cada
      curso y cuando map encuentre el igual al que está agregando, le suma 1 a
      la cantidad
      */
      
      if (prod.id === prodId) {
        prod.cantidad--;
      }
    });
  }
  // Tenemos que llamar a esta funcion siempre que se modifica el carrito.
  actualizarCarrito();
};
