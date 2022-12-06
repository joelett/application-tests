let pubkey,privkey
async function init(){
    let keys = await window.crypto.subtle.generateKey({
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
    let pub = await importRsaKey(skey)
    let enc = new TextEncoder();
    return ab2str(await window.crypto.subtle.encrypt("RSA-OAEP",pub,enc.encode(data)))
}
async function decryptData(data){
    return ab2str(await window.crypto.subtle.decrypt("RSA-OAEP",privkey,str2ab(data)))
}
async function importRsaKey(pem){
    let binaryDerString = (pem);
    binaryDer = str2ab(binaryDerString);

    let ckey = window.crypto.subtle.importKey(
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
    let res = await window.crypto.subtle.exportKey("spki",pubkey)
    return (ab2str(res))
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

function genRand(length,charset) {
    var result           = '';
    var charactersLength = characters.length;
    let indexer = crypto.getRandomValues(new Uint8Array(length))
    let rand = crypto.getRandomValues(new Uint8Array(256))
    
    for(let i=0;i<indexer.length;i++){
        result+=charset.charAt(Math.floor(rand[indexer[i]]/256*charactersLength))
    }
   return result;
}

function hash(input){
    return window.crypto.subtle.digest('SHA-256',str2ab(input)).then((el)=>{return ab2str(el)}).then((el)=>{return window.btoa(el)})
}