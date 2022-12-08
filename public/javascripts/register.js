document.getElementById("registerform").addEventListener("submit",(event)=>{
    event.preventDefault();
    if(/(?=.{12,})(?=.*?[^\w\s])(?=.*?[0-9])(?=.*?[A-Z]).*?[a-z].*/.test(event.target.pass.value)&&event.target.pass.value==event.target.pass2.value){
        register(
            event.target.name.value,
            event.target.surname.value,
            event.target.foa.value,
            event.target.type.value,
            event.target.company.value,
            event.target.mobil.value,
            event.target.email.value,
            event.target.pass.value
        );
    }else{
        console.log("PASSWORD INVALID")
        //TODO
    }
})

document.getElementById("passinput").addEventListener("keyup",(ev)=>{
    let score = document.getElementById("passscore")
    score.value=calculateScore(ev.target.value)
})

function calculateScore(input){
    let special=/(?=.*?[^\w\s])/.test(input)//?33:0
    let numbers=/(?=.*?[0-9])/.test(input)//?10:0
    let capital=/(?=.*?[A-Z])/.test(input)//?26:0
    let lowercase=/(?=.*?[a-z])/.test(input)//?26:0

    let set = (special?33:0)+(numbers?10:0)+(capital?26:0)+(lowercase?26:0)

    let score = Math.log2(Math.pow(set,set==95?input.length:(input.length>=12?12:input.length)))

    return Math.round(score)
}
function sigmoid(x){
    return 1/(1+Math.pow(Math.E,-x))
}