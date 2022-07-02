export default function useTodoValidators()
  : [(title?: string) => boolean] {
  function validateTitle(onValTitle?: string) {
    return (onValTitle?.length ?? 0) > 0;
  }

  return [validateTitle];
}
