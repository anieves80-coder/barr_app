$(document).ready(function() {
    

    $("#recoverForm").submit(function(event){
        event.preventDefault();        
        $.post("/data/getToken", {email: $("#recoveryEmail").val().trim()}).then( res => {
            if(res.msg){
                showTokenForm(); 
                $("#recoveryEmail").attr("disabled", "disabled");       
                $("#tokenMsg").text("Check your email for the recovery code.");
                $("#recErrMsg").text("");
            } else {
                $("#recErrMsg").text("Invalid email.");
            }
        });
    });

    $("#tokenForm").submit(function(event){
        event.preventDefault();
        $.post("/data/verifyToken", {token: $("#token").val().trim(), email:$("#recoveryEmail").val().trim()}).then(msg => {
            if(msg.status)
                window.location.href = `/changePassword`;
            else
                $("#tokenMsg").text("Verify your recovery code. Code didnt match our records.");
        });
    });

    function showTokenForm(){

        $("#tokenForm").html(`
            <div class="form-row">
                <div class="col-md-4 mb-3">
                    <label for="token"><i class="fas fa-undo"></i> Recovery Code</label>
                    <input type="text" class="form-control" id="token" required>
                </div>
            </div>        
            <div class="form-row mb-3">
                <div class="col">
                    <span class="text-success" id="tokenMsg"></span>
                </div>
            </div>
            <div class="form-row">
                <div class="col-md-4 mb-3">                
                    <button type="submit" class="btn btn-info" id="verifyTokenBtn">Reset Password</button>
                </div>
            </div>
        `);

    }

});