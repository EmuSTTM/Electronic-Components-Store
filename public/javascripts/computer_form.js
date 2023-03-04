// Aquí manejamos el agregar los productos
var socketV2,
  socketSata,
  maxRamSlot,
  maxStorageSlot,
  brand,
  motherBrand,
  cpuBrand,
  socketCpu,
  sizeType,
  frecuencyRam,
  ramType;

maxRamSlot = 2;
socketV2 = 1;
socketSata = 4;
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
    if (typeof socketCpu != "undefined" && socketCpu != product.socket) {
      let msgAlert = document.getElementById(`motherboard-alert`);
      msgAlert.innerHTML += `<p class="alert alert-danger">La motherboard 
      no es compatible con el procesador</p>`;
      return;
    }
    motherBrands = product.brand;

    motherBrand = motherBrands
      .filter((obj) => obj.name == "AMD" || obj.name == "Intel")
      .map((obj) => obj.name)
      .join("");

    if (brand != null && brand != motherBrand) {
      let msgAlert = document.getElementById(`motherboard-alert`);
      msgAlert.innerHTML += `<p class="alert alert-danger">
      La marca seleccionada debe ser ser igual para la motherboard</p>`;
      return;
    }
    /*
    Estos apartados de la RAM deberían estar hechos en un array. 
    Ya que al ser una variable, sólo analizará la última RAM añadida. 
    PERO NO TODAS.
    */

    if (
      typeof frecuencyRam != "undefined" &&
      frecuencyRam > product.frecuency_ram
    ) {
      let msgAlert = document.getElementById(`ram-alert`);
      msgAlert.innerHTML = `<p class="alert alert-danger">
      La frecuencia de envío de datos de la RAM es demasiado alta. 
      Es recomendable cambiarla.</p>`;
      return;
    }

    if (typeof ramType != "undefined" && ramType != product.socket_ram) {
      let msgAlert = document.getElementById(`motherboard-alert`);
      msgAlert.innerHTML = `<p class="alert alert-danger">
      El socket de la ram no es compatible con la motherboard</p>`;
      return;
    }
    // Define the motherboard elements, for validation purposes
    socketV2 = product.sockets_v2;
    socketSata = product.sockets_sata;
    maxStorageSlot = socketSata + socketV2;
    maxRamSlot = product.ram_slots;
    socketCpu = product.socket;
    sizeType = product.type;
    frecuencyRam = product.frecuency_ram;
    ramType = product.socket_ram;


    /*
    We access the brand element of the mother, 
    we emphasize those of AMD and Intel, which are the companies 
    that create the chipsets. Then, we pass only the name variable, 
    thus leaving only a string
    */


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
      selectedProduct.classList.remove("selected-product");
      img.src = `/static_images/mother-active.png`;
      selectedProducts = selectedProducts.filter(
        (item) => item !== product._id
      );
      document.getElementById(type).value = "";
    } else if (!selectedProduct.classList.contains("selected-product")) {
      selectedProduct.classList.add("selected-product");

      let cartArray = document.getElementById("cart_array");
      cartProducts[type] = cart_prod;
      cartArray.value = JSON.stringify(cartProducts);

      img.src = selectedProduct.children[0].src;
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
        typeof frecuencyRam != "undefined" &&
        frecuencyRam < product.speed
      ) {
        let msgAlert = document.getElementById(`ram-alert`);
        msgAlert.innerHTML = `<p class="alert alert-danger">
        La frecuencia de envío de datos de esta RAM es demasiado 
        para la mother. Es recomendable cambiarla.</p>`;
        return;
      }

      if (typeof ramType != "undefined" && ramType != product.type) {
        let msgAlert = document.getElementById(`ram-alert`);
        msgAlert.innerHTML = `<p class="alert alert-danger">
        El socket de la ram no es compatible con la motherboard</p>`;
        return;
      }

      frecuencyRam = product.speed;
      ramType = product.type;

      selectedRam.push(product._id);
      let cartArray = document.getElementById("cart_array");
      cartProducts["rams"].push(cart_prod);
      cartArray.value = JSON.stringify(cartProducts);

      let productCount = selectedRam.filter(
        (item) => item === product._id
      ).length;
      let stock = document.getElementById(`stock-${product._id}`);

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
        /*
        Añade a los objetos seleccionados al objeto en cuestion, 
        para que al actualizarseel contenedor, este siga seleccionado.
        */

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

      if (
        product.type == "HDD" ||
        product.type == "SSD" ||
        product.type == "SSHD"
      ) {
        let StorageSATA = selectedStorage.filter(
          (obj) =>
            obj.type === "HDD" || obj.type === "SSD" || obj.type === "SSHD"
        ).length;
        if (StorageSATA >= socketSata) {
          let msgAlert = document.getElementById(`storage-alert`);
          msgAlert.innerHTML = `<p class="alert alert-danger">La cantidad 
          máxima de entradas SATA en la mother son de: ${socketSata}</p>`;
          return;
        }
        selectedStorage.push(product);

        let cartArray = document.getElementById("cart_array");
        cartProducts["storages"].push(cart_prod);
        cartArray.value = JSON.stringify(cartProducts);
      }
      if (product.type == "NVMe") {
        let StorageV2 = selectedStorage.filter((obj) => obj.type === "NVMe");
        if (StorageV2.length >= socketV2) {
          let msgAlert = document.getElementById(`storage-alert`);
          msgAlert.innerHTML = `<p class="alert alert-danger">
          La cantidad máxima de entradas NVME V2 admitidas en la mother 
          son de: ${socketV2}</p>`;
          return;
        }
        let cartArray = document.getElementById("cart_array");
        cartProducts["storages"].push(cart_prod);
        cartArray.value = JSON.stringify(cartProducts);
        selectedStorage.push(product);
      }

      let productCount = selectedStorage.filter(
        (item) => item._id === product._id
      ).length;
      let stock = document.getElementById(`stock-${product._id}`);

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

      let img = document.getElementById(`${type}_img`);

      if (!selectedProduct.classList.contains("selected-product")) {
        selectedProduct.classList.add("selected-product");
        selectedProducts.push(product._id);
      }
      img.src = selectedProduct.children[0].src;

      let resultStorage = selectedStorage.map((obj) => obj._id);
      document.getElementById("storages").value = resultStorage.join(",");

      return;
    } else {
      let msgAlert = document.getElementById(`storage-alert`);
      msgAlert.innerHTML = `<p class="alert alert-danger">
      Limite de almacenamiento alcanzado. SATA:${socketSata}, V2:${socketV2}</p>`;
      return;
    }
  }

  if (type == "brand") {
    let msgAlert = document.getElementById(`brand-alert`);
    msgAlert.innerHTML = ``;
    brand = product.name;

    if (
      (!cpuBrand && !motherBrand) ||
      cpuBrand === brand ||
      motherBrand === brand
    ) {
      let selectedProduct = document.getElementById(product._id);

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
        selectedProduct.classList.remove("selected-brand");
        selectedProducts = selectedProducts.filter(
          (item) => item != product._id
        );
        document.getElementById(type).value = "";
      } else if (!selectedProduct.classList.contains("selected-brand")) {
        selectedProduct.classList.add("selected-brand");

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
    cpuBrand = product.brand;
    cpuBrand = cpuBrand["name"];

    selectProduct(product.brand, "brand");

    if (typeof motherBrand == "undefined") {
      socketCpu = product.socket;
    }

    if (typeof socketCpu != "undefined" && socketCpu != product.socket) {
      let msgAlert = document.getElementById(`cpu-alert`);
      msgAlert.innerHTML = `<p class="alert alert-danger">
      La motherboard no es compatible con el procesador</p>`;
      return;
    }

    if (brand != null && brand != cpuBrand) {
      let msgAlert = document.getElementById(`cpu-alert`);
      msgAlert.innerHTML = `<p class="alert alert-danger">
      La marca seleccionada debe ser ser igual para el cpu</p>`;
      return;
    }
  }

  if (type == "cabinet") {
    if (
      (typeof sizeType != "undefined" &&
        sizeType == "ITX" &&
        product.type != "ITX") ||
      (sizeType == "M-ATX" && product.type != "ATX")
    ) {
      let msgAlert = document.getElementById(`cabinet-alert`);
      msgAlert.innerHTML = `<p class="alert alert-danger">
      El tamaño del gabinete es insuficiente</p>`;
      return;
    }
    sizeType = product.type;
  }

  let cartArray = document.getElementById("cart_array");
  cartProducts[type] = cart_prod;
  cartArray.value = JSON.stringify(cartProducts);

  let selectedProduct = document.getElementById(product._id);
  let currentSelection = document.getElementsByClassName("selected-product");

  // Añade a los objetos seleccionados al objeto en cuestion, para que al actualizarse
  // el contenedor, este siga seleccionado.

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
    selectedProduct.classList.remove("selected-product");
    img.src = `/static_images/${type}-active.png`;
    selectedProducts = selectedProducts.filter((item) => item !== product._id);
    document.getElementById(type).value = "";
  } else if (!selectedProduct.classList.contains("selected-product")) {
    selectedProduct.classList.add("selected-product");

    img.src = selectedProduct.children[0].src;
    selectedProducts.push(product._id);
    document.getElementById(type).value = product._id;
  }
}

function deleteProduct(product, type, event) {
  let selectedProduct = document.getElementById(product);
  let img = document.getElementById(`${type}_img`);

  if (type == "ram") {
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
      selectedProduct.classList.remove("selected-product");
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

    let resultStorage = selectedStorage.map((obj) => obj._id);
    const productCount = resultStorage.filter(
      (item) => item === product
    ).length;
    let stock = document.getElementById(`stock-${product}`);
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
      selectedProduct.classList.remove("selected-product");
      let currentSelection =
        document.getElementsByClassName("selected-product");
      selectedProducts = selectedProducts.filter((item) => item !== product);
      if (currentSelection.length == 0) {
        img.src = `/static_images/${type}-active.png`;
      }
    }

    document.getElementById("storages").value = resultStorage.join(",");
    event.stopPropagation();
    return;
  }

  event.stopPropagation();
}
