// 功能2：用户登录
document.querySelector("#btn-login").addEventListener("click", async () => {
  // 1.1 收集表单数据并校验
  // 不符合要求记得return
  const loginForm = document.querySelector(".login-form");
  const { username, password } = serialize(loginForm, {
    hash: true,
    empty: true,
  });
  if (!username || !password) {
    showToast("用户名和密码不能为空！");
    return;
  }
  if (username.length > 30 || username.length < 8) {
    showToast("用户名长度不符合要求（8-30位）");
    return;
  }
  if (password.length > 30 || password.length < 6) {
    showToast("密码长度不符合要求（6-30位）");
    return;
  }

  // 2.2 提交登录请求
  try {
    const res = await axios({
      url: "/login",
      method: "POST",
      data: {
        username,
        password,
      },
    });
    const {
      message,
      data: { username: uname, token },
    } = res;
    // 这里username和上面的冲突，需要重命名一下
    // console.log(message, uname, token);
    showToast(message);

    // 2.3 登录成功，将返回的用户信息和token保存在浏览器的本地缓存中
    localStorage.setItem("username", uname);
    localStorage.setItem("token", token);

    // 2.4 登录成功，跳转到首页
    setTimeout(() => {
      location.href = "./index.html";
    }, 1500);
  } catch (err) {
    showToast(err.response.data.message);
  }
});
