// 功能3：首页-页面访问控制
// 只有已登录（本地缓存有token）的用户才能够访问首页
checkLogin();

// 功能4：首页-用户名渲染
// 直接读取本地缓存中的用户名
renderUsername();

// 功能5：首页-退出登录
// 先清除本地缓存中的用户数据，然后跳转到登录页
logout();

// 功能6：首页-获取统计数据（接口权限控制）
// 这个接口比较特殊，要求请求头携带用户token才能成功调用
// 如果用户token失效（过期或被篡改），需要重新登录
async function getData() {
  const res = await axios({
    url: "/dashboard",
  });
  console.log(res.data);
  const { groupData, overview, provinceData, salaryData, year } = res.data;
  // 功能6-1：首页-渲染概览数据
  renderOverview(overview);
  // 功能6-3：首页-薪资趋势-折线图绘制
  renderYearChart(year);
  //   try {
  //   } catch (err) {
  //     // 功能6-2：首页-登录状态失效处理
  //     // 当请求头中的token失效时（响应状态码401），阻止用户获取数据，清空本地缓存中的用户数据，并让其重新登录
  //     console.dir(err.response);
  //     if (err.response.status === 401) {
  //       localStorage.removeItem("username");
  //       localStorage.removeItem("token");
  //       showToast("登录状态已过期，请重新登录！");
  //       setTimeout(() => {
  //         location.href = "./login.html";
  //       }, 1500);
  //     }
  //   }
}

getData();

function renderOverview(overview) {
  // 观察到类名和保存值的变量全部一致，因此可以循环渲染
  // console.log(overview);
  Object.keys(overview).forEach((key) => {
    document.querySelector(`.${key}`).innerHTML = overview[key];
  });
}

function renderYearChart(year) {
  // console.log('薪资数据',year);
  const myChart = echarts.init(document.querySelector("#line"));
  const option = {
    // 标题组件
    title: {
      text: "2023全学科薪资走势",
      left: "5%",
      top: "5%",
    },
    // 提示框组件
    tooltip: {
      show: true,
      // 触发时机：item数据项触发（默认），axis坐标轴触发
      trigger: "axis",
    },
    // 网格区域
    grid: {
      // 网格区域-距离容器上边的距离
      top: "20%",
    },
    // X轴
    xAxis: {
      // X轴-坐标轴类型
      type: "category",
      // X轴-坐标轴数据
      data: year.map((ele) => ele.month),
      // X轴-坐标轴线样式
      axisLine: {
        lineStyle: {
          color: "#d1d1d1",
          type: "dashed",
        },
      },
    },
    // Y轴
    yAxis: {
      type: "value",
      // Y轴-分割线样式
      splitLine: {
        lineStyle: {
          type: "dashed",
        },
      },
      // Y轴-坐标轴线样式
      axisLine: {
        lineStyle: {
          color: "#d1d1d1",
        },
      },
    },
    // 系列（一个系列为一组）
    series: [
      {
        // 系列-系列类型（形状）
        type: "line",
        // 系列-系列数据
        data: year.map((ele) => ele.salary),
        // 系列-线样式
        lineStyle: {
          width: 4,
          // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                // 0% 处的颜色
                offset: 0,
                color: "#499FEE",
              },
              {
                // 100% 处的颜色
                offset: 1,
                color: "#597CEF",
              },
            ],
            global: false, // 缺省为 false
          },
        },
        // 系列-线平滑显示
        smooth: true,
        // 系列-标记的大小
        symbolSize: 10,
        // 系列-区域填充样式
        areaStyle: {
          // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                // 0% 处的颜色
                offset: 0,
                color: "#499FEE",
              },
              {
                // 100% 处的颜色
                offset: 1,
                color: "#fff",
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
    ],
  };
  myChart.setOption(option);
}
