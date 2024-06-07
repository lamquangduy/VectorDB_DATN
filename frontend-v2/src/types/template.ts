interface CrawlField {
  key: string;
  selector: string;
  is_multiple: boolean;
  is_required: boolean;
  type: "TEXT" | "IMAGE";
}
