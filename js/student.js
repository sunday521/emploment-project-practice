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

  // 渲染学员总数
  document.querySelector(".total").innerText = res.data.length;
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

  // 功能14：BUG修复
  // 每次打开添加模态框时，移除自定义属性，防止和修改搞混
  modalDom.dataset.id = "";
  // 每次打开添加模态框时，让城市和地区列表清空
  document.querySelector(
    "[name=city]"
  ).innerHTML = `<option value="">--城市--</option>`;
  document.querySelector(
    "[name=area]"
  ).innerHTML = `<option value="">--地区--</option>`;
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

// 功能12：学生页-删除学生
async function delStudent(id) {
  await axios.delete(`/students/${id}`);
  getData();
}

// 功能13：学生页-修改学生信息
async function editStudent(id) {
  // 功能13-1：显示模态框
  modalTitle.innerText = "修改学生";
  myModal.show();
  // 功能13-2：最新数据回显
  // 向服务器请求最新的学生数据，渲染到编辑表单上
  const res = await axios.get(`/students/${id}`);
  console.log(res.data);
  // 13-2-1 渲染学生姓名、年龄、分组、期望薪资和实际薪资
  const keyArr = ["name", "age", "group", "hope_salary", "salary"];
  keyArr.forEach(
    (key) =>
      (document.querySelector(`input[name=${key}]`).value = res.data[key])
  );
  // 13-2-2 渲染性别
  const { gender } = res.data;
  document.querySelectorAll("input[name=gender]")[gender].checked = true;
  // 13-2-3 渲染省市区
  const { province, city, area } = res.data;
  // 渲染省份
  pSelect.value = province;
  // 渲染对应省的所有城市
  // 这里重新请求的目的是编辑表单省市区的首次渲染，更改时会触发initSelect中的对应事件，重新获取并渲染
  const cityRes = await axios.get("/api/city", {
    params: { pname: province },
  });
  const chtml = cityRes.list
    .map((ele) => {
      return `
				<option value="${ele}">${ele}</option>
			`;
    })
    .join("");
  cSelect.innerHTML = `<option value="">--城市--</option>${chtml}`;
  cSelect.value = city;
  // 渲染对应城市的所有地区
  const areaRes = await axios.get("/api/area", {
    params: { pname: province, cname: city },
  });
  const ahtml = areaRes.list
    .map((ele) => {
      return `
				<option value="${ele}">${ele}</option>
			`;
    })
    .join("");
  aSelect.innerHTML = `<option value="">--地区--</option>${ahtml}`;
  aSelect.value = area;

  // 给模态框添加自定义属性以区分编辑和添加
  modalDom.dataset.id = res.data.id;
}

document.querySelector(".list").addEventListener("click", function (e) {
  if (e.target.classList.contains("bi-trash")) {
    console.log("删除");
    const id = e.target.parentNode.parentNode.dataset.id;
    delStudent(id);
  }
  if (e.target.classList.contains("bi-pen")) {
    console.log("修改");
    const id = e.target.parentNode.parentNode.dataset.id;
    editStudent(id);
  }
});

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
// 功能13-3：修改学生信息
async function saveStudent(id) {
  // 收集表单数据
  const data = serialize(formDom, { hash: true, empty: true });
  // 按接口文档要求，转换数据格式
  data.age = +data.age;
  data.gender = +data.gender;
  data.hope_salary = +data.hope_salary;
  data.salary = +data.salary;
  data.group = +data.group;
  console.log(data);
  // 提交表单数据
  try {
    const res = await axios.put(`/students/${id}`, data);
    showToast(res.message);
    getData();
  } catch (err) {
    showToast(err.response.data.message);
  }
  myModal.hide();
}
document.querySelector("#submit").addEventListener("click", function () {
  // 添加、修改使用的是同一个模态框，怎么在点击确定时，区分它们呢？
  // 因为编辑会有自定义id属性，所以可以在editStudent函数中手动给模态框添加这个自定义属性，以作区分
  // 如果模态框上有自定义id，说明是编辑，调用修改方法
  if (modalDom.dataset.id) {
    saveStudent(modalDom.dataset.id);
  } else {
    addStudent();
  }
});
