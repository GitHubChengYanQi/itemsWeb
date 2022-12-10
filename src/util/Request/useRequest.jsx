import {useRequest as ahooksRequest} from 'ahooks';
import Service from '@/util/Service';

const useRequest = (config, options) => {
  const {ajaxService} = Service();

  const requestService = (params) => {
    return params || {};
  };

  const formatResult = (response) => {
    if (typeof response.data === 'undefined' || options && options.response) {
      return response;
    }
    return response.data;
  };

  return ahooksRequest(requestService, {
    requestMethod: (params) => {
      return ajaxService({
        ...config,
        ...params
      });
    },
    onError: (result) => {
      console.log(result);
      // if (parseInt(result.errCode, 0) === 1502) {
      //   history.push("/login");
      // }
    },
    formatResult,
    ...options,
  });
};
export default useRequest;
