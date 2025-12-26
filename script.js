
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
loadRandomUsers(15);
renderEmployees();