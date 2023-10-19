export const getBrand = (numBrand) => {
    if (numBrand && numBrand.length >= 2) { // Verifique o comprimento do número
        const prefix = numBrand.substring(0, 2);
        return prefix;
    }
    return ''; // Retorne um valor padrão, se necessário
}