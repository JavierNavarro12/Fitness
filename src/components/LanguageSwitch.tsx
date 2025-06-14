import React from 'react';
import styled from 'styled-components';

interface LanguageSwitchProps {
  checked: boolean; // true = EN, false = ES
  onChange: () => void;
}

const LanguageSwitch: React.FC<LanguageSwitchProps> = ({ checked, onChange }) => {
  return (
    <LangWrapper>
      <label className="lang-switch">
        <input type="checkbox" className="lang-switch__checkbox" checked={checked} onChange={onChange} />
        <div className="lang-switch__container">
          <div className="lang-switch__flag lang-switch__flag--es">🇪🇸</div>
          <div className="lang-switch__flag lang-switch__flag--en">🇬🇧</div>
          <div className="lang-switch__circle" />
        </div>
      </label>
    </LangWrapper>
  );
};

const LangWrapper = styled.div`
  .lang-switch {
    --toggle-width: 90px;
    --toggle-height: 40px;
    --circle-size: 34px;
    --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-block;
    cursor: pointer;
    user-select: none;
  }
  .lang-switch__checkbox {
    display: none;
  }
  .lang-switch__container {
    width: var(--toggle-width);
    height: var(--toggle-height);
    background: #e5e7eb;
    border-radius: 999px;
    position: relative;
    transition: background var(--transition);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4px;
    box-sizing: border-box;
  }
  .lang-switch__flag {
    font-size: 28px;
    z-index: 2;
    transition: opacity var(--transition);
    pointer-events: none;
  }
  .lang-switch__flag--es {
    opacity: 1;
    margin-left: 0;
  }
  .lang-switch__flag--en {
    opacity: 1;
    margin-right: -2px;
  }
  .lang-switch__circle {
    position: absolute;
    top: 2px;
    left: 2px;
    width: var(--circle-size);
    height: var(--circle-size);
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    transition: left var(--transition), background var(--transition);
    z-index: 1;
  }
  .lang-switch__checkbox:checked ~ .lang-switch__container {
    background: #2563eb;
  }
  .lang-switch__checkbox:checked ~ .lang-switch__container .lang-switch__circle {
    left: calc(100% - var(--circle-size) - 2px);
    background: #fff;
  }
`;

export default LanguageSwitch; 