import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {
  Form as FormilyForm, FormItem as AntFormItem, Submit,
  Reset,
  FormButtonGroup, createAsyncFormActions,
} from '@formily/antd';
import useRequest from '@/util/Request/useRequest';
import {SkeletonForm} from '@/components/Skeleton';

import style from './index.module.less';
import Draft from '@/components/Form/components/Draft';

const formActionsPublic = createAsyncFormActions();

const FormWrapper = (
  {
    boxShadow,
    formType,
    children,
    labelCol,
    wrapperCol,
    api,
    formStyle,
    fieldKey,
    value,
    preview,
    defaultValue,
    details = () => {
    },
    formatDetail = (values) => {
      return values;
    },
    labelAlign,
    formatResult,
    initialValues,
    noButton,
    formActions = null,
    className,
    onSubmit = (values) => {
      return values;
    },
    loading = () => {

    },
    onSuccess = () => {
    },
    onError = () => {
    },
    ...props
  }, ref) => {

  if (preview) {
    api = {add: {}, view: {}, save: {}};
  }

  if (!api) {
    throw new Error('Table component: api cannot be empty,But now it doesn\'t exist!');
  }
  const key = {};

  if (value && (!api.view || !api.save)) {
    throw new Error('Table component: api.view,api.save cannot be empty,But now it doesn\'t exist!');
  }
  if (value === false && !api.add) {
    throw new Error('Table component: api.add cannot be empty,But now it doesn\'t exist!');
  }
  if (!fieldKey && api.view) {
    fieldKey = api.view.rowKey;
  }


  if (value) {
    key[fieldKey] = value;
  }


  const [findData, setFindData] = useState(undefined);


  // 获取数据
  const {run: find, loading: findLoad, refresh} = useRequest(api.view, {
    manual: true,
    onError: (error) => {
      onError(error);
    },
    formatResult: (response) => {
      if (!response.data) {
        return {};
      }
      if (typeof formatResult === 'function') {
        return formatResult(response.data);
      }
      return response.data;
    },
    onSuccess: (reslut) => {
      details(reslut);
      setFindData(formatDetail(reslut));
    }
  });

  const saveURI = value ? api.save : api.add;
  // 提交数据
  const {run: save, loading: saveLoad} = useRequest(saveURI, {
    manual: true,
    formatResult: (response) => {
      return response;
    },
    onSuccess: (result) => {
      onSuccess(result);
    },
    onError: (error) => {
      // message.error(error.message);
      onError(error);
    }
  });

  useEffect(() => {
    loading(saveLoad);
  }, [saveLoad]);


  if (!formActions) {
    formActions = formActionsPublic;
  }


  const getFormState = async () => {
    const res = await new Promise((resolve) => {
      formActions.getFormState().then((value) => {
        resolve(value);
      });
    });
    return res.values;
  };

  const setFormState = (value) => {
    setFindData(undefined);
    setTimeout(() => {
      setFindData(value);
    }, 0);
  };

  useImperativeHandle(ref, () => ({
    ...formActions,
    getFormState,
    setFormState,
    refresh,
  }));

  useEffect(() => {
    if (value) {
      if (!fieldKey) {
        throw new Error('Table component: fieldKey cannot be empty,But now it doesn\'t exist!');
      }
      find({params: key, data: key});
    } else if (value === false) {
      setFindData({});
    }
    return () => {
      setFindData(undefined);
    };
  }, []);

  // || value===null || typeof value==='undefined'
  if (findLoad) {
    return (
      <SkeletonForm />
    );
  }

  return findData && <FormilyForm
    style={{margin: 'auto', height: '100%', ...formStyle}}
    actions={formActions}
    labelAlign={labelAlign}
    layout="horizontal"
    value={defaultValue}
    className={`${style.formWarp} ${className || ''}`}
    labelCol={labelCol !== undefined ? labelCol : 6}
    wrapperCol={wrapperCol || 15}
    onSubmit={async (values) => {
      const submitValues = onSubmit(values);
      if (submitValues === false) {
        return false;
      }
      return await save(
        {
          data: {
            ...submitValues,
            ...key
          }
        }
      );
    }}
    initialValues={{...findData, ...initialValues}}
    {...props}
  >
    {children}

    {!noButton && <FormButtonGroup offset={11} className={boxShadow && style.bottom}>
      <Submit showLoading>保存</Submit>
      <Reset>重置</Reset>
      <Draft
        type={formType}
        getValues={async () => {
          return await getFormState();
        }}
        onChange={(value) => {
          setFormState(value);
        }}
      />
    </FormButtonGroup>}
  </FormilyForm>;
};

const Form = forwardRef(FormWrapper);

Form.FormItem = AntFormItem;

export default Form;
