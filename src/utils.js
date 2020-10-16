function getDebx(totalM, rate, totalY) {
  let monthRate = rate / 100 / 12;
  let totalMonth = totalY * 12;
  return (
    (totalM * (monthRate * (1 + monthRate) ** totalMonth)) /
    ((1 + monthRate) ** totalMonth - 1)
  ).toFixed(2);
}
// 获取等额本金第一个月还款
function getFirstMonthDebj(totalM, rate, totalY) {
  let monthRate = rate / 100 / 12;
  let totalMonth = totalY * 12;
  return (totalM / totalMonth + totalM * monthRate).toFixed(2);
}

// 获取等额本金每个月递减金额
function getDebjDetla(totalM, rate, totalY) {
  let monthRate = rate / 100 / 12;
  let totalMonth = totalY * 12;
  return ((totalM / totalMonth) * monthRate).toFixed(2);
}

// 利滚利
let json = []
function getMoneyCompound(r, t, debj, debx, delta) {
  let total = 0;
  for (let i = 0; i < t * 12; i++) {
    let curDebj = debj - delta * i;
    let realM = (curDebj - debx).toFixed(2);
    console.log(`第${i + 1}月省下`, realM);
    let curM = (realM * (1 + r / 12) ** (t * 12 - i - 1)).toFixed(2);
    let earnM = (curM - realM).toFixed(2);
    console.log(
      `连本带利继续定投${t * 12 - i - 1}月，总共 赚 ${earnM} 利息`
    );
    total += earnM * 1;
    json.push({
      title: '等额本息',
      date: i+1,
      value: Math.round(debx * 1)
    })
    json.push({
      title: '等额本金',
      date: i+1,
      value: Math.round(curDebj* 1)
    })
    json.push({
      title: '当月少交银行金额',
      date: i+1,
      value: Math.round(realM* 1)
    })
    json.push({
      title: '少交银行金额产生定投利息',
      date: i+1,
      value: Math.round(earnM * 1)
    })
  }
  return total;
}

// function
export default function compute(values) {
  const totalMoney = values.totalMoney * 10000; // 贷款总额 单位 元
  const MortgageInterest = values.mortgageInterest * 1; // 贷款利息 单位 %
  const totalYear = values.totalYear * 1; // 借贷年数
  const rate = values.rate * 1; // 投资利息 单位 %

  const debx = getDebx(totalMoney, MortgageInterest, totalYear);
  const debj = getFirstMonthDebj(totalMoney, MortgageInterest, totalYear);
  const delta = getDebjDetla(totalMoney, MortgageInterest, totalYear);
  let debxTotal = debx * totalYear * 12;
  let debjTotal =
    ((debj * 1 + (debj - (12 * totalYear - 1) * delta)) *
      totalYear *
      12) /
    2;
  let debxTouzhi = getMoneyCompound(rate / 100, totalYear, debj, debx, delta, json);
  let text = `
    基础信息：
    贷款期限 ${totalYear} 年 
    等额本息： 需要每月还${debx}, 还款总额为 ${debxTotal}；
    等额本金： 需要第一月还${debj} 每月递减 ${delta}， 还款总额为 ${debjTotal.toFixed(2)}。
    利滚利定投：
    投资利率 ${rate}%
    等额本息 去掉 等额本金后期投资(机会成本) 共赚取 ${debxTouzhi.toFixed(2)} 定投利息；
    等额本金比等额本息少交利息 ${(debxTotal - debjTotal).toFixed(2)}；
    个人总收益  ${(debxTouzhi - (debxTotal - debjTotal)).toFixed(2)}
  `
  document.querySelector("#code").innerHTML = text
  console.log(text)
  return json
};
