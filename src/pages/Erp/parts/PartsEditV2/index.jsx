import React from 'react';
import {useSearchParams} from 'ice';
import PartsEdit from '@/pages/Erp/parts/PartsEdit';
import {Title} from '@/components/Table';

const PartsEditV2 = () => {

  const searchParams = useSearchParams();

  return <>
    <Title title={`${searchParams.id ? '编辑' : '添加'}物料清单`} />
    <PartsEdit value={searchParams.id || false} />
  </>;
};

export default PartsEditV2;
