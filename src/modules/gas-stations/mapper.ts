import { Double } from 'mongodb';

export const mapExternalToGasStation = (raw: any) => {
    const parseToNumber = (value: any) => {
        if (value === undefined || value === null || value === '') return undefined;
        // Convert to string to handle 'int' or 'number' types that don't have .replace
        const normalized = String(value).replace(',', '.');
        const num = parseFloat(normalized);
        return isNaN(num) ? undefined : num;
    };

    const parseToMongoDouble = (value: any) => {
        const num = parseToNumber(value);
        return num !== undefined ? new Double(num) : undefined;
    };

    const lat = parseToNumber(raw['Latitud']);
    const lng = parseToNumber(raw['Longitud (WGS84)']);

    if (lat === undefined || lng === undefined) {
        throw new Error('Invalid coordinates');
    }

    return {
        name: raw['Rótulo'] ?? 'Gasolinera sin nombre',
        schedule: raw['Horario'],

        prices: {
            gasoline95: parseToMongoDouble(raw['Precio Gasolina 95 E5']),
            gasoline98: parseToMongoDouble(raw['Precio Gasolina 98 E5']),
            dieselA: parseToMongoDouble(raw['Precio Gasoleo A']),
            dieselB: parseToMongoDouble(raw['Precio Gasoleo B']),
            adblue: parseToMongoDouble(raw['Precio Adblue']),
            gnc: parseToMongoDouble(raw['Precio Gas Natural Comprimido']),
            glp: parseToMongoDouble(raw['Precio Gases licuados del petróleo']),
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
