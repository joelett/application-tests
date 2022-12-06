let crypto = require("crypto").webcrypto
let { createHash } = require("crypto")


let pubkey,privkey,keys
async function init(){
    keys = await crypto.subtle.generateKey({
        name:"RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash:"SHA-256"
    },true,["decrypt","encrypt"])
    pubkey = keys.publicKey
    privkey = keys.privateKey
}
init();


async function encryptData(data,skey){
    let key = await importRsaKey(skey)
    let enc = new TextEncoder();
    return ab2str(await crypto.subtle.encrypt("RSA-OAEP",key,enc.encode(data)))
}
async function decryptData(data){
    try{
        let decrypt = await crypto.subtle.decrypt("RSA-OAEP",privkey,str2ab(data))
        return ab2str(decrypt)
    }catch(err){
        console.log(err)
    }
}
async function importRsaKey(pem){
    let binaryDerString = (pem);
    binaryDer = str2ab(binaryDerString);

    let ckey = await crypto.subtle.importKey(
        "spki",
        binaryDer,
        {
            name:"RSA-OAEP",
            hash:"SHA-256"
        },
        true,
        ["encrypt"]
    )
    return ckey;
}

async function getPubKey(){
    if(pubkey!=undefined){
        let res = await crypto.subtle.exportKey("spki",pubkey)
        return (ab2str(res))
    }
}
async function getPrivKey(){
    if(privkey!=undefined){
        let res = await crypto.subtle.exportKey("pkcs",privkey)
        return (ab2str(res))
    }
}

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }
  
  function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

function atob(str){
    return Buffer.from(str, 'utf8').toString('base64');
}
function btoa(str){
    return Buffer.from(str, 'base64').toString('utf8');
}

function genHash(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    var charactersLength = characters.length;
    let indexer = crypto.getRandomValues(new Uint8Array(length))
    let rand = crypto.getRandomValues(new Uint8Array(256))

    for(let i=0;i<indexer.length;i++){
        result+=characters.charAt(Math.floor(rand[indexer[i]]/256*charactersLength))
    }
    return result;
}


function hash(input){
    return createHash('sha256').update(input).digest('base64');
}



module.exports={encryptData,decryptData,importRsaKey,getPubKey,getPrivKey,genHash,hash}