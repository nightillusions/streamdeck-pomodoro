import React, { ChangeEvent, useState } from 'react';

type Props = { id: string; label: string; placeholder: string; value: string; handleChange: (value: string) => void };

const Textfield = ({ id, label, placeholder, value, handleChange }: Props) => {
  return (
    <div className="sdpi-item">
      <div className="sdpi-item-label">{label}</div>
      <input
        className="sdpi-item-value"
        id={id}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
        placeholder={placeholder}
        required
        pattern="^[0-9]*$"
      />
    </div>
  );
};

export default Textfield;
