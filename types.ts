export interface SaaSBriefData {
  name: string;
  motive: string;
  brandIdentity: {
    colorPalette: { name: string; hex: string }[];
    typography: {
      fontFamily: string;
      description: string;
    };
    style: string;
  };
  brief: string;
}
