import React from 'react';

interface ITitleEditorProps {
  text: string,
  placeholder?: string,
  mustValidate?: boolean,
  isValid?: boolean,
  isValidated?: boolean,
  useTextarea?: boolean,
  takeFocus?: boolean,
  isLoading: boolean,
  onChange: (value: string) => void,
  onEntered?: () => void
}

export default function FieldEditor(props: ITitleEditorProps) {
  const {
    text,
    placeholder,
    useTextarea,
    mustValidate,
    isValid,
    isValidated,
    isLoading,
    onChange: onChangeCallback,
    onEntered: onEnteredCallback = () => { },
    takeFocus = false,
  } = props;

  function onChange(e: React.ChangeEvent<any>) {
    if (!isLoading) {
      const { value } = e.target;
      onChangeCallback(value ?? '');
    }
  }

  function onEntered(e: React.KeyboardEvent<any>) {
    if (!isLoading && e.key === 'Enter') {
      onEnteredCallback();
    }
  }

  function onClick(e: React.MouseEvent<any>) {
    e.stopPropagation();
  }

  let titleInput: any;
  const validStyle = (mustValidate && isValidated && !isValid) ? 'is-invalid' : '';
  const placeholderStyle = (isLoading ? 'placeholder' : '');

  if (useTextarea) {
    titleInput = (
      <textarea
        value={text}
        placeholder={placeholder}
        className={`form-control form-control-sm ${placeholderStyle} ${validStyle}`}
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
        className={`form-control form-control-sm ${placeholderStyle} ${validStyle}`}
        onChange={onChange}
        onKeyDown={onEntered}
        onClick={onClick}
        autoFocus={takeFocus}
      />
    );
  }

  return (
    <div className="placeholder-glow">
      {titleInput}
    </div>
  );
}
