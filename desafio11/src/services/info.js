export const generateIdErrorInfo = (id) => {
    return `El ID que estás buscando no existe. 
    ID buscado: ${id}`
}

export const generateDuplicatedErrorInfo = (product) => {
    return `El Código que estás usando para crear el producto ya está en uso. 
    Código usado: ${product.code} 
    Producto que YA tiene ese código: ${product.title}`
}