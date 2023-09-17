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
  // echart如何使用：http://www.it028.com/echarts-setup.html
  // 功能6-3：首页-薪资趋势-折线图绘制
  renderYearChart(year);
  // 功能6-4：首页-薪资分布-饼状图绘制
  renderSalaryChart(salaryData);
  // 功能6-5：首页-分组薪资-柱状图绘制
  renderGroupChart(groupData);
  // 功能6-6：首页-男女薪资分布-饼状图绘制
  renderSalaryPieChart(salaryData);
  // 功能6-7：首页-籍贯分布-地图绘制
  renderMapChart(provinceData);
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

function renderSalaryChart(salaryData) {
  // console.log("薪资分布数据", salaryData);
  const myChart = echarts.init(document.querySelector("#salary"));
  const option = {
    title: {
      text: "班级薪资分布",
      left: "5%",
      top: "5%",
    },
    tooltip: {
      trigger: "item",
    },
    // 图例组件
    legend: {
      bottom: "5%",
      left: "center",
    },
    // 颜色列表
    color: ["#FDA224", "#5097FF", "#3ABCFA", "#34D39A"],
    // 系列
    series: [
      {
        // 系列名称，在提示框中显示
        name: "薪资",
        // 系列类型，pie饼状图
        type: "pie",
        radius: ["55%", "70%"],
        // 避免标签间相互折叠覆盖
        avoidLabelOverlap: true,
        // 系列数据
        data: salaryData.map((ele) => {
          return {
            name: ele.label,
            value: ele.g_count + ele.b_count,
          };
        }),
        // 系列项样式
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 4,
        },
        // 高亮样式，鼠标悬停时的样式
        emphasis: {
          label: {
            show: false,
            fontSize: 40,
            fontWeight: "bold",
          },
        },
        // 标签
        label: {
          show: false,
          position: "outside",
        },
        // 标签线
        labelLine: {
          // 显示标签线（仅在label-outside下生效）
          show: false,
        },
      },
    ],
  };
  myChart.setOption(option);
}

function renderGroupChart(groupData) {
  // console.log("分组薪资数据", groupData);
  const myChart = echarts.init(document.querySelector("#lines"));
  const option = {
    tooltip: {
      show: true,
    },
    grid: {
      left: 70,
      top: 30,
      right: 30,
      bottom: 50,
    },
    xAxis: {
      type: "category",
      data: groupData["1"].map((ele) => ele.name),
      axisLine: {
        lineStyle: {
          color: "#d1d1d1",
          type: "dashed",
        },
      },
      axisLabel: {
        color: "#999",
      },
    },
    yAxis: {
      type: "value",
      splitLine: {
        lineStyle: {
          type: "dashed",
        },
      },
      axisLine: {
        lineStyle: {
          color: "#d1d1d1",
        },
      },
    },
    series: [
      {
        name: "期望薪资",
        data: groupData["1"].map((ele) => ele.hope_salary),
        type: "bar",
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#34D39A", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(52,211,154,0.2)", // 100% 处的颜色
              },
            ],
          },
        },
      },
      {
        name: "实际薪资",
        data: groupData["1"].map((ele) => ele.salary),
        type: "bar",
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#499FEE", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(73,159,238,0.2)", // 100% 处的颜色
              },
            ],
          },
        },
      },
    ],
  };
  myChart.setOption(option);

  // 动态切换
  const btnGroup = document.querySelector("#btns");
  btnGroup.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON") {
      // 切换按钮
      btnGroup.querySelector(".btn-blue").classList.remove("btn-blue");
      e.target.classList.add("btn-blue");
      // 切换数据
      const i = e.target.innerText;
      option.xAxis.data = groupData[i].map((ele) => ele.name);
      option.series[0].data = groupData[i].map((ele) => ele.hope_salary);
      option.series[1].data = groupData[i].map((ele) => ele.salary);
      myChart.setOption(option);
    }
  });
}

