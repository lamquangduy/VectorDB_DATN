import vi from "./vi.json";
import en from "./en.json";
import jp from "./jp.json";
export enum langEnum {
  vi = "VI",
  en = "EN",
  jp = "JP",
}

export const translate = (key: string, lang: langEnum): string => {
  //main lang
  let data: any = vi;

  if (lang == langEnum.en) {
    data = en;
  }
  if (lang == langEnum.jp) {
    data = jp;
  }

  if (data[key] == undefined) data = en;
  return data[key];
};
