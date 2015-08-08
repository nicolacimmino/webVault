window.vault = window.vault || {};

window.vault.ui = (function ($) {

    function init() {
        onPlainTextChange();
        populateSavedSecretsMenu();
    }

    function onPlainTextChange() {
        var masterPassword = $("#masterPasswordEncrypt").val() || '';
        var account = $("#account").val() || '';
        var username = $("#username").val() || '';
        var password = $("#password").val() || '';

        var plaintext = JSON.stringify({
            username: username,
            password: password
        });

        var encrypted = window.vault.crypto.crypt(masterPassword, account, plaintext);
        encrypted = JSON.stringify(encrypted, null, 2);

        $("#encrypted").text(encrypted);
        $('#qrcode').html('<div id="qrcodecanvas"></div>');
        $('#qrcodecanvas').qrcode(encrypted);
    }

    function onStoreRequested() {
        var account = $("#account").val();
        var secret = $("#encrypted").text();
        localStorage.setItem(account + ".cyp", secret);
    }

    function populateSavedSecretsMenu() {
        for (var fileName in localStorage) {
            $("#savedSecretsMenu").append(
                '<li><a href="#">' + fileName + '</a></li>'
            );
        }
    }

    function onEncryptedTextChange() {
        var masterPassword = $("#masterPasswordDecrypt").val() || '';
        var encryptedText = $.parseJSON($("#encryptedText").val());

        var decrypted = vault.crypto.decrypt(encryptedText.secret, masterPassword);
        var decryptedObj = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));

        $("#decrypted").text("");
        var tableHtml = "<table class='table table-condensed'>";
        jQuery.each(decryptedObj, function(i, val) {
            tableHtml += ("<tr><td>" + i + "</td><td>" + val + "</td></tr></tr>");
        });
        tableHtml += "</table>";
        $("#decrypted").append(tableHtml);

    }

    return {
        init: init,
        onPlainTextChange: onPlainTextChange,
        onStoreRequested: onStoreRequested,
        populateSavedSecretsMenu: populateSavedSecretsMenu,
        onEncryptedTextChange: onEncryptedTextChange
    };

})(jQuery);

window.vault.ui.init();

/*
 function decrypt() {
 //ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
 //cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv)
 //cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s)

 var encrypted = $("#encrypted").val();
 var decrypted = CryptoJS.AES.decrypt(encrypted, $("#masterPassword").val());
 $("#plaintext").val(decrypted.toString(CryptoJS.enc.Utf8));
 }


 */

