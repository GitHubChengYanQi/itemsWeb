import React from 'react';
import store from '@/store';


const Test = () => {

  const [dataSource] = store.useModel('dataSource');

  const tdStyle = {
    textAlign: 'center',
    padding: 4
  };

  return <div>
    <div style={{
      width: 670,
      margin: '0 auto',
      paddingTop: 18,
      fontWeight: 'bold'
    }}>
      <div
        style={{padding: '0 10%'}}
      >
        <h2 style={{
          textAlign: 'center',
          borderBottom: 'solid 1px #000',
          fontWeight: 'bold'
        }}>
          {dataSource?.publicInfo?.enterprise || ''}
        </h2>
        <h2 style={{
          textAlign: 'center',
          borderBottom: 'solid 1px #000',
          fontWeight: 'bold'
        }}>
          订货卡片
        </h2>
      </div>
      <table
        border={1}
        style={{
          width: '100%',
          borderSpacing: 1,
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
        }}
      >
        <tbody>
        <tr>
          <td style={tdStyle} colSpan={1} rowSpan={3}>编号</td>
          <td style={tdStyle} colSpan={2} rowSpan={1}>卡片编号</td>
          <td style={tdStyle} colSpan={3} rowSpan={1}>T515DD230214135</td>
          <td style={tdStyle} colSpan={1} rowSpan={3}>产品</td>
          <td style={tdStyle} colSpan={2} rowSpan={1}>产品名称</td>
          <td style={tdStyle} colSpan={3} rowSpan={1}>普通车床</td>
        </tr>
        <tr>
          <td style={tdStyle} colSpan={2} rowSpan={1}>合同编号</td>
          <td style={tdStyle} colSpan={3} rowSpan={1}>HH-CA-T5-230214</td>
          <td style={tdStyle} colSpan={2} rowSpan={1}>产品型号</td>
          <td style={tdStyle} colSpan={3} rowSpan={1}>T5</td>
        </tr>
        <tr>
          <td style={tdStyle} colSpan={2} rowSpan={1}>机床编号</td>
          <td style={tdStyle} colSpan={3} rowSpan={1}>T515DD2303007</td>
          <td style={tdStyle} colSpan={2} rowSpan={1}>产品规格</td>
          <td style={tdStyle} colSpan={3} rowSpan={1}>中500X1500 mm</td>
        </tr>
        <tr>
          <td style={tdStyle} colSpan={3} rowSpan={1}>订货日期</td>
          <td style={tdStyle} colSpan={3} rowSpan={1}>2023年01月19 日</td>
          <td style={tdStyle} colSpan={3} rowSpan={1}>交货日期</td>
          <td style={tdStyle} colSpan={3} rowSpan={1}>2023年03月31日</td>
        </tr>
        <tr>
          <td style={tdStyle} colSpan={3} rowSpan={1}>订货单位</td>
          <td style={tdStyle} colSpan={9} rowSpan={1}>加拿大STANKO公司</td>
        </tr>
        <tr>
          <td style={tdStyle} colSpan={3} rowSpan={1}>项目</td>
          <td style={tdStyle} colSpan={3} rowSpan={1}>本机配置</td>
          <td style={tdStyle} colSpan={3} rowSpan={1}>项目</td>
          <td style={tdStyle} colSpan={3} rowSpan={1}>本机配置</td>
        </tr>
        <tr>
          <td style={tdStyle} colSpan={3} rowSpan={1}>开机界面</td>
          <td style={tdStyle} colSpan={3} rowSpan={1}>STANKO界面</td>
          <td style={tdStyle} colSpan={3} rowSpan={1}>机床床身</td>
          <td style={tdStyle} colSpan={3} rowSpan={1}>无马鞍</td>
        </tr>
        <tr>
          <td style={tdStyle} colSpan={3} rowSpan={1}>开机界面</td>
          <td style={tdStyle} colSpan={3} rowSpan={1}>STANKO界面</td>
          <td style={tdStyle} colSpan={3} rowSpan={1}>机床床身</td>
          <td style={tdStyle} colSpan={3} rowSpan={1}>无马鞍</td>
        </tr>
        <tr>
          <td style={tdStyle} colSpan={3} rowSpan={1}>开机界面</td>
          <td style={tdStyle} colSpan={3} rowSpan={1}>STANKO界面</td>
          <td style={tdStyle} colSpan={3} rowSpan={1}>机床床身</td>
          <td style={tdStyle} colSpan={3} rowSpan={1}>无马鞍</td>
        </tr>
        <tr>
          <td style={tdStyle} colSpan={3} rowSpan={1}>开机界面</td>
          <td style={tdStyle} colSpan={3} rowSpan={1}>STANKO界面</td>
          <td style={tdStyle} colSpan={3} rowSpan={1}>机床床身</td>
          <td style={tdStyle} colSpan={3} rowSpan={1}>无马鞍</td>
        </tr>
        <tr>
          <td style={tdStyle} colSpan={3} rowSpan={1}>卡盘形式</td>
          <td style={tdStyle} colSpan={9} rowSpan={1}>K11-315/D11;通孔中104，正安装在机床上</td>
        </tr>
        <tr>
          <td style={tdStyle} colSpan={3} rowSpan={1}>机床防护</td>
          <td style={tdStyle} colSpan={9} rowSpan={1}>卡盘架/丝杠/后防护/接水盘</td>
        </tr>
        <tr>
          <td style={tdStyle} colSpan={3} rowSpan={1}>随机附件</td>
          <td style={tdStyle} colSpan={9} rowSpan={1}>
            附件箱、死顶尖 MT5、钥匙 2 把、度检验单、装箱单、电气原理图、U盘、卡盘扳手、地脚螺栓 M16*260 数量6个、平垫中16数量6个螺母 M16 数量6个卡盘自带反爪3 件快换刀夹50/41]数量3
            个、快换刀夹 540/422 数量 1个、快换刀架扳手数量2个
          </td>
        </tr>
        <tr>
          <td style={tdStyle} colSpan={1} rowSpan={3}>特殊配置</td>
          <td style={tdStyle} colSpan={2} rowSpan={1}>名称</td>
          <td style={tdStyle} colSpan={3} rowSpan={1}>规格</td>
          <td style={tdStyle} colSpan={1} rowSpan={1}>数量</td>
          <td style={tdStyle} colSpan={2} rowSpan={1}>名称</td>
          <td style={tdStyle} colSpan={2} rowSpan={1}>规格</td>
          <td style={tdStyle} colSpan={1} rowSpan={1}>数量</td>
        </tr>
        <tr>
          <td style={tdStyle} colSpan={2} rowSpan={1}>跟刀架</td>
          <td style={tdStyle} colSpan={3} rowSpan={1}>中20-80mm</td>
          <td style={tdStyle} colSpan={1} rowSpan={1}>1套</td>
          <td style={tdStyle} colSpan={2} rowSpan={1}>跟刀架</td>
          <td style={tdStyle} colSpan={2} rowSpan={1}>中20-80mm</td>
          <td style={tdStyle} colSpan={1} rowSpan={1}>1套</td>
        </tr>
        <tr>
          <td style={tdStyle} colSpan={2} rowSpan={1}>跟刀架</td>
          <td style={tdStyle} colSpan={3} rowSpan={1}>中20-80mm</td>
          <td style={tdStyle} colSpan={1} rowSpan={1}>1套</td>
          <td style={tdStyle} colSpan={2} rowSpan={1}>跟刀架</td>
          <td style={tdStyle} colSpan={2} rowSpan={1}>中20-80mm</td>
          <td style={tdStyle} colSpan={1} rowSpan={1}>1套</td>
        </tr>
        <tr>
          <td style={tdStyle} colSpan={3} rowSpan={1}>特殊要求</td>
          <td style={tdStyle} colSpan={9} rowSpan={1}>
            1.机床装配好后，解体发货;
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>;
};


export default Test;
