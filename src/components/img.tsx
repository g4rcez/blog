import React, { useCallback, useRef } from "react";

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> &
  React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & { alt: string };

const defaultImg = "/img/react.png";
export const Img = (props: Props) => {
  const ref = useRef<HTMLImageElement>(null);
  const onError = useCallback(() => (ref.current!.src = defaultImg), []);
  return <img ref={ref} {...props} src={props.src} onError={onError} loading="lazy" />;
};
