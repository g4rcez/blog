import React, { useCallback, useRef } from "react";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> &
  React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & {
    alt: string;
    fallback?: string;
  };

const defaultImg = "/img/react.png";
export const Img = ({ fallback, ...props }: Props) => {
  const ref = useRef<HTMLImageElement>(null);
  const onError = useCallback(() => (ref.current!.src = fallback || defaultImg), [fallback]);
  return <img ref={ref} {...props} alt={props.alt} src={props.src} onError={onError} loading="lazy" />;
};
