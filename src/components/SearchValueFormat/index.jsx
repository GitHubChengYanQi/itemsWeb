import React from 'react';
import styles from './index.module.less';
import Note from '@/components/Note';

const SearchValueFormat = ({label = '', searchValue = '', maxWidth}) => {

  if (!searchValue) {
    if (maxWidth) {
      return <Note maxWidth={maxWidth} value={label} />;
    }
    return label || '-';
  }

  let newLabel = label;
  const stringLabel = `${label}`;
  const lowerCaseLabel = stringLabel.toLowerCase();
  const lowerCaseValue = searchValue.toLowerCase();
  if (lowerCaseLabel.indexOf(lowerCaseValue) !== -1) {
    const startValue = stringLabel.substring(0, lowerCaseLabel.indexOf(lowerCaseValue));
    const value = stringLabel.substring(lowerCaseLabel.indexOf(lowerCaseValue), lowerCaseLabel.indexOf(lowerCaseValue) + lowerCaseValue.length);
    const endValue = stringLabel.substring(lowerCaseLabel.indexOf(lowerCaseValue) + lowerCaseValue.length, lowerCaseLabel.length);
    newLabel = <>{startValue}<span className={styles.searchValue}>{value}</span>{endValue}</>;
  }
  if (maxWidth) {
    return <Note maxWidth={maxWidth} value={newLabel} />;
  }
  return newLabel;
};

export default SearchValueFormat;
