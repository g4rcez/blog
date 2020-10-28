import React, { useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from "react";
import MaskInput, { CustomInputProps, InputTypes } from "the-mask-input";
import { useClassNames } from "../hooks/use-classnames";
import { Strings } from "../lib/strings";
import { Nullable } from "../react-app-env";
import { SpinLoading } from "./spin-loader";

type Label = React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;

type PartialValidity = Partial<Record<keyof ValidityState, string>>;

type CurrentValidity = { key: Nullable<string>; msg: string };

export type InputProps<T = any> = Omit<CustomInputProps, "name" | "placeholder" | "type" | "value" | "onInvalid"> &
  Required<{
    name: keyof T;
    placeholder: string;
  }> &
  Partial<{
    containerClassName: string;
    errorMessage: string;
    loading: boolean;
    labelClassName: string;
    rightIcons: React.ReactNode;
    labelProps: Omit<Label, "htmlFor">;
    onInvalid: (e: CurrentValidity) => void;
    onValid: () => void;
    showFeedback: boolean;
    successMessage: string;
    type: InputTypes;
    validate: (value?: string) => boolean;
    validateOnChange: boolean;
    value: string;
  }> &
  PartialValidity;

const hasValidityError = (validity: Partial<ValidityState> = {}) => {
  const { valid, ...fails } = validity;
  return Object.values(fails).some(Boolean);
};

type getCustomValidity = (validity: Partial<ValidityState> | undefined) => keyof ValidityState;
const getErrorValidity: getCustomValidity = (validity) => {
  if (validity === undefined || !hasValidityError(validity) || validity?.valid) {
    return "" as never;
  }
  const { valid, ...fails } = validity;
  return (Object.entries(fails).find((x) => !!x[0])?.[0] as never) ?? ("" as never);
};

const getValidity = (validity?: ValidityState) => ({
  typeMismatch: !!validity?.typeMismatch,
  tooShort: !!validity?.tooShort,
  tooLong: !!validity?.tooLong,
  badInput: !!validity?.badInput,
  valueMissing: !!validity?.valueMissing,
  stepMismatch: !!validity?.stepMismatch,
  rangeOverflow: !!validity?.rangeOverflow,
  rangeUnderflow: !!validity?.rangeUnderflow,
  patternMismatch: !!validity?.patternMismatch,
  valid: !!validity?.valid
});

export const Input: <T = any>(props: InputProps<T>) => JSX.Element = React.forwardRef(
  <T,>(
    {
      labelClassName,
      errorMessage,
      validateOnChange,
      rightIcons,
      validate,
      labelProps,
      showFeedback = false,
      containerClassName,
      successMessage,
      loading,
      onValid,
      badInput = "",
      customError = "",
      stepMismatch = "",
      valueMissing = "Value is not valid",
      patternMismatch = "Value is not in pattern",
      rangeOverflow = "Value is greater than range",
      rangeUnderflow = "Value is less than range",
      tooLong = "Value is too long",
      tooShort = "Value is too short",
      typeMismatch = "Value doesn't match with validation",
      valid = "",
      ...input
    }: InputProps<T>,
    externalRef: React.Ref<HTMLInputElement>
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(externalRef, () => inputRef.current!);

    const [validField, setValidField] = useState<boolean | undefined>(() =>
      validate && Strings.nullOrEmptyString(input.value) ? validate(input.value) : undefined
    );

    const containerClx = useClassNames(
      [containerClassName, validField],
      containerClassName,
      "relative inline-block input-div",
      { "input-invalid": validField === false, "input-valid": validField }
    );

    const labelClx = useClassNames(
      [labelClassName, labelProps?.className],
      labelClassName,
      labelProps?.className,
      "input-label"
    );

    useEffect(() => {
      const hasText = !Strings.nullOrEmptyString(input.value);
      if (!!validField && hasText) {
        onValid?.();
      }
    }, [validField, input.value, onValid, input.name]);

    const validityMessages = useMemo(
      () =>
        showFeedback
          ? {
              stepMismatch,
              valueMissing,
              badInput,
              patternMismatch,
              rangeOverflow,
              rangeUnderflow,
              tooLong,
              tooShort,
              typeMismatch,
              valid,
              customError: validField !== false ? "" : customError || errorMessage
            }
          : {},
      [
        badInput,
        customError,
        errorMessage,
        patternMismatch,
        rangeOverflow,
        rangeUnderflow,
        showFeedback,
        stepMismatch,
        tooLong,
        tooShort,
        typeMismatch,
        valid,
        validField,
        valueMissing
      ]
    );

    const getRefValidity = () => getValidity(inputRef.current?.validity);

    const currentValidity: CurrentValidity = useMemo((): CurrentValidity => {
      if (!showFeedback || input.value === "") {
        return { key: null, msg: "" };
      }
      const errorKey = getErrorValidity(getRefValidity());
      if (validField === false) {
        const msg = validityMessages[errorKey] ?? errorMessage!;
        inputRef.current?.setCustomValidity?.(msg);
        return { key: errorKey, msg };
      }
      return { key: null, msg: "" };
    }, [validityMessages, showFeedback, errorMessage, validField, input.value]);

    useLayoutEffect(() => {
      inputRef.current?.setCustomValidity?.(currentValidity.msg);
    }, [input.value, errorMessage, validityMessages, currentValidity]);

    const validateValidity = (eventValidity?: Partial<ValidityState>) => {
      const val = inputRef.current?.value;
      if (hasValidityError(eventValidity) && val !== "") {
        input.onInvalid?.(currentValidity);
        setValidField(false);
      } else if (val !== "") {
        setValidField(validate?.(val) ?? true);
      }
    };

    useLayoutEffect(() => {
      validateValidity(getRefValidity());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onTestValidate = (value?: string) => {
      const result = validate?.(value);
      setValidField(result ?? inputRef.current?.validity?.valid);
    };

    const onChange: InputProps["onChange"] = (e:any) => {
      e.persist();
      validateValidity(getValidity(e.target.validity));
      if (validateOnChange) {
        onTestValidate(e.target.value);
      }
      input.onChange?.(e);
    };

    const onInvalid = (e: React.FormEvent<HTMLInputElement>) => {
      e.persist();
      validateValidity((e.target as any).validity);
      input.onInvalid?.(currentValidity);
    };

    return (
      <div className={containerClx}>
        {(loading || rightIcons) && (
          <div className="absolute right-0 flex items-center justify-end">
            {loading && <SpinLoading size={0.8} className={rightIcons ? "mr-2" : undefined} />} {rightIcons}
          </div>
        )}
        <MaskInput
          {...input}
          type={input.type ?? "text"}
          onChange={onChange}
          onInvalid={onInvalid}
          disabled={input.disabled || loading}
          ref={inputRef}
          id={input.name as string}
          name={input.name as string}
          className="input"
          placeholder=" "
        />
        <label {...labelProps} htmlFor={input.name as string} className={labelClx}>
          {input.placeholder}
        </label>
        <div className="input-underline" />
        {showFeedback && (
          <span className="text-sm absolute bottom-20">
            <small className="input-invalid-message">{currentValidity.msg}</small>
            <small className="input-valid-message">{successMessage}</small>
          </span>
        )}
      </div>
    );
  }
) as never;

export type { InputTypes } from "the-mask-input";
