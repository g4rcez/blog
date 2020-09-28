import React, { useMemo } from "react";
import { pick, omit } from "ramda";
import { useClassNames } from "../../hooks/use-classnames";

const btnLinkClassName = "btn-base bg-transparent border-transparent hover:border-b rounded-none border-0";
const btnClassName = "btn-base bg-transparent hover:text-base";

const buttonThemes = {
  light: {
    className: `${btnClassName} border-base-light text-base hover:text-info-dark hover:bg-base focus:text-info-dark focus:bg-base`
  },
  lightDanger: {
    className: `${btnClassName} border-base-light hover:border-danger-light active:border-danger-light text-base hover:text-danger-dark hover:bg-danger-light focus:bg-danger-light`
  },
  lightWarn: {
    className: `${btnClassName} border-base-light hover:border-warn-light active:border-warn-light text-base hover:text-warn-dark hover:bg-warn-light focus:bg-warn-light`
  },
  lightPrimary: {
    className: `${btnClassName} border-base-light hover:border-primary-light active:border-primary-light text-base hover:text-primary-light hover:bg-base-light focus:bg-base-light`
  },
  primary: {
    className: `${btnClassName} border-primary-light text-primary-light hover:bg-primary-light focus:bg-primary-light focus:text-base`
  },
  info: { className: `${btnClassName} hover:bg-info-light active:bg-info-light border-info-light text-info` },
  link: { isLink: true, className: `${btnLinkClassName} hover:border-dark-light` },
  linkPrimary: { isLink: true, className: `${btnLinkClassName} hover:border-primary-light text-primary-light` },
  danger: { className: `${btnClassName} hover:bg-danger-light active:bg-danger-light border-danger-light text-danger` },
  warn: { className: `${btnClassName} hover:bg-warn-light active:bg-warn-light border-warn-light text-warn-light` }
};

export type ButtonTheme = {
  isLink?: boolean;
  className: string;
};

export type ButtonThemes = keyof typeof buttonThemes;

export const getTheme = (theme: ButtonTheme) => ({ className: theme.className, isLink: !!theme.isLink });

type ButtonThemeProps = Partial<Record<ButtonThemes, boolean>>;

type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

type Props = {
  theme?: ButtonTheme;
  vibrate?: number;
  loading?: boolean;
  onPress?(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
} & ButtonProps &
  ButtonThemeProps;

export const Button: React.FC<Props> = ({
  theme,
  loading,
  onClick,
  onPress,
  className,
  vibrate = 100,
  disabled = false,
  ...props
}) => {
  const clearProps = useMemo(
    () => ({ colors: pick(Object.keys(buttonThemes), props), props: omit(Object.keys(buttonThemes), props) }),
    [props]
  );

  const definedTheme = useMemo(() => {
    if (theme) {
      return getTheme(theme);
    }
    const colorDefined: ButtonThemes = (Object.keys(clearProps.colors)[0] as never) ?? "primary";
    return getTheme(buttonThemes[colorDefined]);
  }, [theme, clearProps.colors]);

  const isDisabled = useMemo(() => loading || disabled, [loading, disabled]);

  const clx = useClassNames(
    [definedTheme, className, loading, disabled],
    {
      "btn-body": !definedTheme.isLink,
      "btn-disabled": disabled,
      "cursor-not-allowed": disabled || loading,
      "loading-skeleton": loading,
      [definedTheme.className]: !disabled && !loading
    },
    className
  );

  const onTick = useMemo<ButtonProps["onClick"]>(() => {
    const action = onPress || onClick;
    return (event) => {
      if (!isDisabled) {
        if (vibrate > 0 && action) {
          navigator.vibrate(vibrate);
        }
        action?.(event);
      }
    };
  }, [onPress, onClick, vibrate, isDisabled]);

  return <button {...clearProps.props} disabled={isDisabled} className={clx} onClick={onTick} />;
};
