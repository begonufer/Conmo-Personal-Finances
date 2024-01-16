import React from 'react';
import { PulseLoader } from 'react-spinners';

export const Spinner = () => (
  <div className="sweet-loading">
    <PulseLoader
        color="rgb(27, 100, 113)"
        loading={true}
        size={10}
        speedMultiplier={0.65}
    />
  </div>
);

