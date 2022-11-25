document.getElementById("loginform").addEventListener("submit",(event)=>{
    event.preventDefault();
    login(event.target.email.value,event.target.pass.value);
})