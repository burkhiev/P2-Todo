import { useCallback } from 'react';

interface ITitleValidator {
  (title?: string): boolean
}

export default function useTodoValidators()
  : [ITitleValidator] {
  const validateTitle = useCallback(
    (onValTitle?: string) => (onValTitle?.length ?? 0) > 0,
    [],
  );

  return [validateTitle];
}
