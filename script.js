const API = "https://b1-7uce.onrender.com";

let userEmail = "";
let isAdmin = false;

/* ---------------- PAGE SWITCH ---------------- */
function showPage(page){
  document.querySelectorAll(".page").forEach(p=>p.style.display="none");
  document.getElementById(page).style.display="block";

  if(page==="dashboard") loadChildren();
}
showPage("login");

/* ---------------- MODAL ---------------- */
function showModal(title, message){
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalText").innerText = message;
  document.getElementById("resultModal").style.display = "flex";
}

function closeModal(){
  document.getElementById("resultModal").style.display = "none";
}

/* ---------------- SIGNUP ---------------- */
function signup(){
  fetch(API+"/signup",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      name:su_name.value,
      email:su_email.value,
      password:su_pass.value
    })
  })
  .then(r=>r.json())
  .then(()=>showPage("login"));
}

/* ---------------- LOGIN ---------------- */
function login(){
  fetch(API+"/login",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      email:login_email.value,
      password:login_pass.value
    })
  })
  .then(r=>r.json())
  .then(d=>{
    if(d.status==="admin"){
      isAdmin=true;
      showPage("dashboard");
    }
    else if(d.status==="user"){
      userEmail=d.email;
      showPage("dashboard");
    }
    else alert("Login Failed");
  });
}

/* ---------------- LOAD CHILDREN ---------------- */
function loadChildren(){
  fetch(API+"/get_children")
  .then(r=>r.json())
  .then(data=>{
    let c=document.getElementById("childrenContainer");
    c.innerHTML="";

    data.forEach(x=>{
      let div=document.createElement("div");
      div.className="childCard";

      div.innerHTML=`
        <h4>${x.name}</h4>
        <p>${x.age}</p>
        <p>${x.place}</p>
        ${isAdmin?`<button onclick="deleteChild(${x.id})">Delete</button>`:""}
      `;

      c.appendChild(div);
    });
  });
}

/* ---------------- DELETE ---------------- */
function deleteChild(id){
  fetch(API+"/delete_child/"+id,{method:"DELETE"})
  .then(()=>loadChildren());
}

/* ---------------- REGISTER ---------------- */
function registerChild(){
  let f=new FormData();
  f.append("name",child_name.value);
  f.append("age",child_age.value);
  f.append("place",child_place.value);
  f.append("photo",child_photo.files[0]);

  fetch(API+"/register_child",{method:"POST",body:f})
  .then(()=>showPage("dashboard"));
}

/* ---------------- CROSSCHECK ---------------- */
function crossCheck(){

  if(!check_photo.files[0]){
    showModal("⚠️ ERROR","Upload image first");
    return;
  }

  let f=new FormData();
  f.append("photo",check_photo.files[0]);

  fetch(API+"/crosscheck",{method:"POST",body:f})
  .then(r=>r.json())
  .then(d=>{

    if(d.status==="found"){

      if(d.type==="reverse_age"){
        showModal("🔄 REVERSE AGE MATCH FOUND",
          `Name: ${d.name}\nAge: ${d.age}\nPlace: ${d.place}`);
      } else {
        showModal("✅ MATCH FOUND",
          `Name: ${d.name}\nAge: ${d.age}\nPlace: ${d.place}`);
      }

    }

    else if(d.status==="not found"){
      showModal("❌ NOT FOUND","No match found.");
    }

    else if(d.status==="no face"){
      showModal("⚠️ ERROR","No face detected.");
    }

    else if(d.status==="no data"){
      showModal("⚠️ ERROR","No children in database.");
    }

    else{
      showModal("❌ ERROR","Something went wrong.");
    }

  })
  .catch(()=>{
    showModal("❌ ERROR","Server error");
  });

}
