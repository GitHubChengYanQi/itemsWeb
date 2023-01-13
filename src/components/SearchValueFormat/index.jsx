import React from 'react';
import styles from './index.module.less';

const SearchValueFormat = ({label = '', searchValue = ''}) => {

  let newLabel = label;
  const lowerCaseLabel = label.toLowerCase();
  const lowerCaseValue = searchValue.toLowerCase();
  if (lowerCaseLabel.indexOf(lowerCaseValue) !== -1) {
    const startValue = label.substring(0, lowerCaseLabel.indexOf(lowerCaseValue));
    const value = label.substring(lowerCaseLabel.indexOf(lowerCaseValue), lowerCaseLabel.indexOf(lowerCaseValue) + lowerCaseValue.length);
    const endValue = label.substring(lowerCaseLabel.indexOf(lowerCaseValue) + lowerCaseValue.length, lowerCaseLabel.length);
    newLabel = <>{startValue}<span className={styles.searchValue}>{value}</span>{endValue}</>;
  }
  return newLabel;
};

export default SearchValueFormat;
