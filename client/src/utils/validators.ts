// Utility functions for validation

/**
 * Validates a Brazilian CNPJ (Cadastro Nacional de Pessoa Jurídica)
 * @param cnpj - CNPJ string (with or without formatting)
 * @returns true if valid, false otherwise
 */
export function validateCNPJ(cnpj: string): boolean {
    // Remove non-digits
    cnpj = cnpj.replace(/[^\d]/g, '');

    // Must have 14 digits
    if (cnpj.length !== 14) return false;

    // Reject known invalid patterns (all same digits)
    if (/^(\d)\1+$/.test(cnpj)) return false;

    // Calculate first verification digit
    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    const digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
        sum += Number(numbers.charAt(size - i)) * pos--;
        if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== Number(digits.charAt(0))) return false;

    // Calculate second verification digit
    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
        sum += Number(numbers.charAt(size - i)) * pos--;
        if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== Number(digits.charAt(1))) return false;

    return true;
}

/**
 * Formats a CNPJ string to the standard format: XX.XXX.XXX/XXXX-XX
 * @param cnpj - CNPJ string (digits only or formatted)
 * @returns Formatted CNPJ string
 */
export function formatCNPJ(cnpj: string): string {
    const digits = cnpj.replace(/[^\d]/g, '');
    if (digits.length !== 14) return cnpj;

    return digits.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        '$1.$2.$3/$4-$5'
    );
}

/**
 * Validates a Brazilian CPF (Cadastro de Pessoa Física)
 * @param cpf - CPF string (with or without formatting)
 * @returns true if valid, false otherwise
 */
export function validateCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]/g, '');

    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    // Calculate first verification digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += Number(cpf.charAt(i)) * (10 - i);
    }
    let result = (sum * 10) % 11;
    if (result === 10) result = 0;
    if (result !== Number(cpf.charAt(9))) return false;

    // Calculate second verification digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += Number(cpf.charAt(i)) * (11 - i);
    }
    result = (sum * 10) % 11;
    if (result === 10) result = 0;
    if (result !== Number(cpf.charAt(10))) return false;

    return true;
}
