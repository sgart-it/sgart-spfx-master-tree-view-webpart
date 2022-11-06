export const isNullOrWhiteSpace = (str: string): boolean => {
    if (undefined === str || null === str) return true;
    //if ('string' !== typeof str) throw 'Invalid type';
    if ((/^\s*$/g).test(str)) return true;
    return false;
};

export const getQuerystring = (name: string): string => {
    const params = new URLSearchParams(window.location.search);

    let result = undefined;

    const n = name.toLowerCase();

    params.forEach((value, key) => {
        if (n === key.toLowerCase()) {
            result = value;
            return;
        }
    });
    return result;
};