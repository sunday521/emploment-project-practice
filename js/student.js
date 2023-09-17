// 功能9：学生页-整合登录校验+用户名渲染+退出登录
checkLogin();
renderUsername();
logout();

const list = document.querySelector(".list");

// 功能10：学生页-学员列表渲染
async function getData() {
  // 获取学员列表
  const res = await axios.get("/students");
  // console.log(res.data);
  // 渲染学员列表
  // 为了操作指定数据，需要添加自定义属性
  list.innerHTML = res.data
    .map((ele) => {
      const {
        name,
        age,
        gender,
        group,
        hope_salary,
        salary,
        province,
        city,
        area,
        id,
      } = ele;
      return `
        <tr>
            <td>${name}</td>
            <td>${age}</td>
            <td>${gender === 0 ? "男" : "女"}</td>
            <td>${group}</td>
            <td>${hope_salary}</td>
            <td>${salary}</td>
            <td>${province + city + area}</td>
            <td data-id="${id}">
                <a href="javascript:;" class="text-success mr-3"><i class="bi bi-pen"></i></a>
                <a href="javascript:;" class="text-danger"><i class="bi bi-trash"></i></a>
            </td>
        </tr>
    `;
    })
    .join("");
}
getData();
