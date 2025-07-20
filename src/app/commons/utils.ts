export function getEnumKeyByValue<T extends object>(enumObj: T, value: unknown): keyof T | undefined {
    return (Object.keys(enumObj) as Array<keyof T>).find(key => enumObj[key] === value);
}