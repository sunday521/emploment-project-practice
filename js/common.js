// 配置axios基地址
axios.defaults.baseURL = "https://hmajax.itheima.net";

// 测试是否正常使用
// axios({
//   url: "/register",
//   method: "POST",
//   data: {
//     username: "evannotfound666",
//     password: "123456",
//   },
// }).then((res) => {
//   console.log(res.data);
// });

// 抽取轻提示函数
function showToast(msg) {
  const myToast = new bootstrap.Toast(document.querySelector(".my-toast"));
  document.querySelector(".toast-body").innerHTML = msg;
  myToast.show();
}

// 测试是否正常使用
// showToast("注册成功！");

// 检测用户是否已登录
function checkLogin() {
  const token = localStorage.getItem("token");
  // 如果用户没有登录，提示用户，然后跳转到登录页
  if (!token) {
    showToast("请先登录！");
    setTimeout(() => {
      location.href = "./login.html";
    }, 1500);
  }
}

// 用户名渲染
function renderUsername() {
  document.querySelector(".username").innerHTML =
    localStorage.getItem("username") || "未知用户";
}

// 退出登录
function logout() {
  document.querySelector("#logout").addEventListener("click", function () {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    showToast("退出成功！");
    setTimeout(() => {
      location.href = "./login.html";
    }, 1500);
  });
}

// 功能7：axios拦截器配置
// 将请求和响应的公共逻辑配置在axios拦截器中，简化代码
// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // 功能7-1：请求拦截器-统一添加token
    // console.dir(config);
    const token = localStorage.getItem("token");
    token && (config.headers["Authorization"] = token);
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 功能7-2：响应拦截器-数据剥离
    // 2xx 范围内的状态码都会触发该函数
    // 在响应返回前，去掉一层data
    return response;
  },
  function (error) {
    // 功能7-3：响应拦截器-统一处理token失效
    // 超出 2xx 范围的状态码都会触发该函数
    // 当请求头中的token失效时（响应状态码401），阻止用户获取数据，清空本地缓存中的用户数据，并让其重新登录
    // console.dir(err.response);
    if (error.response.status === 401) {
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      showToast("登录状态已过期，请重新登录！");
      setTimeout(() => {
        location.href = "./login.html";
      }, 1500);
    }
    return Promise.reject(error);
  }
);
