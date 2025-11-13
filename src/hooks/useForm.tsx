import { useState, useCallback } from "react";

export function useForm<T extends Record<string, unknown>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = useCallback((field: keyof T) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
      setValues((prev) => ({ ...prev, [field]: value as T[keyof T] }));
    };
  }, []);

  const setValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setValuesDirect = useCallback((newValues: Partial<T>) => {
    setValues((prev) => ({ ...prev, ...newValues }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  return {
    values,
    handleChange,
    setValue,
    setValues: setValuesDirect,
    reset,
  };
}
