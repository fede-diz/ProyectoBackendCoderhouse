export const generateIdErrorInfo = (id) => {
    return `El ID que estás buscando no existe. 
    ID buscado: ${id}`
}

export const generateDuplicatedErrorInfo = (product) => {
    return `El Código que estás usando para crear el producto ya está en uso. 
    Código usado: ${product.code} 
    Producto que YA tiene ese código: ${product.title}`
}

export const generateNotAuthToCreateErrorInfo = (user) => {
    return `No tenés permisos suficientes para crear un producto. 
    Rol actual: ${user.role}`
}

export const generateNotAuthToDeleteErrorInfo = (user) => {
    return `No tenés permisos suficientes para eliminar este producto. 
    Rol actual: ${user.role}`
}

export const generateNotAuthToManageUsersErrorInfo = (user) => {
    return `No tenés permisos suficientes para modificar usuarios. 
    Rol actual: ${user.role}`
}