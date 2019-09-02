function _etd(_p0) {
    try {
        var _p2 = encryptAES(_p0, pwdDefaultEncryptSalt);
        $("#casLoginForm").find("#passwordEncrypt").val(_p2);
    } catch (e) {
        $("#casLoginForm").find("#passwordEncrypt").val(_p0);
    }
}

// Current using etd2, p0=password, p1=salt
function _etd2(_p0, _p1) {
    try {
        var _p2 = encryptAES(_p0, _p1);
        $("#casLoginForm").find("#passwordEncrypt").val(_p2);
    } catch (e) {
        $("#casLoginForm").find("#passwordEncrypt").val(_p0);
    }
}