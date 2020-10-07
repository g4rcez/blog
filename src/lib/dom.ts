import { Storage } from "./storage";
export const getDefaultLanguage = (): string => Storage.getStorageLocale() || navigator.language;

export const isDocumentElement = (el: Element) => [document.body, window].indexOf(el as any) > -1;
export const scrollTo = (el: Element, top: number): void => {
  if (isDocumentElement(el)) {
    window.scrollTo(0, top);
    return;
  }
  console.log({ el });
  el.scrollBy({ behavior: "smooth", top });
};
export const scrollIntoView = (menu: HTMLElement, element: HTMLElement): void => {
  const menuRect = menu.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  const overScroll = element.offsetHeight / 3;
  if (elementRect.bottom + overScroll > menuRect.bottom) {
    const o = Math.min(element.offsetTop + element.clientHeight - menu.offsetHeight + overScroll, menu.scrollHeight);
    console.log("on if", o);
    return scrollTo(menu, o);
  }
  if (elementRect.top - overScroll < menuRect.top) {
    return scrollTo(menu, Math.max(element.offsetTop - overScroll, 0));
  }
};

export const Notify = (message: string) => {
  const send = () => new Notification(message, { icon: "/favicon.ico" });
  if (Notification.permission === "granted") {
    send();
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        send();
      }
    });
  }
};
