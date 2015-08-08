window.vault = window.vault || {};

window.vault.crypto = (function ($) {

    /**
     *
     * @param masterPassword
     * @param account
     * @param plainText
     * @returns {{account: *, ct: string, iv: string, salt: string}}
     */
    function crypt(masterPassword, account, plainText) {

        var encrypted = CryptoJS.AES.encrypt(plainText, masterPassword);

        var result = {
            account: account,
            secret: encrypted.toString()
        };

        return result;
    }

    function decrypt(secret, masterPassword)
    {
        var decrypted = CryptoJS.AES.decrypt(secret, masterPassword);
        return decrypted;
    }

    return {
        crypt: crypt,
        decrypt: decrypt
    };

})(jQuery);
