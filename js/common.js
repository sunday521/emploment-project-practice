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
