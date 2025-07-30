export function parseToNumber(value: string): number | undefined {
    const parsed = Number(value);
    return isNaN(parsed) ? undefined : parsed;
  }