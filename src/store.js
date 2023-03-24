import {createStore} from 'ice';
import user from './models/userInfo';
import dataSource from './models/dataSource';
import table from './models/table';

const store = createStore({user, dataSource, table});

export default store;
