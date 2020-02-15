$(document).ready(function() {    

    $("#changePwdForm").submit(function(event){
        event.preventDefault();

        const pwd = $("#changePassword1").val().trim();
        const pwd2 = $("#changePassword2").val().trim();
        
        if(pwd === pwd2){
            $.post("/data/pwdChange",{pwd}).then( data => {
                if(data.msg)
                    window.location.href = `/saved`;
                else
                    window.location.href = `/saved`;
            });
        } else {
            $("#pwdChngErrMsg").text("Passwords must match.");
        }
    });


});