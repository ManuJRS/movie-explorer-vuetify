

export const required = (value: string | number, message: string): true | string => {
    return !!value || message
}

export const isValidYear = (value: string | number, message: string): true | string => {
    return (value && Number(value) > 1800 && Number(value) < 2100) || message
}