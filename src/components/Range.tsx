import React, { ChangeEvent } from 'react';

type Props = {
  id: string;
  label: string;
  dataList?: string[];
  min: string;
  max: string;
  step: string;
  value: string;
  handleChange: (value: string) => void;
};

const Range = ({ id, label, dataList, min, max, step, value = '', handleChange }: Props) => {
  return (
    <>
      <div type="range" className="sdpi-item" id={id}>
        <div className="sdpi-item-label">
          <div>{label}</div>
          <span>({value} Min.)</span>
        </div>
        <div className="sdpi-item-value">
          <span className="clickable" value={min}>
            {min}
          </span>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            list="data"
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
            value={value}
          />
          <datalist id="data">
            {dataList
              ? dataList.map((data) => <option key={data}>{data}</option>)
              : [...Array(Number(max) / Number(step) + 1).keys()].map((data) => (
                  <option key={data * Number(step)}>{data * Number(step)}</option>
                ))}
          </datalist>
          <span className="clickable" value={max}>
            {max}
          </span>
        </div>
      </div>
    </>
  );
};

export default Range;
