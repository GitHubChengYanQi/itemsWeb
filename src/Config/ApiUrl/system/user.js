export const userAdd = {
  url: '/rest/mgr/add',
  method: 'POST',
};
export const userSave = {
  url: '/rest/mgr/edit',
  method: 'POST',
};
export const userRemove = {
  url: '/mgr/delete',
  method: 'POST',
};

export const userInfo = {
  url: '/rest/mgr/getMyInfo',
  method: 'POST',
};
export const changePwd = {
  url: '/rest/mgr/changePwd',
  method: 'POST',
};

export const getUserInfo = {
  url: '/rest/mgr/getUserInfo',
  method: 'POST',
  rowKey: 'userId'
};

export const userList = {
  url: '/rest/mgr/list',
  method: 'POST',
};

export const userRoleSave = {
  url: '/rest/mgr/setRole',
  method: 'POST',
};

export const userReset = {
  url: '/rest/mgr/reset',
  method: 'POST',
};
export const userFreeze = {
  url: '/rest/mgr/freeze',
  method: 'POST',
};
export const userUnfreeze = {
  url: '/rest/mgr/unfreeze',
  method: 'POST',
};


export const userSelect = {
  url: '/rest/mgr/Select',
  method: 'POST'
};
