document.getElementById("registerform").addEventListener("submit",(event)=>{
    event.preventDefault();
    register(
        event.target.name.value,
        event.target.surname.value,
        event.target.foa.value,
        event.target.type.value,
        event.target.company.value,
        event.target.email.value,
        event.target.pass.value
    );
})