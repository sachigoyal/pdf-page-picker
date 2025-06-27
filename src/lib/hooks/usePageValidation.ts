import { useState, useCallback, useMemo } from "react";
import { validatePageNumber, getValidatedPageRange } from "@/lib/utils/validation-utils";

export const usePageValidation = (totalPages: number) => {
  const [startPage, setStartPage] = useState("1");
  const [endPage, setEndPage] = useState("1");
  const [startPageError, setStartPageError] = useState("");
  const [endPageError, setEndPageError] = useState("");

  const handleStartPageChange = useCallback(
    (value: string) => {
      setStartPage(value);
      const validation = validatePageNumber(value, totalPages, endPage, true);
      setStartPageError(validation.error);
      if (endPage !== "") {
        const endValidation = validatePageNumber(endPage, totalPages, value, false);
        setEndPageError(endValidation.error);
      }
    },
    [totalPages, endPage]
  );

  const handleEndPageChange = useCallback(
    (value: string) => {
      setEndPage(value);
      const validation = validatePageNumber(value, totalPages, startPage, false);
      setEndPageError(validation.error);
      if (startPage !== "") {
        const startValidation = validatePageNumber(startPage, totalPages, value, true);
        setStartPageError(startValidation.error);
      }
    },
    [totalPages, startPage]
  );

  const validatedPageRange = useMemo(
    () => getValidatedPageRange(startPage, endPage, totalPages),
    [startPage, endPage, totalPages]
  );

  const isValidRange = useMemo(
    () => validatedPageRange !== null && startPageError === "" && endPageError === "",
    [validatedPageRange, startPageError, endPageError]
  );

  const resetPages = useCallback(() => {
    setStartPage("1");
    setEndPage(totalPages > 0 ? totalPages.toString() : "1");
    setStartPageError("");
    setEndPageError("");
  }, [totalPages]);

  return {
    startPage,
    endPage,
    startPageError,
    endPageError,
    validatedPageRange,
    isValidRange,
    handleStartPageChange,
    handleEndPageChange,
    resetPages,
  };
}; 