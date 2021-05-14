var nova = document.getElementById("inpsenha1");
var repete = document.getElementById("inpsenha2");
nova.onchange = retira
repete.onchange = retira

function retira() {
    if (nova.value != repete.value) {
        document.getElementById("diferente").style = "display: inline-block"
    } else {
        document.getElementById("diferente").style = "display: none"
    }
}