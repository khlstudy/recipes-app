export interface RangeFilterProps {
  min: number;
  max: number;
  step: number;
  value: number;
  unitLabel: string;
  onChange: (_value: number) => void;
}
