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
        }).then(async(resp)=>{
            console.log("["+resp.status+"] "+await resp.text())
            if(resp.status==200){
                location.href=pathext
            }
        })
    })
}

function register(uname,usurname,ufoa,utype,ucompany,umobil,uemail,upass){
    fetch(pathext+"/pubkey").then(raw=>{
        return raw.json()
    }).then(async data=>{
        let pub = data.pubkey
        let name = await encryptData(uname,pub)
        let surname = await encryptData(usurname,pub)
        let foa = await encryptData(ufoa,pub)
        let type = await encryptData(utype,pub)
        let company = await encryptData(ucompany,pub)
        let mobil = await encryptData(umobil,pub)
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
                mobil,
                email,
                pass
            })
        }).then(async(resp)=>{
            console.log("["+resp.status+"] "+await resp.text())
        })
    })
}

function activate(uemail){
    fetch(pathext+"/pubkey").then(raw=>{
        return raw.json()
    }).then(async data=>{
        let pub = data.pubkey
        let email = await encryptData(uemail,pub)
        fetch(pathext+"/register/activate",{
            method:"POST",
            headers:{"content-type":"application/json"},
            body:JSON.stringify({
                email
            })
        }).then(async(resp)=>{
            console.log("["+resp.status+"] "+await resp.text())
        })
    })
}