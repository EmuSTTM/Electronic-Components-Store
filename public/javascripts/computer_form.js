// Aquí manejamos el agregar los productos
var socket_v2,
  socket_sata,
  maxRamSlot,
  maxStorageSlot,
  brand,
  motherboard_brand,
  cpu_brand,
  socket_cpu,
  size_type,
  frecuency_ram,
  ram_type;

maxRamSlot = 2;
socket_v2 = 1;
socket_sata = 4;
maxStorageSlot = 5;

let cartProducts = {
  cpu: undefined,
  motherbord: undefined,
  gpu: "",
  powerSupply: undefined,
  cabinet: undefined,
  storages: [],
  rams: [],
};

function selectProduct(product, type, cart_prod) {
  if (type == "motherboard") {
    let msgAlert = document.getElementById(`motherboard-alert`);
    msgAlert.innerHTML = ``;
    if (product.ram_slots < selectedRam.length) {
      let msgAlert = document.getElementById(`motherboard-alert`);
      msgAlert.innerHTML += `<p class="alert alert-danger">Insuficientes 
      ram slots. Seleccionaste más de 2 rams</p>`;
      return;
    }
    if (typeof socket_cpu != "undefined" && socket_cpu != product.socket) {
      let msgAlert = document.getElementById(`motherboard-alert`);
      msgAlert.innerHTML += `<p class="alert alert-danger">La motherboard 
      no es compatible con el procesador</p>`;
      return;
    }
    motherboard_brands = product.brand;

    motherboard_brand = motherboard_brands
      .filter((obj) => obj.name == "AMD" || obj.name == "Intel")
      .map((obj) => obj.name)
      .join("");

    if (brand != null && brand != motherboard_brand) {
      let msgAlert = document.getElementById(`motherboard-alert`);
      msgAlert.innerHTML += `<p class="alert alert-danger">
      La marca seleccionada debe ser ser igual para la motherboard</p>`;
      return;
    }

    console.log("este es el socket cpu" + socket_cpu);
    console.log("este es el socket mother" + product.socket);

    // Estos apartados de la RAM deberían estar hechos en un array. Ya que al ser una variable, sólo
    // analizará la última RAM añadida. PERO NO TODAS.
    if (
      typeof frecuency_ram != "undefined" &&
      frecuency_ram > product.frecuency_ram
    ) {
      let msgAlert = document.getElementById(`ram-alert`);
      msgAlert.innerHTML = `<p class="alert alert-danger">
      La frecuencia de envío de datos de la RAM es demasiado alta. 
      Es recomendable cambiarla.</p>`;
      return;
    }

    if (typeof ram_type != "undefined" && ram_type != product.socket_ram) {
      let msgAlert = document.getElementById(`motherboard-alert`);
      msgAlert.innerHTML = `<p class="alert alert-danger">
      El socket de la ram no es compatible con la motherboard</p>`;
      return;
    }
    socket_v2 = product.sockets_v2;
    socket_sata = product.sockets_sata;
    maxStorageSlot = socket_sata + socket_v2;
    console.log(maxStorageSlot);
    maxRamSlot = product.ram_slots;
    socket_cpu = product.socket;
    size_type = product.type;
    frecuency_ram = product.frecuency_ram;
    ram_type = product.socket_ram;
    console.log("este es el ram type: " + ram_type);

    // Accedemos a los brands del mother, hacemos enfasis en los de AMD e Intel, que son las empresas que crean los chipsets
    // Luego, pasamos sólo la variable name, quedando así sólo una string

    console.log("Este es el brand del motherboard : " + motherboard_brand);
    console.log(typeof motherboard_brand);
    console.log(product);

    let img = document.getElementById(`mother_img`);

    let selectedProduct = document.getElementById(product._id);
    let currentSelection = document.getElementsByClassName("selected-product");
    if (currentSelection.length > 0) {
      selectedProducts = selectedProducts.filter(
        (item) => item != currentSelection[0].id
      );
      currentSelection[0].classList.remove("selected-product");
    }

    if (
      selectedProduct.classList.contains("selected-product") ||
      selectedProducts.includes(product._id)
    ) {
      console.log(selectedProduct);
      selectedProduct.classList.remove("selected-product");
      img.src = `/static_images/mother-active.png`;
      selectedProducts = selectedProducts.filter(
        (item) => item !== product._id
      );
      console.log(selectedProducts);
      console.log("se borró la clase ");
      document.getElementById(type).value = "";
    } else if (!selectedProduct.classList.contains("selected-product")) {
      selectedProduct.classList.add("selected-product");

      let cartArray = document.getElementById("cart_array");
      cartProducts[type] = cart_prod;
      cartArray.value = JSON.stringify(cartProducts);

      img.src = selectedProduct.children[0].src;
      console.log("se creo la clase");
      selectedProducts.push(product._id);
      document.getElementById(type).value = product._id;
    }

    return;
  }

  if (type == "ram") {
    if (selectedRam.length < maxRamSlot) {
      let msgAlert = document.getElementById(`ram-alert`);
      msgAlert.innerHTML = ``;

      if (
        typeof frecuency_ram != "undefined" &&
        frecuency_ram < product.speed
      ) {
        let msgAlert = document.getElementById(`ram-alert`);
        msgAlert.innerHTML = `<p class="alert alert-danger">
        La frecuencia de envío de datos de esta RAM es demasiado 
        para la mother. Es recomendable cambiarla.</p>`;
        return;
      }

      if (typeof ram_type != "undefined" && ram_type != product.type) {
        let msgAlert = document.getElementById(`ram-alert`);
        msgAlert.innerHTML = `<p class="alert alert-danger">
        El socket de la ram no es compatible con la motherboard</p>`;
        return;
      }

      frecuency_ram = product.speed;
      ram_type = product.type;
      // if(ram.speed > results.motherboard.frecuency_ram){
      //     compatibilityErrors.push( "RAM speed must be compatible with the motherboard frecuency" );
      //   }

      selectedRam.push(product._id);
      console.log(`RAM seleccionada: ${product._id}`);
      let cartArray = document.getElementById("cart_array");
      cartProducts["rams"].push(cart_prod);
      cartArray.value = JSON.stringify(cartProducts);

      let productCount = selectedRam.filter(
        (item) => item === product._id
      ).length;
      console.log(productCount);
      let stock = document.getElementById(`stock-${product._id}`);
      console.log(stock);

      stock.innerHTML = `
  <div class="input-group mb-3">
  <div class="input-group-prepend">
    <button class="btn btn-outline-secondary minus-btn" 
    onclick="deleteProduct('${product._id}', 'ram', event);" type="button">
    -</button>
  </div>
  <span class="form-control quantity-text">${productCount}</span>
  <div class="input-group-append">
    <button class="btn btn-outline-secondary plus-btn" type="button">+</button>
  </div>
</div>
  `;

      let selectedProduct = document.getElementById(product._id);
      let currentSelection =
        document.getElementsByClassName("selected-product");

      console.log(currentSelection);
      // // Añade a los objetos seleccionados al objeto en cuestion, para que al actualizarse
      // // el contenedor, este siga seleccionado.

      // Si ya hay un producto seleccionado, quitar la clase de resaltado
      if (currentSelection.length > 1) {
        selectedProducts = selectedProducts.filter(
          (item) => item != currentSelection[0].id
        );
        currentSelection[0].classList.remove("selected-product");
      }
      let img = document.getElementById(`${type}_img`);

      if (!selectedProduct.classList.contains("selected-product")) {
        selectedProduct.classList.add("selected-product");
        selectedProducts.push(product._id);
      }
      img.src = selectedProduct.children[0].src;
      console.log("se creo la clase");

      document.getElementById("rams").value = selectedRam;
    } else {
      let countRams = selectedRam.length;
      let msgAlert = document.getElementById(`ram-alert`);
      msgAlert.innerHTML = `<p class="alert alert-danger">La cantidad máxima 
      de RAMs admitidas en la mother es de: ${countRams}</p>`;
    }
    return;
  }

  if (type == "storage") {
    let msgAlert = document.getElementById(`storage-alert`);
    msgAlert.innerHTML = ``;

    if (selectedStorage.length < maxStorageSlot) {
      // Conver the product in a object
      console.log("Storage seleccionado: " + product._id);

      if (
        product.type == "HDD" ||
        product.type == "SSD" ||
        product.type == "SSHD"
      ) {
        let StorageSATA = selectedStorage.filter(
          (obj) =>
            obj.type === "HDD" || obj.type === "SSD" || obj.type === "SSHD"
        ).length;
        if (StorageSATA >= socket_sata) {
          let msgAlert = document.getElementById(`storage-alert`);
          msgAlert.innerHTML = `<p class="alert alert-danger">La cantidad 
          máxima de entradas SATA en la mother son de: ${socket_sata}</p>`;
          return;
        }
        selectedStorage.push(product);

        let cartArray = document.getElementById("cart_array");
        cartProducts["storages"].push(cart_prod);
        cartArray.value = JSON.stringify(cartProducts);
        console.log("SATA añadido correctamente");
        console.log("storagesata: " + StorageSATA);
      }
      if (product.type == "NVMe") {
        let StorageV2 = selectedStorage.filter((obj) => obj.type === "NVMe");
        if (StorageV2.length >= socket_v2) {
          let msgAlert = document.getElementById(`storage-alert`);
          msgAlert.innerHTML = `<p class="alert alert-danger">
          La cantidad máxima de entradas NVME V2 admitidas en la mother 
          son de: ${socket_v2}</p>`;
          return;
        }
        let cartArray = document.getElementById("cart_array");
        cartProducts["storages"].push(cart_prod);
        cartArray.value = JSON.stringify(cartProducts);
        selectedStorage.push(product);
        console.log("storage v2: " + typeof StorageV2);
        console.log("NVMe añadido correctamente");
      }

      let productCount = selectedStorage.filter(
        (item) => item._id === product._id
      ).length;
      console.log(productCount);
      let stock = document.getElementById(`stock-${product._id}`);
      console.log(stock);

      stock.innerHTML = `
    <div class="input-group mb-3">
    <div class="input-group-prepend">
      <button class="btn btn-outline-secondary minus-btn" 
      onclick="deleteProduct('${product._id}', 'storage', event);" 
      type="button">-</button>
    </div>
    <span class="form-control quantity-text">${productCount}</span>
    <div class="input-group-append">
      <button class="btn btn-outline-secondary plus-btn" type="button">+
      </button>
    </div>
  </div>
  `;

      let selectedProduct = document.getElementById(product._id);
      let currentSelection =
        document.getElementsByClassName("selected-product");

      // // Si ya hay un producto seleccionado, quitar la clase de resaltado
      // if (currentSelection.length > 1) {
      //   selectedProducts = selectedProducts.filter(item => item != currentSelection[0].id);
      //   currentSelection[0].classList.remove("selected-product");
      // }
      let img = document.getElementById(`${type}_img`);

      if (!selectedProduct.classList.contains("selected-product")) {
        selectedProduct.classList.add("selected-product");
        selectedProducts.push(product._id);
      }
      img.src = selectedProduct.children[0].src;
      console.log("se creo la clase");

      let resultStorage = selectedStorage.map((obj) => obj._id);
      console.log(`Storages seleccionadas: ${resultStorage}`);
      document.getElementById("storages").value = resultStorage.join(",");

      return;
    } else {
      let msgAlert = document.getElementById(`storage-alert`);
      msgAlert.innerHTML = `<p class="alert alert-danger">
      Limite de almacenamiento alcanzado. SATA:${socket_sata}, V2:${socket_v2}</p>`;
      return;
    }
  }

  if (type == "brand") {
    let msgAlert = document.getElementById(`brand-alert`);
    msgAlert.innerHTML = ``;
    brand = product.name;
    // if(typeof motherboard_brand == "undefined"){
    //   motherboard_brand = brand;
    // }

    console.log("mother_brand: " + motherboard_brand);
    console.log(brand);
    console.log(cpu_brand);
    if (
      (!cpu_brand && !motherboard_brand) ||
      cpu_brand === brand ||
      motherboard_brand === brand
    ) {
      console.log("se ejecuto el select del brand" + product.name);
      let selectedProduct = document.getElementById(product._id);
      console.log("Este es el select Product del brand");

      let currentSelection = document.getElementsByClassName("selected-brand");
      if (currentSelection.length > 0) {
        selectedProducts = selectedProducts.filter(
          (item) => item != currentSelection[0].id
        );
        currentSelection[0].classList.remove("selected-brand");
      }

      if (
        selectedProduct.classList.contains("selected-brand") ||
        selectedProducts.includes(product._id)
      ) {
        console.log(selectedProduct);
        selectedProduct.classList.remove("selected-brand");
        selectedProducts = selectedProducts.filter(
          (item) => item != product._id
        );
        console.log(selectedProducts);
        console.log("se borró la clase ");
        document.getElementById(type).value = "";
      } else if (!selectedProduct.classList.contains("selected-brand")) {
        selectedProduct.classList.add("selected-brand");

        console.log("se creo la clase");
        selectedProducts.push(product._id);
        document.getElementById(type).value = product._id;
      }
    } else {
      let msgAlert = document.getElementById(`brand-alert`);
      msgAlert.innerHTML = `<p class="alert alert-danger">
      La marca debe coincidir con el motherboard y cpu</p>`;
    }

    return;
  }

  if (type == "cpu") {
    let msgAlert = document.getElementById(`cpu-alert`);
    msgAlert.innerHTML = ``;
    cpu_brand = product.brand;
    console.log(cpu_brand);
    cpu_brand = cpu_brand["name"];
    console.log(cpu_brand);

    console.log("ahora se va ejecutar el brand");
    selectProduct(product.brand, "brand");

    if (typeof motherboard_brand == "undefined") {
      socket_cpu = product.socket;
    }

    if (typeof socket_cpu != "undefined" && socket_cpu != product.socket) {
      let msgAlert = document.getElementById(`cpu-alert`);
      msgAlert.innerHTML = `<p class="alert alert-danger">
      La motherboard no es compatible con el procesador</p>`;
      return;
    }

    if (brand != null && brand != cpu_brand) {
      let msgAlert = document.getElementById(`cpu-alert`);
      msgAlert.innerHTML = `<p class="alert alert-danger">
      La marca seleccionada debe ser ser igual para el cpu</p>`;
      return;
    }
  }

  if (type == "cabinet") {
    if (
      (typeof size_type != "undefined" &&
        size_type == "ITX" &&
        product.type != "ITX") ||
      (size_type == "M-ATX" && product.type != "ATX")
    ) {
      let msgAlert = document.getElementById(`cabinet-alert`);
      msgAlert.innerHTML = `<p class="alert alert-danger">
      El tamaño del gabinete es insuficiente</p>`;
      return;
    }
    size_type = product.type;
  }

  let cartArray = document.getElementById("cart_array");
  cartProducts[type] = cart_prod;
  cartArray.value = JSON.stringify(cartProducts);

  let selectedProduct = document.getElementById(product._id);
  console.log("este es el selectProduct: admitidas");
  console.log(selectedProduct);
  let currentSelection = document.getElementsByClassName("selected-product");

  console.log(currentSelection);
  // // Añade a los objetos seleccionados al objeto en cuestion, para que al actualizarse
  // // el contenedor, este siga seleccionado.

  // console.log(selectedProduct)
  // Si ya hay un producto seleccionado, quitar la clase de resaltado
  if (currentSelection.length > 0) {
    selectedProducts = selectedProducts.filter(
      (item) => item != currentSelection[0].id
    );
    currentSelection[0].classList.remove("selected-product");
  }
  let img = document.getElementById(`${type}_img`);

  if (
    selectedProduct.classList.contains("selected-product") ||
    selectedProducts.includes(product._id)
  ) {
    console.log(selectedProduct);
    selectedProduct.classList.remove("selected-product");
    img.src = `/static_images/${type}-active.png`;
    selectedProducts = selectedProducts.filter((item) => item !== product._id);
    console.log(selectedProducts);
    console.log("se borró la clase ");
    document.getElementById(type).value = "";
  } else if (!selectedProduct.classList.contains("selected-product")) {
    selectedProduct.classList.add("selected-product");

    img.src = selectedProduct.children[0].src;
    console.log("se creo la clase");
    selectedProducts.push(product._id);
    document.getElementById(type).value = product._id;
  }

  // console.log(selectedProduct)

  console.log("se ejecutó select product");
}

