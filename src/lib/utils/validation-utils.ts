export interface ValidationResult {
  isValid: boolean;
  error: string;
}

export const validatePageNumber = (
  value: string,
  totalPages: number,
  otherPageValue?: string,
  isStartPage?: boolean
): ValidationResult => {
  if (value === "") {
    return { isValid: true, error: "" };
  }

  const num = parseInt(value);
  
  if (isNaN(num)) {
    return { isValid: false, error: "Must be a number" };
  }
  
  if (num < 1) {
    return { isValid: false, error: "Must be at least 1" };
  }
  
  if (num > totalPages) {
    return { isValid: false, error: `Must be at most ${totalPages}` };
  }

  if (otherPageValue && otherPageValue !== "" && !isNaN(parseInt(otherPageValue))) {
    const otherNum = parseInt(otherPageValue);
    if (isStartPage && num > otherNum) {
      return { isValid: false, error: "Must be ≤ end page" };
    }
    if (!isStartPage && num < otherNum) {
      return { isValid: false, error: "Must be ≥ start page" };
    }
  }

  return { isValid: true, error: "" };
};

export const getValidatedPageRange = (
  startPage: string,
  endPage: string,
  totalPages: number
): { start: number; end: number } | null => {
  const start = startPage === "" ? null : parseInt(startPage);
  const end = endPage === "" ? null : parseInt(endPage);
  
  if (start === null || end === null || isNaN(start) || isNaN(end)) {
    return null;
  }
  
  if (start < 1 || end < 1 || start > totalPages || end > totalPages || start > end) {
    return null;
  }
  
  return { start, end };
}; 