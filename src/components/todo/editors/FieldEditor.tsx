import React from 'react';

interface ITitleEditorProps {
  text: string,
  placeholder?: string,
  mustValidate?: boolean,
  isValid?: boolean,
  isValidated?: boolean,
  useTextarea?: boolean,
  onChange: (value: string) => void,
  onEntered?: () => void,
  takeFocus?: boolean,
}

export default function FieldEditor(props: ITitleEditorProps) {
  const {
    text,
    placeholder,
    useTextarea,
    mustValidate,
    isValid,
    isValidated,
    onChange: onChangeCallback,
    onEntered: onEnteredCallback = () => { },
    takeFocus = false,
  } = props;

  function onChange(e: React.ChangeEvent<any>) {
    const { value } = e.target;
    onChangeCallback(value ?? '');
  }

  function onEntered(e: React.KeyboardEvent<any>) {
    if (e.key === 'Enter') {
      onEnteredCallback();
    }
  }

  function onClick(e: React.MouseEvent<any>) {
    e.stopPropagation();
  }

  let titleInput: any;
  const validCss = (mustValidate && isValidated && !isValid) ? 'is-invalid' : '';

  if (useTextarea) {
    titleInput = (
      <textarea
        value={text}
        placeholder={placeholder}
        className={`form-control form-control-sm mb-1 ${validCss}`}
        rows={2}
        onChange={onChange}
        onKeyDown={onEntered}
        onClick={onClick}
        autoFocus={takeFocus}
      />
    );
  } else {
    titleInput = (
      <input
        type="text"
        value={text}
        placeholder={placeholder}
        className={`form-control form-control-sm mb-1 ${validCss}`}
        onChange={onChange}
        onKeyDown={onEntered}
        onClick={onClick}
        autoFocus={takeFocus}
      />
    );
  }

  return titleInput;
}
