const API = "https://b11-frrj.onrender.com";

let isLoggedIn = false;
let isAdmin = false;
let userEmail = "";

/* ---------------- PAGE CONTROL ---------------- */
function showPage(page){

    document.querySelectorAll(".page").forEach(p=>{
        p.style.display = "none";
    });

    document.getElementById(page).style.display = "block";

    // Load children when dashboard opens
    if(page === "dashboard"){
        loadChildren();
    }
}

/* ---------------- INIT ---------------- */
document.addEventListener("DOMContentLoaded", ()=>{
    showPage("login");
});

/* ---------------- LOGOUT ---------------- */
function logout(){
    isLoggedIn = false;
    isAdmin = false;
    userEmail = "";
    showPage("login");
}

/* ---------------- SIGNUP ---------------- */
function signup(){

    console.log("SIGNUP CLICKED");

    fetch(API + "/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name: document.getElementById("su_name").value,
            email: document.getElementById("su_email").value,
            password: document.getElementById("su_pass").value
        })
    })
    .then(async r=>{
        let data = await r.json();
        console.log("SIGNUP RESPONSE:", data);

        if(r.ok){
            alert("Signup successful!");
            showPage("login");
        } else {
            alert(data.message || "Signup failed");
        }
    })
    .catch(err=>{
        console.log("SIGNUP ERROR:", err);
        alert("Signup failed (check backend)");
    });
}

/* ---------------- LOGIN ---------------- */
function login(){

    console.log("LOGIN CLICKED");

    fetch(API + "/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email: document.getElementById("login_email").value,
            password: document.getElementById("login_pass").value
        })
    })
    .then(async r=>{
        let data = await r.json();
        console.log("LOGIN RESPONSE:", data);

        if(data.status === "admin"){
            isLoggedIn = true;
            isAdmin = true;
            userEmail = data.email;

            showPage("adminDashboard");
        }
        else if(data.status === "user"){
            isLoggedIn = true;
            isAdmin = false;
            userEmail = data.email;

            showPage("dashboard");
        }
        else {
            alert("Login Failed");
        }
    })
    .catch(err=>{
        console.log("LOGIN ERROR:", err);
        alert("Login failed (server issue)");
    });
}

/* ---------------- LOAD CHILDREN ---------------- */
function loadChildren(){

    fetch(API + "/get_children")
    .then(r=>r.json())
    .then(data=>{
        console.log("CHILDREN:", data);

        let c = document.getElementById("childrenContainer");
        c.innerHTML = "";

        data.forEach(x=>{
            let div = document.createElement("div");
            div.style.border = "1px solid #ccc";
            div.style.margin = "10px";
            div.style.padding = "10px";

            div.innerHTML = `
                <h4>${x.name}</h4>
                <p>Age: ${x.age}</p>
                <p>Place: ${x.place}</p>
            `;

            c.appendChild(div);
        });
    })
    .catch(err=>{
        console.log("LOAD ERROR:", err);
    });
}

/* ---------------- REGISTER CHILD ---------------- */
function registerChild(){

    let f = new FormData();
    f.append("name", document.getElementById("child_name").value);
    f.append("age", document.getElementById("child_age").value);
    f.append("place", document.getElementById("child_place").value);
    f.append("photo", document.getElementById("child_photo").files[0]);

    fetch(API + "/register_child", {
        method: "POST",
        body: f
    })
    .then(r=>r.json())
    .then(data=>{
        console.log("REGISTER:", data);
        alert("Child uploaded successfully");
        showPage("dashboard");
    })
    .catch(err=>{
        console.log("REGISTER ERROR:", err);
        alert("Upload failed");
    });
}

/* ---------------- IMAGE CHECK ---------------- */
function crossCheckImage(){

    let file = document.getElementById("check_photo").files[0];

    if(!file){
        alert("Upload image");
        return;
    }

    let f = new FormData();
    f.append("photo", file);

    fetch(API + "/crosscheck", {
        method: "POST",
        body: f
    })
    .then(r=>r.json())
    .then(data=>{
        console.log("IMAGE CHECK:", data);
        alert(JSON.stringify(data));
    })
    .catch(err=>{
        console.log("IMAGE ERROR:", err);
        alert("Image check failed");
    });
}

/* ---------------- VIDEO CHECK ---------------- */
function crossCheckVideo(){

    let file = document.getElementById("check_video").files[0];

    if(!file){
        alert("Upload video");
        return;
    }

    let f = new FormData();
    f.append("video", file);

    fetch(API + "/crosscheck_video", {
        method: "POST",
        body: f
    })
    .then(r=>r.json())
    .then(data=>{
        console.log("VIDEO CHECK:", data);
        alert(JSON.stringify(data));
    })
    .catch(err=>{
        console.log("VIDEO ERROR:", err);
        alert("Video check failed");
    });
}

/* ---------------- MENU ---------------- */
function toggleMenu(){
    let menu = document.getElementById("sideMenu");

    if(menu.style.left === "0px"){
        menu.style.left = "-250px";
    } else {
        menu.style.left = "0px";
    }
}

/* ---------------- DELETE CHILD (ADMIN) ---------------- */
function deleteChild() {

    const id = document.getElementById("deleteId").value;

    if(!id){
        alert("Enter a child ID");
        return;
    }

    fetch(`${API}/admin/delete_child/${id}`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email: "admin@example.com",
            password: "ths345$"
        })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message || data.status);
    })
    .catch(err => {
        console.log("DELETE ERROR:", err);
        alert("Delete failed");
    });
}
