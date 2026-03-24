const API = "https://b11-frrj.onrender.com";

let isLoggedIn = false;
let isAdmin = false;
let userEmail = "";

/* ---------------- PAGE CONTROL ---------------- */
function showPage(page){

    if(!isLoggedIn && page !== "login" && page !== "signup"){
        page = "login";
    }

    document.querySelectorAll(".page").forEach(p=>{
        p.style.display="none";
    });

    document.getElementById(page).style.display="block";

    if(page==="dashboard" && isLoggedIn){
        loadChildren();
    }
}

showPage("login");

/* ---------------- LOGOUT ---------------- */
function logout(){
    isLoggedIn=false;
    isAdmin=false;
    showPage("login");
}

/* ---------------- SIGNUP ---------------- */
function signup(){

    console.log("SIGNUP CLICKED");

    fetch(API+"/signup",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            name:document.getElementById("su_name").value,
            email:document.getElementById("su_email").value,
            password:document.getElementById("su_pass").value
        })
    })
    .then(async r=>{
        let data = await r.json();
        console.log("SIGNUP RESPONSE:", data);

        alert("Signup successful!");
        showPage("login");
    })
    .catch(err=>{
        console.log("SIGNUP ERROR:", err);
        alert("Signup failed (check backend)");
    });
}

/* ---------------- LOGIN ---------------- */
function login(){

    console.log("LOGIN CLICKED");

    fetch(API+"/login",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            email:document.getElementById("login_email").value,
            password:document.getElementById("login_pass").value
        })
    })
    .then(async r=>{
        let data = await r.json();
        console.log("LOGIN RESPONSE:", data);

        if(data.status==="admin" || data.status==="user"){
            isLoggedIn=true;
            isAdmin=(data.status==="admin");
            userEmail=data.email;

            showPage("dashboard");
        } else {
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

    fetch(API+"/get_children")
    .then(r=>r.json())
    .then(data=>{
        console.log("CHILDREN:", data);

        let c=document.getElementById("childrenContainer");
        c.innerHTML="";

        data.forEach(x=>{
            let div=document.createElement("div");
            div.innerHTML = `
                <h4>${x.name}</h4>
                <p>${x.age}</p>
                <p>${x.place}</p>
            `;
            c.appendChild(div);
        });
    })
    .catch(err=>{
        console.log("LOAD ERROR:", err);
    });
}

/* ---------------- REGISTER ---------------- */
function registerChild(){

    let f=new FormData();
    f.append("name",document.getElementById("child_name").value);
    f.append("age",document.getElementById("child_age").value);
    f.append("place",document.getElementById("child_place").value);
    f.append("photo",document.getElementById("child_photo").files[0]);

    fetch(API+"/register_child",{method:"POST",body:f})
    .then(r=>r.json())
    .then(data=>{
        console.log("REGISTER:", data);
        alert("Child uploaded");
        showPage("dashboard");
    })
    .catch(err=>{
        console.log("REGISTER ERROR:", err);
        alert("Upload failed");
    });
}

/* ---------------- IMAGE CHECK ---------------- */
function crossCheckImage(){

    let file=document.getElementById("check_photo").files[0];

    if(!file){
        alert("Upload image");
        return;
    }

    let f=new FormData();
    f.append("photo",file);

    fetch(API+"/crosscheck",{method:"POST",body:f})
    .then(r=>r.json())
    .then(data=>{
        console.log("IMAGE CHECK:", data);
        alert(JSON.stringify(data));
    })
    .catch(err=>{
        console.log("IMAGE ERROR:", err);
    });
}

/* ---------------- VIDEO CHECK ---------------- */
function crossCheckVideo(){

    let file=document.getElementById("check_video").files[0];

    if(!file){
        alert("Upload video");
        return;
    }

    let f=new FormData();
    f.append("video",file);

    fetch(API+"/crosscheck_video",{method:"POST",body:f})
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
    let menu=document.getElementById("sideMenu");
    menu.style.left = (menu.style.left==="0px") ? "-250px" : "0px";
}
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
