
function showSection(id) {
    document.querySelectorAll("section").forEach(sec => {
        sec.classList.add("hidden");
    });
    document.getElementById(id).classList.remove("hidden");
}

let employees = JSON.parse(localStorage.getItem("employees")) || [];
let genderStats = {
    male: 0,
    female: 0
};

const employeeList = document.getElementById("employeeList");
const employeeForm = document.getElementById("employeeForm");

function renderEmployees() {
    employeeList.innerHTML = "";
    employees.forEach((emp, index) => {
        employeeList.innerHTML += `
            <tr>
                <td>${emp.name}</td>
                <td>${emp.role}</td>
                <td>
                    <button class="btn btn-danger btn-sm"
                        onclick="deleteEmployee(${index})">
                        Supprimer
                    </button>
                    <button class="btn btn-danger btn-sm"
                        onclick="editEmployee(${index})">
                        Modifier
                    </button>
                </td>
            </tr>
        `;
    });

    localStorage.setItem("employees", JSON.stringify(employees));
    updateDashboard();
}
function loadRandomUsers(count = 10) {
    fetch(`https://randomuser.me/api/?results=${count}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            data.results.forEach(user => {
                employees.push({
                    name: `${user.name.first} ${user.name.last}`,
                    role: "Employé",
                    gender: user.gender
                });
            });
            renderEmployees();
        });
}
function updateAdvancedKPI() {
    genderStats.male = employees.filter(e => e.gender === "male").length;
    genderStats.female = employees.filter(e => e.gender === "female").length;
    genderStats.other = employees.filter(e => e.gender === "other").length;

    document.getElementById("maleEmployees").innerText = genderStats.male;
    document.getElementById("femaleEmployees").innerText = genderStats.female;
    document.getElementById("nbEmployees").innerText = genderStats.other;
}
employeeForm.addEventListener("submit", e => {
    e.preventDefault();
    employees.push({
        name: document.querySelector("#name").value,
        role: role.value,
        gender: gender.value
    });
    employeeForm.reset();
    renderEmployees();
});

function deleteEmployee(index) {
    if (confirm("Supprimer cet employé ?")) {
        employees.splice(index, 1);
        renderEmployees();
    }
}

function sortAll() {
    employeeList.innerHTML = "";
    employees.sort((a, b) => a.name.localeCompare(b.name));
    renderEmployees();
}

document.querySelector(".search").addEventListener("click", e => {
    e.preventDefault();
    const v = document.querySelector("#search").value;
    
    let elements = [];
    employees.forEach(f => {
        if (f.name.toLowerCase().search(v) > -1) {
            elements.push(f);
        }
    })
    employeeList.innerHTML = "";
    elements.forEach((emp, index) => {
        employeeList.innerHTML += `
            <tr>
                <td>${emp.name}</td>
                <td>${emp.role}</td>
                <td>
                    <button class="btn btn-danger btn-sm"
                        onclick="deleteEmployee(${index})">
                        Supprimer
                    </button>
                    <button class="btn btn-danger btn-sm"
                        onclick="editEmployee(${index})">
                        Modifier
                    </button>
                </td>
            </tr>
        `;
    });
  
})

function editEmployee(id) {
    if (confirm("la modification d'un employee doit etre complete, sinon l'employee va etre supprimer. Voulez vous continuer?")) {
        document.querySelector("#name").value = employees[id].name;
        document.querySelector("#role").value = employees[id].role;
        document.querySelector("#gender").value = employees[id].gender;
        deleteEmployee(id);
    }
}

let departments = JSON.parse(localStorage.getItem("departments")) || [];
const departmentList = document.getElementById("departmentList");
const departmentForm = document.getElementById("departmentForm");

function renderDepartments() {
    departmentList.innerHTML = "";
    departments.forEach((dept, index) => {
        departmentList.innerHTML += `
            <li>
                ${dept}
                <button onclick="deleteDepartment(${index})">X</button>
            </li>
        `;
    });
    localStorage.setItem("departments", JSON.stringify(departments));
}

departmentForm.addEventListener("submit", e => {
    e.preventDefault();
    departments.push(deptName.value);
    departmentForm.reset();
    renderDepartments();
});

function deleteDepartment(index) {
    departments.splice(index, 1);
    renderDepartments();
}


function updateDashboard() {
    document.getElementById("totalEmployees").innerText = employees.length;
    drawChart();
}
let employeeChartInstance = null;
function drawChart() {
    const ctx = document.getElementById("employeeChart");
    if (employeeChartInstance) employeeChartInstance.destroy();
    
    employeeChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: employees.map(e => e.name),
            datasets: [{
                label: "Employés",
                data: employees.map(() => 1)
            }]
        }
    });
}

function drawGenderChart() {
    const ctx = document.getElementById("genderChart");
    if (window.chart) window.chart.destroy();

    window.chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ["Hommes", "Femmes", "Autre"],
            datasets: [{
                data: [genderStats.male, genderStats.female, genderStats.other]
            }]
        }
    });
}
updateAdvancedKPI();
renderEmployees();
renderDepartments();

drawChart();
drawGenderChart();
if (employees.length === 0) {
    loadRandomUsers(15);
}