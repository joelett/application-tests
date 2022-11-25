let pathext = "/ais/kundenportal"

function login(user,pass){
    fetch(pathext+"/pubkey").then(raw=>{
        return raw.json()
    }).then(async data=>{
        let pub = data.pubkey
        let uid = await encryptData(user,pub)
        let password = await encryptData(pass,pub)

        fetch(pathext+"/login",{
            method:"POST",
            headers:{"content-type":"application/json"},
            body:JSON.stringify({
                uid:uid,
                pass:password
            })
        }).then(async(resp)=>{console.log("["+resp.status+"] "+await resp.text())})
    })
}