function deleteProduct(product, type, event) {
  let selectedProduct = document.getElementById(product);
  let img = document.getElementById(`${type}_img`);
  console.log("esta es la imagen" + img.src);

  if (type == "ram") {
    console.log("Selected RAM PRE TODO: " + selectedRam);
    const ramToRemove = selectedRam.indexOf(product);
    selectedRam.splice(ramToRemove, 1);

    let cartArray = document.getElementById("cart_array");
    const index = cartProducts["rams"].findIndex(
      (objeto) => objeto.id === product
    );
    if (index !== -1) {
      cartProducts["rams"].splice(index, 1);
    }
    cartArray.value = JSON.stringify(cartProducts);

    const productCount = selectedRam.filter((item) => item === product).length;
    let stock = document.getElementById(`stock-${product}`);
    console.log("stock: " + stock);
    console.log("product count: " + productCount);
    console.log(typeof productCount);
    if (productCount == 0) {
      stock.innerHTML = ``;
    } else {
      stock.innerHTML = `
      <div class="input-group mb-3">
      <div class="input-group-prepend">
        <button class="btn btn-outline-secondary minus-btn" 
        onclick="deleteProduct('${product}', 'ram', event);" 
        type="button">-</button>
      </div>
      <span class="form-control quantity-text">${productCount}</span>
      <div class="input-group-append">
        <button class="btn btn-outline-secondary plus-btn" type="button">
        +</button>
      </div>
    </div>
      `;
    }

    if (!selectedRam.includes(product) || productCount == 0) {
      console.log("el productiñio es ");
      console.log(selectedProduct);
      selectedProduct.classList.remove("selected-product");
      console.log(selectedProduct);
      let currentSelection =
        document.getElementsByClassName("selected-product");
      selectedProducts = selectedProducts.filter((item) => item !== product);
      if (currentSelection.length == 0) {
        img.src = `/static_images/${type}-active.png`;
      }
    }
    document.getElementById("rams").value = selectedRam;
    event.stopPropagation();
    return;
  }

  if (type == "storage") {
    // let resultStorage = selectedStorage.map(obj => obj._id);
    console.log("Selected STORAGE PRE TODO: " + selectedStorage);
    const storageToRemove = selectedStorage.indexOf(product);
    selectedStorage.splice(storageToRemove, 1);

    let cartArray = document.getElementById("cart_array");
    const index = cartProducts["storages"].findIndex(
      (objeto) => objeto.id === product
    );
    if (index !== -1) {
      cartProducts["storages"].splice(index, 1);
    }
    cartArray.value = JSON.stringify(cartProducts);

    console.log("Selected Storage POST TODO: " + selectedRam);
    let resultStorage = selectedStorage.map((obj) => obj._id);
    const productCount = resultStorage.filter(
      (item) => item === product
    ).length;
    let stock = document.getElementById(`stock-${product}`);
    console.log("stock: " + stock);
    console.log("product count: " + productCount);
    // console.log(typeof productCount)
    if (productCount == 0) {
      stock.innerHTML = ``;
    } else {
      stock.innerHTML = `
        <div class="input-group mb-3">
        <div class="input-group-prepend">
          <button class="btn btn-outline-secondary minus-btn" 
          onclick="deleteProduct('${product}', 'storage', event);" 
          type="button">-</button>
        </div>
        <span class="form-control quantity-text">${productCount}</span>
        <div class="input-group-append">
          <button class="btn btn-outline-secondary plus-btn" type="button">
          +</button>
        </div>
      </div>
        `;
    }
    if (productCount == 0) {
      console.log("el productiñio es ");
      console.log(selectedProduct);
      selectedProduct.classList.remove("selected-product");
      console.log(selectedProduct);
      let currentSelection =
        document.getElementsByClassName("selected-product");
      selectedProducts = selectedProducts.filter((item) => item !== product);
      if (currentSelection.length == 0) {
        img.src = `/static_images/${type}-active.png`;
      }
    }

    // let resultStorage = selectedStorage.map(obj => obj._id);
    console.log(`Storages seleccionadas: ${resultStorage}`);
    document.getElementById("storages").value = resultStorage.join(",");
    event.stopPropagation();
    return;
  }

  console.log("se ejecuto delete");
  event.stopPropagation();
}
