document.getElementById("loginform").addEventListener("submit",(event)=>{
    event.preventDefault();
    login(event.target.user.value,event.target.pass.value);
})