import React, {useState, useImperativeHandle, useEffect} from 'react';
import {Marker} from 'react-amap';
import {Button, Card, Cascader as AntCascader, Input, List, Popover, Space} from 'antd';
import {useRequest} from '@/util/Request';
import store from '@/store';
import {isArray} from '@/util/Tools';

let MSearch = null;
let Geocoder = null;

const AmapSearch = ({
  value: defaultValue = [],
  __map__,
  onChange = () => {
  },
  center
}, ref) => {

  const [data] = store.useModel('dataSource');

  const [city, setCity] = useState({});

  const [visiable, setVisiable] = useState();

  const [adinfo, setadinfo] = useState({
    location: defaultValue.length > 0 ? [
      defaultValue[0],
      defaultValue[1],
    ] : [],
  });
  const [reslut, setResult] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(defaultValue.length > 0 ? {
    lng: defaultValue[0],
    lat: defaultValue[1],
  } : null);


  const {run: runCisy} = useRequest({url: '/commonArea/list', method: 'POST'}, {manual: true});


  // console.log(window.AMap);
  window.AMap.plugin(['AMap.PlaceSearch'], function () {
    const PlaceSearchOptions = { // 设置PlaceSearch属性
      city: city && city.city, // 城市
      type: '', // 数据类别
      pageSize: 10, // 每页结果数,默认10
      pageIndex: 1, // 请求页码，默认1
      extensions: 'all' // 返回信息详略，默认为base（基本信息）
    };
    MSearch = new window.AMap.PlaceSearch(PlaceSearchOptions); // 构造PlaceSearch类
    window.AMap.Event.addListener(MSearch, 'complete', (result) => {
      setResult(result.poiList);
    }); // 返回结果
  });
  window.AMap.plugin(['AMap.Geocoder'], function () {
    Geocoder = new window.AMap.Geocoder({
      // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
      city: '',
    });
  });

  // const MSearch = new __map__.PlaceSearch();
  // console.log(MSearch);


  const setData = (value) => {
    setMarkerPosition(value.location);
    __map__.setCenter(value.location);
  };

  useImperativeHandle(ref, () => ({
    setCenter: (is) => {
      const value = __map__.getCenter();
      setMarkerPosition(value);
      if (is) {
        const lnglat = [value.lng, value.lat];
        Geocoder.getAddress(lnglat, function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            const position = result.regeocode.addressComponent || {};
            // result为对应的地理位置详细信息
            const m = {
              address: result.regeocode.formattedAddress,
              name: '',
              location: [value.lng, value.lat],
              city: position.district || position.city || position.province
            };
            setadinfo(m);
            setCity(position.city);
          }
        });
      }
    }
  }));


  useEffect(() => {
    if (isArray(defaultValue).length > 0) {
      return;
    }
    window.AMap.plugin('AMap.CitySearch', function () {
      const citySearch = new window.AMap.CitySearch();
      citySearch.getLocalCity((status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          Geocoder.getLocation(result.city, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              const position = result.geocodes[0].addressComponent || {};
              setadinfo({
                address: position.province + position.city,
                location: [result.geocodes[0].location.lng, result.geocodes[0].location.lat],
                city: position.district || position.city || position.province
              });
              center(
                {
                  lat: result.geocodes[0].location.lat,
                  lgn: result.geocodes[0].location.lng
                }
              );
              setMarkerPosition({
                lat: result.geocodes[0].location.lat,
                lng: result.geocodes[0].location.lng
              });
              // result中对应详细地理坐标信息
            }
          });
          // 查询成功，result即为当前所在城市信息
          setCity(result);
        }
      });
    });
  }, []);

  const children = (data) => {
    if (!Array.isArray(data))
      return [];
    return data.map((item) => {
      return {
        value: item.value,
        label: item.label,
        children: children(item.children),
      };
    });
  };


  return (
    <div
      style={{position: 'absolute', top: 0, padding: 10, width: '100%'}}
    >
      <span style={{paddingLeft: 10}}>{city &&
      <AntCascader
        placeholder='请选择省市区地址'
        changeOnSelect
        style={{minWidth: 250, marginRight: 10}}
        showSearch={(inputValue, path) => {
          path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
        }}
        options={children(data && data.area)}
        onChange={async (value, options) => {
          let cityId = null;
          value.length > 0 && value.map((items, index) => {
            return cityId = items;
          });
          const city = await runCisy({
            data: {
              id: cityId
            }
          });
          setCity({
            city: options && options[options.length - 1] && options[options.length - 1].label
          });
          Geocoder.getLocation(city.length > 0 && city[0].title, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              const position = result.geocodes[0].addressComponent || {};
              setadinfo({
                address: position.province + position.city,
                location: [result.geocodes[0].location.lng, result.geocodes[0].location.lat],
                city: position.district || position.city || position.province
              });
              center(
                {
                  lat: result.geocodes[0].location.lat,
                  lgn: result.geocodes[0].location.lng
                }
              );
              setMarkerPosition({
                lat: result.geocodes[0].location.lat,
                lng: result.geocodes[0].location.lng
              });
              // result中对应详细地理坐标信息
            }
          });
        }} />}</span>
      <Popover onOpenChange={(visible) => {
        setVisiable(visible);
      }} placement="bottom" content={reslut && reslut.count > 0 &&
      <Card style={{maxHeight: '50vh', minWidth: 500, overflowY: 'auto', marginTop: 16}}>
        <List>
          {reslut.pois.map((item, index) => {
            return (<List.Item key={index} style={{cursor: 'pointer'}} onClick={() => {
              const m = {
                address: item.address,
                location: [item.location.lng, item.location.lat],
                city: item.adname || item.cityname || item.pname
              };
              setadinfo(m);
              setData(item);
            }} extra={<Button type="primary" onClick={() => {
              const location = {
                address: item.pname + item.cityname + item.address,
                location: [item.location.lng, item.location.lat],
                city: item.cityname || item.pname
              };
              onChange(location);
              setVisiable(false);
            }}>使用该地址</Button>}>
              <Space direction="vertical">
                <div>
                  {item.name}
                </div>
                <div>
                  {item.address}
                </div>
                <div>
                  {item.type}
                </div>
              </Space>
            </List.Item>);
          })}
        </List>
      </Card>} open={visiable}>
        <Input
          placeholder="搜索地点"
          onChange={(value) => {
            MSearch.search(value.target.value);
            setVisiable(true);
          }}
          style={{width: 'auto', marginRight: 20}}
        />
      </Popover>
      <Button
        type="primary"
        onClick={() => {
          onChange(adinfo);
        }}>确定</Button>
      {markerPosition && <Marker position={markerPosition} __map__={__map__} />}
    </div>
  );

};

export default React.forwardRef(AmapSearch);
