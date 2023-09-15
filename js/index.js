// 功能3：首页-页面访问控制
// 只有已登录（本地缓存有token）的用户才能够访问首页
checkLogin();

// 功能4：首页-用户名渲染
// 直接读取本地缓存中的用户名
renderUsername();

// 功能5：首页-退出登录
// 先清除本地缓存中的用户数据，然后跳转到登录页
logout();
