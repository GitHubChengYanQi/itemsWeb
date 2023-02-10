import React, {useState} from 'react';
import PartsEdit from '@/pages/Erp/parts/PartsEdit';
import SelectBoms from '@/pages/Erp/parts/components/SelectBoms';

const BomComparison = (
  {
    comparisonParts,
    onComparisonParts = () => {
    },
    comparisonSku,
    onParts = () => {
    },
    addSku = () => {
    }
  }) => {

  const [value, onChange] = useState();

  const [parts, setParts] = useState([]);

  const [openDrawer, setOpenDrawer] = useState();

  return <>
    <div hidden={openDrawer}>
      <SelectBoms
        value={value}
        style={{width: '100%'}}
        onChange={(value) => {
          if (!value) {
            onComparisonParts([]);
          }
          onChange(value);
        }}
      />
    </div>


    {value && <PartsEdit
      addSku={addSku}
      comparison
      comparisonSku={comparisonSku}
      comparisonParts={comparisonParts}
      openDrawer={setOpenDrawer}
      parts={parts}
      onParts={onParts}
      setParts={(newParts) => {
        onComparisonParts(newParts);
        setParts(newParts);
      }}
      show
      firstEdit
      value={value}
    />}
  </>;
};

export default BomComparison;
