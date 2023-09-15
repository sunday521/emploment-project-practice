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
