export type Option =
  | {
      label: string;
      value: string;
      isGroup?: true;
      groupName?: string;
      level?: number;
      items?: Option[];
    }
  | {
      label: string;
      value?: undefined;
      items: Option[];
    };
