import type { StatusPillTone } from "../../../common/status-pill/types";

export interface SectionHeaderStatus {
  tone: StatusPillTone;
  label: string;
  visible: boolean;
}

export interface SectionHeaderProps {
  number: number;
  title: string;
  required?: boolean;
  status: SectionHeaderStatus;
  onLegendClick: () => void;
}
