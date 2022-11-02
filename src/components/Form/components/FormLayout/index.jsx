import React, {useState} from 'react';
import {Col, Row, Steps} from 'antd';
import ProSkeleton from '@ant-design/pro-skeleton';
import ProCard from '@ant-design/pro-card';
import {useRequest} from '@/util/Request';
import {formList} from '@/pages/Form/url';
import {isArray} from '@/util/Tools';

export const FormLayoutSubmit = ({currentStep,formRef,setCurrentStep,}) => {
  if (currentStep.type === 'add' || currentStep.step === isArray(currentStep.steps).length - 1) {
    formRef.current.submit();
  } else {
    formRef.current.validate().then(() => {
      setCurrentStep({
        ...currentStep,
        step: currentStep.step + 1,
        type: isArray(currentStep.steps)[currentStep.step + 1].type
      });
    }).catch((error) => {
      console.log(error);
    });
  }
};

const FormLayout = (
  {
    value,
    onChange = () => {
    },
    formType,
    fieldRender = () => {
      return <></>;
    }
  }
) => {

  const [layout, setLayout] = useState({});
  const [steps, setSteps] = useState([]);

  const {loading: detailLoaidng} = useRequest({
    ...formList,
    data: {formType}
  }, {
    onSuccess: (res) => {
      if (res[0] && res[0].typeSetting) {
        const typeSetting = JSON.parse(res[0].typeSetting) || {};
        const pc = typeSetting.pc || {};
        const newSteps = pc.steps || [];
        setSteps(newSteps);
        setLayout({width: pc.width, gutter: pc.gutter, widthUnit: pc.widthUnit});
        onChange({step: 0, type: newSteps[0].type, steps: newSteps});
      }
    }
  });

  if (detailLoaidng) {
    return <ProSkeleton />;
  }

  return <>
    <div hidden={steps.length === 1} style={{marginBottom: 24}}>
      <Steps
        current={value}
        onChange={(step) => {
          if (step >= value) {
            return;
          }
          onChange({step, type: steps[step].type, steps});
        }}
      >
        {
          steps.map((item, index) => {
            return <Steps.Step
              title={item.title || `步骤${index + 1}`}
              // description={item.type === 'add' && '保存'}
              key={index}
            />;
          })
        }
      </Steps>
    </div>
    {
      steps.map((setpItem, setpIndex) => {
        const data = setpItem.data || [];
        const hidden = value !== setpIndex;
        return <div hidden={hidden} key={setpIndex}>
          {
            data.map((rows = [], rowIndex) => {
              return <Row
                key={rowIndex}
                style={{width: (layout.width || 100) + (layout.widthUnit || '%')}}
                gutter={layout.gutter}>
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
                                        return <div key={index}>{fieldRender({
                                          ...item,
                                          required: hidden ? false : item.required
                                        })}</div>;
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
                          return <div key={index}>{fieldRender({
                            ...item,
                            required: hidden ? false : item.required
                          })}</div>;
                        })}
                      </Col>;
                    }
                  })
                }
              </Row>;
            })
          }
        </div>;
      })
    }
  </>;
};

export default FormLayout;
