import { useState } from 'react';

export default function useTodoEditor(
  initTitle?: string,
  initDescription?: string,
) {
  function validateTitle(onValTitle?: string) {
    return onValTitle && onValTitle.length > 0;
  }

  const [title, setTitle] = useState(initTitle ?? '');
  const [description, setDescription] = useState(initDescription ?? '');
  const [isTitleValid, setIsTitleValid] = useState(validateTitle(initTitle));
  const [isValidated, setIsValidated] = useState(false);

  function resetStates() {
    setTitle(initTitle ?? '');
    setDescription(initDescription ?? '');
    setIsTitleValid(validateTitle(initTitle));
    setIsValidated(false);
  }

  function setInitStates(arg: { title: string, description?: string}) {
    setTitle(arg.title ?? '');
    setDescription(arg.description ?? '');
    setIsTitleValid(validateTitle(arg.title));
    setIsValidated(false);
  }

  function onTitleChange(value: string) {
    setTitle(value);
    setIsTitleValid(value.length > 0);
  }

  function onDescriptionChange(value: string) {
    setDescription(value);
  }

  return {
    setInitStates,
    resetStates,
    title,
    setTitle: onTitleChange,
    isTitleValid,
    description,
    setDescription: onDescriptionChange,
    setIsValidated,
    isValidated,
  };
}
