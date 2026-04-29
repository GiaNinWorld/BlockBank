export const getBrand = (numBrand) => {
    const digits = String(numBrand ?? "").replace(/\D/g, "");

    if (digits.length >= 2) {
        return digits.substring(0, 2);
    }

    return "";
};
