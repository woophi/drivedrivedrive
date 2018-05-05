export const parseToInt = (value: string) => isNaN(parseInt(value, 10)) ? '' : parseInt(value, 10);
