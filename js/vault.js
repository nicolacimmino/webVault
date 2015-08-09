window.vault = window.vault || {};

window.vault.ui = (function ($, url) {

    function init() {
        onPlainTextChange();
        populateSavedSecretsMenu();
        processQueryString();
    }

    function processQueryString() {

        (url('?action') == 'decrypt') ? showDecryptPanel() : showEncryptPanel();

        if (url("?secret")) {
            showDecryptPanel();
            $("#encryptedText").val(url("?secret"));
        }

        if (url("?file")) {
            showDecryptPanel();
            $("#encryptedText").val(localStorage.getItem(url("?file")));
        }
    }

    function showEncryptPanel() {
        $("#panelDecrypt").hide();
        $("#panelEncrypt").show();
    }

    function showDecryptPanel() {
        $("#panelDecrypt").show();
        $("#panelEncrypt").hide();
    }

    function onPlainTextChange() {
        var masterPassword = $("#masterPasswordEncrypt").val() || '';
        var account = $("#account").val() || '';
        var username = $("#username").val() || '';
        var password = $("#password").val() || '';

        var plaintext = JSON.stringify({
            account: account,
            username: username,
            password: password
        });

        var encrypted = CryptoJS.AES.encrypt(plaintext, masterPassword).toString();

        $("#encrypted").text(encrypted);

        var url = $(location).attr('origin') + "?secret=" + encodeURIComponent(encrypted);
        $("#decryptUrl").text("");
        $("#decryptUrl").append("<a href='" + url + "'>" + url + "</a>");

    }

    function showSecretQRCode()
    {
        $("#qrCodeModalLabel").text("Secret");
        var toShow = $("#encrypted").text();
        $('#qrcode').html('<div id="qrcodecanvas"></div>');
        showQRCode(toShow);
    }

    function showSecretLinkQRCode()
    {
        $("#qrCodeModalLabel").text("Secret URL");
        var toShow = $("#decryptUrl").text();
        showQRCode(toShow);
    }

    function showQRCode(toShow)
    {
        $('#qrcode').html('<div id="qrcodecanvas"></div>');
        $('#qrcodecanvas').qrcode(toShow);
        $('#qrCodeText').text(toShow);
    }

    function onStoreRequested() {
        var account = $("#account").val();
        var secret = $("#encrypted").text();
        localStorage.setItem(account + ".cyp", secret);
        populateSavedSecretsMenu();
    }

    function populateSavedSecretsMenu() {
        var savedSecretsMenu = $("#savedSecretsMenu");
        savedSecretsMenu.text("");
        for (var fileName in localStorage) {
            savedSecretsMenu.append(
                '<li><a href="?file=' + fileName + '">' + fileName + '</a></li>'
            );
        }
    }

    function onEncryptedTextChange() {
        var masterPassword = $("#masterPasswordDecrypt").val() || '';
        var encryptedText = $("#encryptedText").val();

        $("#decrypted").text("");
        try {
            var decrypted = CryptoJS.AES.decrypt(encryptedText, masterPassword).toString(CryptoJS.enc.Utf8);

            try {
                var decryptedObj = JSON.parse(decrypted);
                var tableHtml = "<br><table class='table table-condensed'>";
                jQuery.each(decryptedObj, function (i, val) {
                    tableHtml += ("<tr><td>" + i + "</td><td>" + val + "</td></tr></tr>");
                });
                tableHtml += "</table>";
                $("#decrypted").append(tableHtml);
            } catch (e) {
                $("#decrypted").text(decrypted);
            }
        }
        catch (e) {
            $("#decrypted").text("Invalid master password!");
        }
    }

    return {
        init: init,
        onPlainTextChange: onPlainTextChange,
        onStoreRequested: onStoreRequested,
        populateSavedSecretsMenu: populateSavedSecretsMenu,
        onEncryptedTextChange: onEncryptedTextChange,
        showSecretQRCode: showSecretQRCode,
        showSecretLinkQRCode: showSecretLinkQRCode
    };

})(jQuery, url);

window.vault.ui.init();
