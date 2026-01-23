export const mapExternalToGasStation = (raw: any) => {
    const lat = parseFloat(raw['Latitud']?.replace(',', '.'));
    const lng = parseFloat(
        raw['Longitud (WGS84)']?.replace(',', '.')
    );

    if (isNaN(lat) || isNaN(lng)) {
        throw new Error('Invalid coordinates');
    }

    const parsePrice = (value: string) =>
        value ? Number(value.replace(',', '.')) : undefined;

    return {
        name: raw['Rótulo'],
        schedule: raw['Horario'],

        prices: {
            gasoline95: parsePrice(raw['Precio Gasolina 95 E5']),
            gasoline98: parsePrice(raw['Precio Gasolina 98 E5']),
            dieselA: parsePrice(raw['Precio Gasoleo A']),
            dieselB: parsePrice(raw['Precio Gasoleo B']),
            adblue: parsePrice(raw['Precio Adblue']),
            gnc: parsePrice(raw['Precio Gas Natural Comprimido']),
            glp: parsePrice(raw['Precio Gas Natural Licuado']),
        },

        province: raw['Provincia'],
        city: raw['Municipio'],
        address: raw['Dirección'],

        location: {
            type: 'Point',
            coordinates: [lat, lng],
        },
    };
};
