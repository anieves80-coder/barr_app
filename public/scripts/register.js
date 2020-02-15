$("#registerForm").submit(function(event){
    event.preventDefault();
    const pwd2 = $("#registerPassword2").val().trim();
    const formData = {
        userName : $("#registerUsername").val().trim(),
        email    : $("#registerEmail").val().trim(),
        pwd      : $("#registerPassword1").val().trim()        
    }
    
    if(formData.pwd === pwd2){        
        $.post("/data/registerUser", formData).then( function(res){
            if(res.status === "ok"){                
                clrFrm(); 
                window.location.href = `/`;               
            } else {
                setErr(res.status);
            }
        });
    } else {
        setErr("Passwords must match!");
    }
    
});


function setErr(msg){ $("#regErrMsg").text(msg); }

function clrFrm(){ 
    $("#registerForm").trigger("reset"); 
    setErr("");
}
