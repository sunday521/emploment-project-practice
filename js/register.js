// 功能1：用户注册
document.querySelector("#btn-register").addEventListener("click", async () => {
  // 1.1 收集表单数据并校验
  // 不符合要求记得return
  const registerForm = document.querySelector(".register-form");
  const { username, password } = serialize(registerForm, {
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

  // 2.2 提交注册请求
  try {
    const res = await axios({
      url: "/register",
      method: "POST",
      data: {
        username,
        password,
      },
    });
    showToast(res.message);
  } catch (err) {
    showToast(err.response.data.message);
  }
});
