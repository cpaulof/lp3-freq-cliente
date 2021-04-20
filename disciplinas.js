function getURLParameter(url, name) {
    return (RegExp(name + '=' + '(.+?)(&|$)').exec(url)||[,null])[1];
}
var TOKEN = 0;

	




$(document).ready(function(){
    var url = $(location).attr('href');
    TOKEN = getURLParameter(url, 'token');
    //$("#disc").html(TOKEN);
});

function getDays(days){
    var dias = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];
    var r = [];
    for(var i=0; i<days.length; i++){
        var idx = parseInt(days[i]) - 2;
        r.push(dias[idx]);
    }
    return r.join("|");
}


$("#btnDisc").click(function(){

    //console.log(TOKEN);
    if(TOKEN[TOKEN.length-1] == "#"){
        TOKEN = TOKEN.substring(0, TOKEN.length-1);
    }
    $.get("http://10.0.0.108:8080/classlist?token="+TOKEN, function(data){
    //console.log(JSON.stringify(data));
    if(data.type="success"){
        var classes = data.classes;
        
        var root = $(".container");
        root.append("<ul id=\"list\" class=\"list-group\">");
        var lista = $("#list");
        lista.html("");
        classes.forEach(c => {
            var a = "<a classId=\""+c.id+"\" horarioId=\""+c.horarioid+"\"href=\"#\" class=\"list-group-item list-group-item-action\" ><div class=\"d-flex w-100 justify-content-between\">";
            a = a + "<h5 class=\"mb-1\">"+c.nome+"</h5>";
            a = a + "<small>"+getDays(c.dias)+"</small>";
            a = a + "</div><p class=\"mb-1\">Inicio: "+c.inicio+"</p>";
            a = a + "<p class=\"mb-1\">Fim: "+c.fim+"</p>";
            a = a + "<p hidden id=\"alert\" class=\"mb-1 alert alert-info\" style=\"font-size:15px; padding:0; padding-left:10;\">Alerta</p></a>";
            lista.append(a);
        });
    };
    $("#list a").each(function(){
        var g = this;
        $(this).click(function(){
            var classId = $(g).attr("classId");
            var horarioId = $(g).attr("horarioId");
            if(TOKEN[TOKEN.length-1] == "#"){
                TOKEN = TOKEN.substring(0, TOKEN.length-1);
            }
            var url = "http://10.0.0.108:8080/presenca?token="+TOKEN+"&classid="+classId+"&horarioid="+horarioId+"&position="+LAT+","+LON;
            //$("#disc").html(url);
            //console.log(url);
            $.get(url, function(data){
                //console.log(JSON.stringify(data));
                var palert = $(g).children("#alert");
                palert.html(data.type);
                palert.attr("hidden", false);
                setTimeout(function(){
                    palert.attr("hidden", true);
                }, 2000);
            })
        })
        
    })
        
    //$("#disc").html(JSON.stringify(data));
    
        }).fail(function(data){
            //$("#disc").html("FAIL: " + JSON.stringify(data));
            console.log("FAIL: " + JSON.stringify(data))
    
        });
});



