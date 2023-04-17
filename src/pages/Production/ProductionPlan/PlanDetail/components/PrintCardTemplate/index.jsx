import React, {useEffect, useState} from 'react';
import AcBarcode from 'ac-barcode';
import html2canvas from 'html2canvas';

const PrintCardTemplate = (
  {
    imgUrl,
    cardItem
  }
) => {

  const [productionCardCode, setProductionCardCode] = useState('');

  useEffect(() => {
    html2canvas(document.getElementById('productionCardCode'), {
      // scale: 0.7,
      logging: false,
      useCORS: true,
      allowTaint: true,
    }).then(canvas => {
      const imgsrc = canvas.toDataURL();
      setProductionCardCode(imgsrc);
    });
  }, []);

  return <div id="printCardTemplate">
    {
      !productionCardCode ?
        <div id="productionCardCode" style={{textAlign: 'center'}}>
          <div>
            <img src={imgUrl} alt="" />
          </div>
          <div>
            {cardItem.productionCardId && <AcBarcode width={2} value={`KP${cardItem.productionCardId}`} />}
          </div>
        </div>
        :
        <div style={{textAlign: 'center'}}>
          <img src={productionCardCode} alt="" />
        </div>
    }
  </div>;
};

export default PrintCardTemplate;
