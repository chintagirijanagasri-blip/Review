/* =====================================================
   ONLINE EXAMINATION SYSTEM
   Authentication using LocalStorage
   ===================================================== */


/* ================= PAGE NAVIGATION ================= */

function showPage(pageId) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById(pageId).classList.add("active");
}


/* =====================================================
   STUDENT REGISTRATION
   ===================================================== */

document
    .getElementById("studentRegisterForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const name =
            document.getElementById("studentName").value.trim();

        const studentId =
            document.getElementById("studentId").value.trim();

        const email =
            document.getElementById("studentEmail").value.trim();

        const password =
            document.getElementById("studentPassword").value;

        const confirmPassword =
            document.getElementById("studentConfirmPassword").value;


        if (password !== confirmPassword) {

            alert("Passwords do not match!");

            return;
        }


        /* Get existing students */

        let students =
            JSON.parse(localStorage.getItem("students")) || [];


        /* Check duplicate Student ID */

        const existingStudent =
            students.find(student =>
                student.id === studentId
            );


        if (existingStudent) {

            alert("Student ID already exists!");

            return;
        }


        /* Create student */

        const student = {

            name: name,
            id: studentId,
            email: email,
            password: password

        };


        students.push(student);


        /* Save in LocalStorage */

        localStorage.setItem(
            "students",
            JSON.stringify(students)
        );


        alert(
            "Student registration successful!\nYou can now login."
        );


        this.reset();

        showPage("studentLoginPage");

    });


/* =====================================================
   STUDENT LOGIN
   ===================================================== */

document
    .getElementById("studentLoginForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const id =
            document.getElementById("loginStudentId").value.trim();

        const password =
            document.getElementById("loginStudentPassword").value;


        const students =
            JSON.parse(localStorage.getItem("students")) || [];


        const student =
            students.find(user =>
                user.id === id &&
                user.password === password
            );


        if (!student) {

            alert("Invalid Student ID or Password!");

            return;
        }


        /* Save current user */

        localStorage.setItem(
            "currentUser",
            JSON.stringify({
                role: "student",
                data: student
            })
        );


        document.getElementById("studentWelcome").textContent =
            student.name;


        showPage("studentDashboard");

        this.reset();

    });


/* =====================================================
   PRINCIPAL LOGIN
   ===================================================== */

/*
    IMPORTANT:

    Principal account is predefined.

    Username:
    principal

    Password:
    Principal@123
*/


const PRINCIPAL_USERNAME = "Gowthami";

const PRINCIPAL_PASSWORD = "Gowthami27";


document
    .getElementById("principalLoginForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const username =
            document.getElementById("principalUsername").value.trim();

        const password =
            document.getElementById("principalPassword").value;


        if (
            username === PRINCIPAL_USERNAME &&
            password === PRINCIPAL_PASSWORD
        ) {

            localStorage.setItem(
                "currentUser",
                JSON.stringify({
                    role: "principal"
                })
            );


            showPage("principalDashboard");

            loadFacultyList();

            this.reset();

        } else {

            alert("Invalid Principal Username or Password!");

        }

    });


/* =====================================================
   FACULTY CREATION BY PRINCIPAL
   ===================================================== */

document
    .getElementById("facultyForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        /* Check whether Principal is logged in */

        const currentUser =
            JSON.parse(
                localStorage.getItem("currentUser")
            );


        if (
            !currentUser ||
            currentUser.role !== "principal"
        ) {

            alert(
                "Only Principal can create faculty accounts!"
            );

            return;
        }


        const name =
            document.getElementById("facultyName").value.trim();

        const id =
            document.getElementById("facultyId").value.trim();

        const email =
            document.getElementById("facultyEmail").value.trim();

        const password =
            document.getElementById("facultyPassword").value;


        let faculty =
            JSON.parse(localStorage.getItem("faculty")) || [];


        /* Check duplicate Faculty ID */

        const existingFaculty =
            faculty.find(member =>
                member.id === id
            );


        if (existingFaculty) {

            alert("Faculty ID already exists!");

            return;
        }


        /* Create faculty */

        const newFaculty = {

            name: name,
            id: id,
            email: email,
            password: password

        };


        faculty.push(newFaculty);


        localStorage.setItem(
            "faculty",
            JSON.stringify(faculty)
        );


        alert(
            "Faculty account created successfully!"
        );


        this.reset();

        loadFacultyList();

    });


/* =====================================================
   DISPLAY FACULTY LIST
   ===================================================== */

function loadFacultyList() {

    const facultyList =
        document.getElementById("facultyList");


    const faculty =
        JSON.parse(localStorage.getItem("faculty")) || [];


    facultyList.innerHTML = "";


    if (faculty.length === 0) {

        facultyList.innerHTML =
            "<p>No faculty accounts created yet.</p>";

        return;
    }


    faculty.forEach((member, index) => {

        const div =
            document.createElement("div");


        div.className = "faculty-item";


        div.innerHTML = `

            <strong>${member.name}</strong>

            <br>

            Faculty ID:
            ${member.id}

            <br>

            Email:
            ${member.email}

            <br>

            <button
                class="delete-btn"
                onclick="deleteFaculty(${index})">

                Delete Faculty

            </button>

        `;


        facultyList.appendChild(div);

    });

}


/* =====================================================
   DELETE FACULTY
   ===================================================== */

function deleteFaculty(index) {

    const currentUser =
        JSON.parse(
            localStorage.getItem("currentUser")
        );


    if (
        !currentUser ||
        currentUser.role !== "principal"
    ) {

        alert(
            "Only Principal can delete faculty accounts!"
        );

        return;
    }


    let faculty =
        JSON.parse(localStorage.getItem("faculty")) || [];


    if (
        confirm(
            "Are you sure you want to delete this faculty account?"
        )
    ) {

        faculty.splice(index, 1);


        localStorage.setItem(
            "faculty",
            JSON.stringify(faculty)
        );


        loadFacultyList();

    }

}


/* =====================================================
   FACULTY LOGIN
   ===================================================== */

document
    .getElementById("facultyLoginForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const id =
            document.getElementById("loginFacultyId").value.trim();

        const password =
            document.getElementById("loginFacultyPassword").value;


        const faculty =
            JSON.parse(localStorage.getItem("faculty")) || [];


        const member =
            faculty.find(user =>
                user.id === id &&
                user.password === password
            );


        if (!member) {

            alert(
                "Invalid Faculty ID or Password!\n\n" +
                "Faculty accounts can only be created by the Principal."
            );

            return;
        }


        localStorage.setItem(
            "currentUser",
            JSON.stringify({
                role: "faculty",
                data: member
            })
        );


        document.getElementById("facultyWelcome").textContent =
            member.name;


        showPage("facultyDashboard");

        this.reset();

    });


/* =====================================================
   STUDENT PROFILE
   ===================================================== */

function showStudentProfile() {

    const currentUser =
        JSON.parse(
            localStorage.getItem("currentUser")
        );


    if (!currentUser) {

        return;
    }


    const student =
        currentUser.data;


    alert(
        "STUDENT PROFILE\n\n" +

        "Name: " + student.name + "\n" +

        "Student ID: " + student.id + "\n" +

        "Email: " + student.email
    );

}


/* =====================================================
   LOGOUT
   ===================================================== */

function logout() {

    localStorage.removeItem("currentUser");

    showPage("homePage");

    alert("You have been logged out.");

}


/* =====================================================
   PAGE LOAD
   ===================================================== */

window.addEventListener("load", function() {

    /*
        Faculty list is stored in LocalStorage.
        Student accounts are stored in LocalStorage.
    */

    loadFacultyList();

});