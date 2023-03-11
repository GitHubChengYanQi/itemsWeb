import React from 'react';
import {Link} from 'react-router';
import {Breadcrumb as AntBreadcrumb, Button} from 'antd';
import {useHistory, useRouteMatch} from 'ice';
import routes from '@/routes';
import store from '@/store';

const itemRender = (route, params, routes, paths) => {


  const last = routes.indexOf(route) === routes.length - 1;
  const name = route.name ? route.name : 'name';
  // console.log(route, paths);
  return last ? (
    <span>{name}</span>
  ) : (
    <span>{name}</span>
    // null
    // <Link to={paths.join('/')}>{name}</Link>
  );
};

const getRoute = (path, routes) => {
  if (!Array.isArray(routes)) {
    return [];
  }
  for (let i = 0; i < routes.length; i++) {
    if (`${routes[i].path}` === `${path}`) {
      return [routes[i]];
    }
    if (Array.isArray(routes[i].children) && routes[i].children.length > 0) {
      const values = getRoute(path, routes[i].children);
      if (values.length > 0) {
        return [{
          ...routes[i],
          children: null
        }, ...values];
      }
    }
  }
  return [];
};

const Breadcrumb = ({title}) => {

  const history = useHistory();

  const match = useRouteMatch();

  const routesArray = getRoute(match.path, routes);

  const [userInfo] = store.useModel('user');

  return (
    <div>
      <AntBreadcrumb style={{lineHeight: '32px'}}>
        {
          routesArray.map((item, index) => {
            if (index === 0) {
              return <AntBreadcrumb.Item key={index}>
                <a onClick={() => {
                  history.push('/');
                }}>{userInfo.abbreviation || 'Home'}</a>
              </AntBreadcrumb.Item>;
            }
            return (item.name && <AntBreadcrumb.Item key={index}>
              <a onClick={() => {
                history.push(item.path);
              }}>{item.name}</a>
            </AntBreadcrumb.Item>);
          })
        }
        {title && <AntBreadcrumb.Item key={title}>{title}</AntBreadcrumb.Item>}
      </AntBreadcrumb>
      <h1 style={{margin: '-4px 0 8px', fontSize: 21}}>
        {title || routesArray[routesArray.length - 1].name}
      </h1>
    </div>
  );

};

export default Breadcrumb;

