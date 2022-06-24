import { useState } from 'react';

interface IUseTodoEditorArgs {
  title?: string,
  description?: string,
}

export default function useTodoEditor(args: IUseTodoEditorArgs) {
  const { title: initTitle, description: initDescription } = args;

  const [title, setTitle] = useState(initTitle ?? '');
  const [description, setDescription] = useState(initDescription ?? '');
  const [isTitleValid, setIsTitleValid] = useState(!!initTitle);
  const [isValidated, setIsValidated] = useState(false);

  function resetStates() {
    setTitle(initTitle ?? '');
    setDescription(initDescription ?? '');
    setIsTitleValid(!!initTitle);
    setIsValidated(false);
  }

  function setInitStates(arg: { title: string, description?: string}) {
    setTitle(arg.title ?? '');
    setDescription(arg.description ?? '');
    setIsTitleValid(!!arg.title);
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
