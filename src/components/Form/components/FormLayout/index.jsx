import React, {useState} from 'react';
import {Col, Row, Steps} from 'antd';
import ProSkeleton from '@ant-design/pro-skeleton';
import ProCard from '@ant-design/pro-card';
import {useRequest} from '@/util/Request';
import {formList} from '@/pages/Form/url';
import {isArray, isObject} from '@/util/Tools';

const FormLayout = (
  {
    formType,
    fieldRender = () => {
      return <></>;
    }
  }
) => {

  const [layout, setLayout] = useState({});
  const [setps, setSetps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const {loading: detailLoaidng} = useRequest({
    ...formList,
    data: {formType}
  }, {
    onSuccess: (res) => {
      if (res[0] && res[0].typeSetting) {
        const typeSetting = JSON.parse(res[0].typeSetting) || {};
        setSetps(typeSetting.steps);
        setLayout({width: typeSetting.width, gutter: typeSetting.gutter, widthUnit: typeSetting.widthUnit});
      }
    }
  });

  if (detailLoaidng) {
    return <ProSkeleton />;
  }

  return <>
    <div hidden={setps.length === 1} style={{marginBottom: 24}}>
      <Steps
        current={currentStep}
        onChange={(step) => {
          setCurrentStep(step);
        }}>
        {
          setps.map((item, index) => {
            return <Steps.Step
              title={item.title || `步骤${index + 1}`}
              key={index}
            />;
          })
        }
      </Steps>
    </div>
    {
      isArray(isObject(setps[currentStep]).data).map((rows = [], rowIndex) => {
        return <Row key={rowIndex} style={{width: (layout.width || 100) + (layout.widthUnit || '%')}} gutter={layout.gutter}>
          {
            rows.map((columnItem, columnIndex) => {
              if (columnItem.card) {
                const table = columnItem.table || [];
                return <Col key={columnIndex} span={24 / rows.length}>
                  <ProCard
                    bodyStyle={{padding: 16}}
                    className="h2Card"
                    title={columnItem.title || '无标题'}
                    headerBordered
                  >
                    {
                      table.map((rows = [], rowIndex) => {
                        return <Row key={rowIndex} gutter={layout.gutter}>
                          {
                            rows.map((columnItem, columnIndex) => {
                              const data = columnItem.data || [];
                              return <Col key={columnIndex} span={24 / rows.length}>
                                {data.map((item, index) => {
                                  return <div key={index}>{fieldRender(item)}</div>;
                                })}
                              </Col>;
                            })
                          }
                        </Row>;
                      })
                    }
                  </ProCard>
                </Col>;
              } else {
                const data = columnItem.data || [];
                return <Col key={columnIndex} span={24 / rows.length}>
                  {data.map((item, index) => {
                    return <div key={index}>{fieldRender(item)}</div>;
                  })}
                </Col>;
              }
            })
          }
        </Row>;
      })
    }
  </>;
};

export default FormLayout;
