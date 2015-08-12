window.vault = window.vault || {};

window.vault = (function ($, url) {

    function init() {
        onPlainTextChange();
        populateSavedSecretsMenu();
        processQueryString();
        updateSaveMasterPasswordButton();
    }

    function processQueryString() {

        (url('?action') == 'decrypt') ? showDecryptPanel() : showEncryptPanel();

        if (url("?secret")) {
            showDecryptPanel();
            $("#encryptedText").val(url("?secret"));
        }
    }

    function decryptStoredFile(file) {
        showDecryptPanel();
        $("#encryptedText").val(localStorage.getItem(file + ".cyp"));
        onEncryptedTextChange();
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
        var masterPassword = getCurrentMasterPassword();
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

    function showSecretQRCode() {
        $("#qrCodeModalLabel").text("Secret");
        var toShow = $("#encrypted").text();
        $('#qrcode').html('<div id="qrcodecanvas"></div>');
        showQRCode(toShow);
    }

    function showSecretLinkQRCode() {
        $("#qrCodeModalLabel").text("Secret URL");
        var toShow = $("#decryptUrl").text();
        showQRCode(toShow);
    }

    function showQRCode(toShow) {
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
            if (fileName.slice(-4) != ".cyp") {
                continue;
            }
            fileName = fileName.replace(".cyp", "");
            savedSecretsMenu.append(
                '<li><a onclick="window.vault.decryptStoredFile(\'' + fileName + '\')">' + fileName + '</a></li>'
            );
        }
    }

    function onMasterPasswordSave() {
        var masterPassword = $("#masterPasswordSetup").val() || '';
        sessionStorage.setItem("masterPassword", masterPassword);
        updateSaveMasterPasswordButton();
    }

    function onMasterPasswordClear() {
        $("#masterPasswordSetup").val("");
        sessionStorage.removeItem("masterPassword");
        updateSaveMasterPasswordButton();
    }

    function updateSaveMasterPasswordButton() {
        if (sessionStorage.getItem("masterPassword") != null) {
            $("#buttonSaveMasterPassword").hide();
            $("#buttonClearMasterPassword").show();
        }
        else {
            $("#buttonSaveMasterPassword").show();
            $("#buttonClearMasterPassword").hide();
        }
    }

    function getCurrentMasterPassword() {
        return sessionStorage.getItem("masterPassword") || $("#masterPasswordSetup").val() || '';
    }

    function onEncryptedTextChange() {
        var masterPassword = getCurrentMasterPassword();
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
            $("#decrypted").text("");
        }
    }

    return {
        init: init,
        onPlainTextChange: onPlainTextChange,
        onStoreRequested: onStoreRequested,
        populateSavedSecretsMenu: populateSavedSecretsMenu,
        onEncryptedTextChange: onEncryptedTextChange,
        showSecretQRCode: showSecretQRCode,
        showSecretLinkQRCode: showSecretLinkQRCode,
        decryptStoredFile: decryptStoredFile,
        onMasterPasswordSave: onMasterPasswordSave,
        onMasterPasswordClear: onMasterPasswordClear
    };

})(jQuery, url);

window.vault.init();
