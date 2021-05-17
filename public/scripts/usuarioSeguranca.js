var atual = document.getElementById("senhaAtual");
atual.onchange = verificaMudanca
var nova = document.getElementById("senhav1");
var repete = document.getElementById("senhav2");
nova.onchange = retira
repete.onchange = retira

function retira() {
    if (nova.value != repete.value) {
        document.getElementById("diferente").style = "display: inline-block"
         let button = document.getElementById("enviar").disabled = true;
    } else {
        document.getElementById("diferente").style = "display: none"
        let button = document.getElementById("enviar").disabled = false;
    }
}

function verificaMudanca() {
    if (atual.value) {
        nova.required = true
        repete.required = true

    } else {
        if (nova.value) {
            nova.required = false
        }
        if (repete.value) {
            repete.required = false
        }

    }
}

$('#inpcel').mask("(99) 9999-99999")
    .focusout(function (event) {
        let target, phone, element;
        target = (event.currentTarget) ? event.currentTarget : event.srcElement;
        phone = target.value.replace(/\D/g, '');
        element = $(target);
        element.unmask();
        if (phone.length > 10) {
            element.mask("(99) 99999-9999");
        } else {
            element.mask("(99) 99999-9999");
        }
    });

$('#inptel').mask("(99) 9999-99999")
    .focusout(function (event) {
        let target, phone, element;
        target = (event.currentTarget) ? event.currentTarget : event.srcElement;
        phone = target.value.replace(/\D/g, '');
        element = $(target);
        element.unmask();
        element.mask("(99) 9999-99999");

    });
