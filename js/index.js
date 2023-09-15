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
  const { groupData, overview, provinceData, salaryData, year } = res.data.data;
  // 功能6-1：首页-渲染概览数据
  renderOverview(overview);
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