function renderSalaryPieChart(salaryData) {
  // console.log("男女薪资分布数据", salaryData);
  const myChart = echarts.init(document.querySelector("#gender"));
  const option = {
    // 设置多个标题，在不同位置上
    title: [
      {
        text: "男女薪资分布",
        left: "5%",
        top: "5%",
        textStyle: {
          fontSize: 16,
        },
      },
      {
        text: "男生",
        left: "50%",
        top: "45%",
        textAlign: "center",
        textStyle: {
          fontSize: 12,
        },
      },
      {
        text: "女生",
        left: "50%",
        top: "85%",
        textAlign: "center",
        textStyle: {
          fontSize: 12,
        },
      },
    ],
    tooltip: {
      trigger: "item",
    },
    color: ["#FDA224", "#5097FF", "#3ABCFA", "#34D39A"],
    series: [
      {
        type: "pie",
        radius: ["20%", "30%"],
        // 饼图的中心（圆心）坐标
        center: ["50%", "30%"],
        data: salaryData.map((ele) => {
          return {
            name: ele.label,
            value: ele.b_count,
          };
        }),
      },
      {
        type: "pie",
        radius: ["20%", "30%"],
        // 饼图的中心（圆心）坐标
        center: ["50%", "70%"],
        data: salaryData.map((ele) => {
          return {
            name: ele.label,
            value: ele.g_count,
          };
        }),
      },
    ],
  };
  myChart.setOption(option);
}

function renderMapChart(provinceData) {
  console.log("籍贯分布数据", provinceData);
  // 待渲染的数据
  const dataList = [
    { name: "南海诸岛", value: 0 },
    { name: "北京", value: 0 },
    { name: "天津", value: 0 },
    { name: "上海", value: 0 },
    { name: "重庆", value: 0 },
    { name: "河北", value: 0 },
    { name: "河南", value: 0 },
    { name: "云南", value: 0 },
    { name: "辽宁", value: 0 },
    { name: "黑龙江", value: 0 },
    { name: "湖南", value: 0 },
    { name: "安徽", value: 0 },
    { name: "山东", value: 0 },
    { name: "新疆", value: 0 },
    { name: "江苏", value: 0 },
    { name: "浙江", value: 0 },
    { name: "江西", value: 0 },
    { name: "湖北", value: 0 },
    { name: "广西", value: 0 },
    { name: "甘肃", value: 0 },
    { name: "山西", value: 0 },
    { name: "内蒙古", value: 0 },
    { name: "陕西", value: 0 },
    { name: "吉林", value: 0 },
    { name: "福建", value: 0 },
    { name: "贵州", value: 0 },
    { name: "广东", value: 0 },
    { name: "青海", value: 0 },
    { name: "西藏", value: 0 },
    { name: "四川", value: 0 },
    { name: "宁夏", value: 0 },
    { name: "海南", value: 0 },
    { name: "台湾", value: 0 },
    { name: "香港", value: 0 },
    { name: "澳门", value: 0 },
  ];
  // 处理待渲染的数据
  dataList.forEach((ele) => {
    // 找到包含name的对应对象，把value赋给它
    const p = provinceData.find((v) => v.name.includes(ele.name));
    p && (ele.value = p.value);
  });
  // console.log(dataList);

  const myChart = echarts.init(document.querySelector("#map"));
  const option = {
    title: {
      text: "籍贯分布",
      top: "5%",
      left: "5%",
      textStyle: {
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} 位学员",
      borderColor: "transparent",
      backgroundColor: "rgba(0,0,0,0.5)",
      textStyle: {
        color: "#fff",
      },
    },
    visualMap: {
      min: 0,
      max: 6,
      left: "left",
      bottom: "20",
      text: ["6", "0"],
      inRange: {
        color: ["#ffffff", "#0075F0"],
      },
      show: true,
      left: 40,
    },
    geo: {
      map: "china",
      roam: false,
      zoom: 1.0,
      label: {
        normal: {
          show: true,
          fontSize: "10",
          color: "rgba(0,0,0,0.7)",
        },
      },
      itemStyle: {
        normal: {
          borderColor: "rgba(0, 0, 0, 0.2)",
          color: "#e0ffff",
        },
        emphasis: {
          areaColor: "#34D39A",
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowBlur: 20,
          borderWidth: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
    series: [
      {
        name: "籍贯分布",
        type: "map",
        geoIndex: 0,
        data: dataList,
      },
    ],
  };
  myChart.setOption(option);
}
