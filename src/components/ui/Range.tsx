import { useId, type CSSProperties } from 'react';

export function Range({
  label,
  unit,
  value,
  min,
  max,
  change,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  change: (v: number) => void;
}) {
  const id = useId();
  return (
    <div className="range-field">
      <div>
        <label htmlFor={id}>{label}</label>
        <strong aria-hidden="true">
          {value} <small>{unit}</small>
        </strong>
      </div>
      <input
        data-first
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        aria-valuetext={`${value} ${unit}`}
        style={{ '--fill': `${(100 * (value - min)) / (max - min)}%` } as CSSProperties}
        onChange={(e) => change(e.currentTarget.valueAsNumber)}
      />
      <div className="range-ends" aria-hidden="true">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
