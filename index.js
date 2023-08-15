function mostrarLista(arreglo) {
  if(Array.isArray(arreglo)) {
  if (!arreglo.length) {
      console.log('Lista vacia')
  }else{
      arreglo.forEach((elem)=>console.log(elem))
      console.log('la longitud es de: ${arreglo.length}')
  }
}else{
      console.log('No es un arreglo');
  }}

mostrarLista([5,4])

//clases


class Product {
  constructor(code, name, price, description, thumbnail, stock) {
    this.code = code;
    this.name = name;
    this.price = price;
    this.description = description;
    this.thumbnail = thumbnail;
    this.stock = stock
  }
}



  addProduct(code, name, price, description, thumbnail, stock) ;{
    if (!code || !name || !price ||!description ||!thumbnail ||!stock ) {
      console.log("Error: Todos los campos son obligatorios.");
      return;
    }

    
    for (const product of this.products) {
      if (product.code === code) {
        console.log(`Error: El código '${code}' ya existe.`);
        return;
      }
    }

    
    const product = new Product(code, name, price, description, thumbnail, stock );
    product.id = this.nextId;
    this.nextId++;

   
    this.products.push(product);
  }

  getProducts(); {
    return this.products;
  }

  getProductById(id); {
    for (const product of this.products) {
      if (product.id === id) {
        return product;
      }
    }

    
    console.log("Error: Producto no encontrado.");
  }


const manager = new ProductManager();

// Agregar productos
manager.addProduct("P001", "Texanas Feyre", 6990,'texanas cana media',img/venta/texanas/feyre_choco.jpeg, 10);
manager.addProduct("P002", "Texanas Ela", 5500, 'texana cana baja', img/venta/texanas/tex_ela_blanca.jpeg, 5);
manager.addProduct("P003", "Texanas Serena", 6990,'texana cana media', img/venta/texanas/tex_serena_camel.jpeg,8);

// Obtener todos los productos
const products = manager.getProducts();
for (const product of products) {
console.log(`ID: ${product.id}, Código: ${product.code}, Nombre: ${product.name}, Precio: ${product.price}, Descripcion: ${product.description}, Imagen: ${product.thumbnail}, Stock: ${product.stock}`);
}

// Buscar un producto por ID
const foundProduct = manager.getProductById(2);
if (foundProduct) {
console.log(`Producto encontrado: ${foundProduct.name}`);
}
  