import React from 'react';
import {Button} from 'antd';
import {useHistory} from 'ice';
import Icon from '@/components/Icon';

const BackButton = (
  {
    url,
  }
) => {

  const history = useHistory();

  return <>
    <Button onClick={() => {
      url ? history.push(url) : history.goBack();
    }}><Icon type="icon-huifu" />返回</Button>
  </>;
};

export default BackButton;
