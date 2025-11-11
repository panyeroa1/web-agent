/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

interface DialpadProps {
  onDial: (number: string) => void;
  onCall: () => void;
  phoneNumber: string;
}

const Dialpad: React.FC<DialpadProps> = ({ onDial, onCall, phoneNumber }) => {
  const buttons = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '*', '0', '#',
  ];

  const handleBackspace = () => {
    onDial(phoneNumber.slice(0, -1));
  };

  return (
    <div className="dialpad-container">
      <div className="phone-number-display">{phoneNumber || <>&nbsp;</>}</div>
      <div className="dialpad-grid">
        {buttons.map((btn) => (
          <button key={btn} className="dialpad-button" onClick={() => onDial(phoneNumber + btn)}>
            {btn}
          </button>
        ))}
      </div>
      <div className="dialpad-actions">
        <div className="action-placeholder"></div>
        <button className="call-button" onClick={onCall}>
          <span className="icon">call</span>
        </button>
        {phoneNumber ? (
          <button className="backspace-button" onClick={handleBackspace}>
            <span className="icon">backspace</span>
          </button>
        ) : (
          <div className="action-placeholder"></div>
        )}
      </div>
    </div>
  );
};

export default Dialpad;