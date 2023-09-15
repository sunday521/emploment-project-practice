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
  try {
    const res = await axios({
      url: "/dashboard",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    // console.log(res.data.data);
    const { groupData, overview, provinceData, salaryData, year } =
      res.data.data;
    // 功能6-1：渲染概览数据
    renderOverview(overview);
  } catch (err) {
    console.dir(err.response.data);
  }
}

getData();

function renderOverview(overview) {
  // 观察到类名和保存值的变量全部一致，因此可以循环渲染
  // console.log(overview);
  Object.keys(overview).forEach((key) => {
    document.querySelector(`.${key}`).innerHTML = overview[key];
  });
}
