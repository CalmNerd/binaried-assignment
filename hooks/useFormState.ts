import { useState, useCallback } from 'react';

interface UseFormStateOptions<T> {
  initialValues: T;
  onSubmit?: (values: T) => Promise<void> | void;
  onReset?: () => void;
}

export const useFormState = <T extends Record<string, unknown>>(
  options: UseFormStateOptions<T>
) => {
  const { initialValues, onSubmit, onReset } = options;
  
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const setValue = useCallback((key: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
    
    // Clear error when field is modified
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  }, [errors]);

  const setError = useCallback((key: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [key]: error }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
    setIsDirty(false);
    onReset?.();
  }, [initialValues, onReset]);

  const handleSubmit = useCallback(async () => {
    if (!onSubmit) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      reset();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, onSubmit, reset]);

  return {
    values,
    errors,
    isSubmitting,
    isDirty,
    setValue,
    setError,
    clearErrors,
    reset,
    handleSubmit
  };
}; 