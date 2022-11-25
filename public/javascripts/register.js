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



/*
let name = (await crypto.decryptData(req.body.name))
let surname = (await crypto.decryptData(req.body.surname))
let foa = (await crypto.decryptData(req.body.foa))
let email = (await crypto.decryptData(req.body.email))
let pass = (await crypto.decryptData(req.body.pass))

let type = (await crypto.decryptData(req.body.type))
let company = (await crypto.decryptData(req.body.company))
*/