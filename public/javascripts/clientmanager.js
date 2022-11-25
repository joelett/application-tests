let pathext = "/ais/kundenportal"

function login(email,pass){
    fetch(pathext+"/pubkey").then(raw=>{
        return raw.json()
    }).then(async data=>{
        let pub = data.pubkey
        let mail = await encryptData(email,pub)
        let password = await encryptData(pass,pub)

        fetch(pathext+"/login",{
            method:"POST",
            headers:{"content-type":"application/json"},
            body:JSON.stringify({
                email:mail,
                pass:password
            })
        }).then(async(resp)=>{console.log("["+resp.status+"] "+await resp.text())})
    })
}

function register(uname,usurname,ufoa,utype,ucompany,uemail,upass){
    fetch(pathext+"/pubkey").then(raw=>{
        return raw.json()
    }).then(async data=>{
        let pub = data.pubkey
        let name = await encryptData(uname,pub)
        let surname = await encryptData(usurname,pub)
        let foa = await encryptData(ufoa,pub)
        let type = await encryptData(utype,pub)
        let company = await encryptData(ucompany,pub)
        let email = await encryptData(uemail,pub)
        let pass = await encryptData(upass,pub)

        fetch(pathext+"/register",{
            method:"POST",
            headers:{"content-type":"application/json"},
            body:JSON.stringify({
                name,
                surname,
                foa,
                type,
                company,
                email,
                pass
            })
        }).then(async(resp)=>{
            console.log("["+resp.status+"] "+await resp.text())
            fetch(pathext+"/register/activate",{
                method:"POST",
                headers:{"content-type":"application/json"},
                body:JSON.stringify({
                    email
                })
            })
        })
    })
}
/*
let name = (await crypto.decryptData(req.body.name))
let surname = (await crypto.decryptData(req.body.surname))
let foa = (await crypto.decryptData(req.body.foa))
let email = (await crypto.decryptData(req.body.email))
let pass = (await crypto.decryptData(req.body.pass))

let type = (await crypto.decryptData(req.body.type))
let company = (await crypto.decryptData(req.body.company))
*/