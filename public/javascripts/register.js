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
        console.log("PASSWORD NOT VALID")
        //TODO
    }
})

document.getElementById("passinput").addEventListener("keyup",(ev)=>{
    let score = document.getElementById("passscore")
    score.value=calculateScore(ev.target.value)
})

function calculateScore(input){
    let score = 0

    score+=/(?=.*?[^\w\s])/.test(input)?1:0
    score+=/(?=.*?[0-9])/.test(input)?1:0
    score+=/(?=.*?[A-Z])/.test(input)?1:0
    score+=/(?=.*?[a-z])/.test(input)?1:0
    score+=input.length>=12?(score>=4?(sigmoid(input.length-12)*2):1):0

    return Math.round(score)
}
function sigmoid(x){
    return 1/(1+Math.pow(Math.E,-x))
}