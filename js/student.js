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

// 功能11：学生页-添加学生
const modalDom = document.querySelector("#modal");
const modalTitle = document.querySelector(".modal-title");
const formDom = document.querySelector("#form");
const myModal = new bootstrap.Modal(modalDom);
document.querySelector("#openModal").addEventListener("click", function () {
  // 功能11-1：显示模态框（注意添加、修改使用的是同一模态框，以后再修改）
  myModal.show();
  // 功能11-2：重置模态框
  formDom.reset();
  modalTitle.innerText = "添加学生";
});

// 功能11-3：省市区联动
// 这个功能在添加、修改时都会用到，所以单独抽取出来
// 渲染省市区时，一定记得把下拉框的value值加上
const pSelect = document.querySelector("[name=province]");
const cSelect = document.querySelector("[name=city]");
const aSelect = document.querySelector("[name=area]");
async function initSelect() {
  // 默认渲染省份列表
  const res = await axios.get("/api/province");
  const phtml = res.list
    .map((ele) => {
      return `
			<option value="${ele}">${ele}</option>
		`;
    })
    .join("");
  pSelect.innerHTML = `<option value="">--省份--</option>${phtml}`;
  // 选择省份后渲染城市列表
  // 选择省份比较特殊，需要清空一下地区列表
  pSelect.addEventListener("change", async function () {
    const res = await axios.get("/api/city", { params: { pname: this.value } });
    const chtml = res.list
      .map((ele) => {
        return `
				<option value="${ele}">${ele}</option>
			`;
      })
      .join("");
    cSelect.innerHTML = `<option value="">--城市--</option>${chtml}`;
    // 清空地区列表
    aSelect.innerHTML = `<option value="">--地区--</option>`;
  });
  // 选择城市后渲染地区列表
  cSelect.addEventListener("change", async function () {
    const res = await axios.get("/api/area", {
      params: { pname: pSelect.value, cname: this.value },
    });
    const ahtml = res.list
      .map((ele) => {
        return `
				<option value="${ele}">${ele}</option>
			`;
      })
      .join("");
    aSelect.innerHTML = `<option value="">--地区--</option>${ahtml}`;
  });
}
initSelect();

// 功能11-4：添加学员
async function addStudent() {
  // 收集表单数据
  const data = serialize(formDom, { hash: true, empty: true });
  // 按接口文档要求，转换数据格式
  data.age = +data.age;
  data.gender = +data.gender;
  data.hope_salary = +data.hope_salary;
  data.salary = +data.salary;
  data.group = +data.group;
  // 提交表单数据
  try {
    const res = await axios.post("/students", data);
    showToast(res.message);
    getData();
  } catch (err) {
    showToast(err.response.data.message);
  }
  myModal.hide();
}
document.querySelector("#submit").addEventListener("click", function () {
  addStudent();
});

// 功能12：删除学生
async function delStudent(id) {
  await axios.delete(`/students/${id}`);
  getData();
}
document.querySelector(".list").addEventListener("click", function (e) {
  if (e.target.classList.contains("bi-trash")) {
    console.log("删除");
    const id = e.target.parentNode.parentNode.dataset.id;
    delStudent(id);
  }
});
