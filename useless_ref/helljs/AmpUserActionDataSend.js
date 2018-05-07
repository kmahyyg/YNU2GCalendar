var Wisedu = window.Wisedu || {};
Wisedu.userActionDataSend = function (siteType) {
    var appFlagId = "wiseduampAaA" + AMPConfigure.schoolId;
    var userActionDataJson = {
        browser: "Other",
        screenWH: "Other",
        is4Java: false,
        is4Cookie: false,
        language: "Other",
        flash: "Other",
        screenCD: "Other",
        os: "Other",
        device: "Other",
        userClientId: "Other",
        userVistInsId: "Other",
        userId: "Other",
        appkey: "Other",
        schoolId: "Other",
        homePage: false,
        pageNumId: 0,
        curPageUrl: "Other",
        refPageUrl: "Other",
        startTime: 0,
        userName: "Other"
    };
    var userNewAnalysisDataJson = {
        schoolId: "Other",
        userId: "guest",
        userName: "Other",
        userType: "Other",
        userDepartment: "Other",
        userSex: "Other",
        siteType: "Other"
    };
    var CommonUtil = {
        logError: function (e) {
            if (window.console) {
                console.log(e.message);
            }
        },
        isEmpty: function (o) {
            return ((null == o) || (undefined == o) || ("" == o) || (o.length < 1));
        },
        getUrlNotParams: function (url) {
            if (url.indexOf("?") != -1) {
                var str = url.split("?");
                return str[0];
            }
            return url;
        },
        appDataSendStatus: window.appDataSendStatus = function (status) {

        },
        sendData: function () {
            try {
                var userActionData = "userActionDataAaA" + JSON.stringify(userActionDataJson);
                var protocol = window.location.protocol;
                var url = protocol + "//www.campusphere.cn/dataproxy/messagebus/queues/appDataQueue/messages" + "?secret=iojawdnaisdflknoiankjfdblaidcas&apiType=produce&token=iojawdnaisdflknoiankjfdblaidcas&contentType=text/plain" + "&content=" + encodeURIComponent(encodeURIComponent(userActionData)) + "&callback=appDataSendStatus" + "&timeFlag=" + new Date().getTime();
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = url;
                var scriptId = new Date().getTime();
                script.id = scriptId;
                document.body.appendChild(script);
                document.body.removeChild(document.getElementById(scriptId));
            } catch (e) {
                this.logError(e);
            }
        },
        sendDataByNewAnalysis: function () {
            try {
                var userId = userNewAnalysisDataJson.userId;
                AmpUtils.dataAnalysis(userId, userNewAnalysisDataJson, 'identify');
            } catch (e) {
                this.logError(e);
            }
        },
        createRandomNum: function () {
            try {
                var len = 20;
                var rdmstring = "";
                for (; rdmstring.length < len; rdmstring += Math.random().toString(36).substr(2));
                return rdmstring.substr(0, len);
            } catch (e) {
                this.logError(e);
            }
        },
        strTrim: function (str) {
            if (!str || "" == str) {
                return "";
            }
            for (; str.charAt(0).length > 0 && " \n\r\t".indexOf(str.charAt(0)) > -1;) {
                str = str.substring(1);
            }
            for (; str.charAt(str.length - 1).length > 0 && " \n\r\t".indexOf(str.charAt(str.length - 1)) > -1;) {
                str = str.substring(0, str.length - 1);
            }
            return str;
        },
        setCookie: function (key, v) {
            try {
                var d = new Date();
                d.setTime(d.getTime() + 1000 * 60 * 60 * 24 * 365 * 2);
                var expires = "expires=" + d.toGMTString();
                document.cookie = this.strTrim(key) + "=" + v + "; " + expires + "; path=/";
            } catch (e) {
                this.logError(e);
            }
        },
        getCookie: function (key) {
            try {
                var cookie = document.cookie;
                var cookieArry = cookie.split(";");
                var len = cookieArry.length;
                var i;
                var arr;
                for (i = 0; i < len; i++) {
                    arr = cookieArry[i].split("=");
                    if (this.strTrim(arr[0]) == this.strTrim(key)) {
                        return arr[1];
                    }

                }
                return "";
            } catch (e) {
                this.logError(e);
            }
        }
    };
    var InitData = {
        setClientAttrInfo: function () {
            try {
                userActionDataJson.screenWH = (window.screen.width || 0) + "x" + (window.screen.height || 0);
                userActionDataJson.is4Java = window.navigator.javaEnabled();
                userActionDataJson.is4Cookie = window.navigator.cookieEnabled;
                userActionDataJson.language = navigator.language || navigator.systemLanguage || navigator.userLanguage || "Other";
                userActionDataJson.screenCD = (window.screen.colorDepth + "-bit") || (0 + "-bit");

                var parser = new UAParser();
                var browserInfo = parser.getBrowser();
                if (browserInfo && browserInfo.name) {
                    userActionDataJson.browser = browserInfo.name + " " + browserInfo.version;
                }
                var osInfo = parser.getOS();
                if (osInfo && osInfo.name) {
                    userActionDataJson.os = osInfo.name + " " + osInfo.version;
                }
                var deviceInfo = parser.getDevice();
                if (deviceInfo) {
                    if (deviceInfo.model) {
                        userActionDataJson.device = deviceInfo.model;
                    } else {
                        userActionDataJson.device = "PC";
                    }
                }

                if (/IE/.test(userActionDataJson.browser)) {
                    var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                    if (swf) {
                        userActionDataJson.flash = "Flash " + Number(swf.GetVariable('$version').split(' ')[1]
                                .replace(/,/g, '.').replace(
                                    /^(d+.d+).*$/, "$1"));
                    }
                } else {
                    if (navigator.plugins && navigator.plugins.length > 0) {
                        var swf = navigator.plugins["Shockwave Flash"];
                        if (swf) {
                            var arr = swf.description.split(' ');
                            for (var i = 0, len = arr.length; i < len; i++) {
                                var ver = Number(arr[i]);
                                if (!isNaN(ver)) {
                                    userActionDataJson.flash = "Flash " + ver;
                                    break;
                                }
                            }
                        }
                    }
                }
                //					var agent = window.navigator.userAgent.toLowerCase();
                //					var s;
                //					if(/msie ([\d.]+)/.test(agent)){
                //						s = agent.match(/msie ([\d.]+)/);
                //						userActionDataJson.browser='IE '+s[1];
                //					}else if(/firefox\/([\d.]+)/.test(agent)){
                //						//s = agent.match(/firefox\/([\d.]+)/);
                //						userActionDataJson.browser='Firefox';
                //					}else if(/chrome\/([\d.]+)/.test(agent)){
                //						//s = agent.match(/chrome\/([\d.]+)/);
                //						if(/qqbrowser\/([\d.]+)/.test(agent)){
                //							userActionDataJson.browser='QQ浏览器';
                //						}else if(/maxthon\/([\d.]+)/.test(agent)){
                //							userActionDataJson.browser='遨游浏览器';
                //						}else if(/metasr ([\d.]+)/.test(agent)){
                //							userActionDataJson.browser='搜狗浏览器';
                //						}else if(/lbbrowser/.test(agent)){
                //							userActionDataJson.browser='猎豹浏览器';
                //						}else if(/edge/.test(agent)){
                //							userActionDataJson.browser='Microsoft Edge';
                //						}else{
                //							userActionDataJson.browser='Chrome';
                //						}
                //					}else if(/opera.([\d.]+)/.test(agent)){
                //						//s = agent.match(/opera.([\d.]+)/);
                //						userActionDataJson.browser='Opera';
                //					}else if(/version\/([\d.]+).*safari/.test(agent)) {
                //						//s = agent.match(/version\/([\d.]+).*safari/);
                //						userActionDataJson.browser='Safari';
                //					}else if(Object.hasOwnProperty.call(window, "ActiveXObject") && !window.ActiveXObject){
                //						userActionDataJson.browser='IE 11';
                //					}
                //					userActionDataJson.screenWH = (window.screen.width || 0) + "x" + (window.screen.height || 0);
                //					userActionDataJson.is4Java = window.navigator.javaEnabled();
                //					userActionDataJson.is4Cookie = window.navigator.cookieEnabled;
                //					userActionDataJson.language = navigator.language || navigator.systemLanguage || navigator.userLanguage || "Other";
                //					if(/IE/.test(userActionDataJson.browser)){
                //						var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                //						if (swf) {
                //							userActionDataJson.flash = "Flash "+Number(swf.GetVariable('$version').split(' ')[1].replace(/,/g, '.').replace(/^(d+.d+).*$/, "$1"));
                //						}
                //					}else{
                //						if (navigator.plugins && navigator.plugins.length > 0) {
                //							var swf = navigator.plugins["Shockwave Flash"];
                //							if (swf) {
                //								var arr = swf.description.split(' ');
                //								for (var i = 0, len = arr.length; i < len; i++) {
                //									var ver = Number(arr[i]);
                //									if (!isNaN(ver)) {
                //										userActionDataJson.flash = "Flash "+ver;
                //										break;
                //									}
                //								}
                //							}
                //						}
                //					}
                //					userActionDataJson.screenCD = (window.screen.colorDepth+"-bit") || (0+"-bit");
                //					var plateform = window.navigator.platform.toLowerCase();
                //					if(/win/.test(plateform)){
                //						if(agent.indexOf("windows nt 5.0") > -1){
                //							userActionDataJson.os = "Win 2000";
                //						}else if(agent.indexOf("windows nt 5.1") > -1){
                //							userActionDataJson.os = "Win XP";
                //						}else if(agent.indexOf("windows nt 5.2") > -1){
                //							userActionDataJson.os = "Win 2003";
                //						}else if(agent.indexOf("windows nt 6.0") > -1){
                //							userActionDataJson.os = "Windows Vista";
                //						}else if(agent.indexOf("windows nt 6.1") > -1 || agent.indexOf("Windows 7") > -1){
                //							userActionDataJson.os = "Win 7";
                //						}else if(agent.indexOf("windows 8") > -1){
                //							userActionDataJson.os = "Win 8";
                //						}else if(agent.indexOf("windows 10") > -1){
                //							userActionDataJson.os = "Win 10";
                //						}
                //					}else if(/mac/.test(plateform)){
                //						userActionDataJson.os = "Mac Os";
                //					}
                //					var bIsIpad = agent.match(/ipad/i) == "ipad";
                //					var bIsIphoneOs = agent.match(/iphone os/i) == "iphone os";
                //					var bIsMidp = agent.match(/midp/i) == "midp";
                //					var bIsUc7 = agent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
                //					var bIsUc = agent.match(/ucweb/i) == "ucweb";
                //					var bIsAndroid = agent.match(/android/i) == "android";
                //					var bIsCE = agent.match(/windows ce/i) == "windows ce";
                //					var bIsWM = agent.match(/windows mobile/i) == "windows mobile";
                //					if (bIsIpad ||bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM){
                //						userActionDataJson.device = "Phone";
                //					}else {
                //						userActionDataJson.device = "PC";
                //					}
            } catch (e) {
                CommonUtil.logError(e);
            }
        },
        setUserVistInsId: function () {
            try {
                var userVistInsIdFlag = appFlagId + "userVistInsId";
                var userVistInsId = sessionStorage[userVistInsIdFlag];
                if (CommonUtil.isEmpty(userVistInsId)) {
                    userActionDataJson.homePage = true;
                    var pageNumIdFlag = appFlagId + "pageNumId";
                    var pageNumId = 0;
                    sessionStorage[pageNumIdFlag] = pageNumId;
                    userVistInsId = new Date().getTime() + "" + CommonUtil.createRandomNum();
                    sessionStorage[userVistInsIdFlag] = userVistInsId;

                }
                userActionDataJson.userVistInsId = userVistInsId;
            } catch (e) {
                CommonUtil.logError(e);
            }
        },
        setUserClientId: function () {
            try {

                var key = "userClientId";
                var userClientId = CommonUtil.getCookie(key);
                if (CommonUtil.isEmpty(userClientId)) {
                    userClientId = new Date().getTime() + "" + CommonUtil.createRandomNum();
                    CommonUtil.setCookie(key, userClientId);
                }
                userActionDataJson.userClientId = userClientId;
            } catch (e) {
                CommonUtil.logError(e);
            }
        },
        setUserId: function () {
            var userId = "";
            try {
                var userIdFlag = "ampUserId";
                userId = sessionStorage[userIdFlag];
                if (CommonUtil.isEmpty(userId)) {
                    userId = document.getElementById("analysisUserId").value;
                    if (CommonUtil.isEmpty(userId)) {
                        sessionStorage[userIdFlag] = "";
                    } else {
                        sessionStorage[userIdFlag] = userId;
                    }
                }
                userActionDataJson.userId = userId;
            } catch (e) {
                userId = "Other";
                CommonUtil.logError(e);
            }
        },
        setUserIdNew: function () {
            var userId = "";
            try {
                var userIdFlag = "ampUserId";
                userId = sessionStorage[userIdFlag];
                if (CommonUtil.isEmpty(userId)) {
                    userId = document.getElementById("analysisUserId").value;
                    if (CommonUtil.isEmpty(userId)) {
                        sessionStorage[userIdFlag] = "guest";
                    } else {
                        sessionStorage[userIdFlag] = userId;
                    }
                }
                userNewAnalysisDataJson.userId = userId;
            } catch (e) {
                userId = "guest";
                CommonUtil.logError(e);
            }
        },
        setUserName: function () {
            try {
                var userNameFlag = appFlagId + "userName";
                var userName = sessionStorage[userNameFlag];
                if (CommonUtil.isEmpty(userName)) {
                    userName = document.getElementById("analysisUserName").value;
                    if (CommonUtil.isEmpty(userName)) {
                        sessionStorage[userNameFlag] = "";
                    } else {
                        sessionStorage[userNameFlag] = userName;
                    }
                }
                userActionDataJson.userName = userName;
            } catch (e) {
                CommonUtil.logError(e);
            }
        },
        setUserNameNew: function () {
            try {
                var userNameNew = sessionStorage["ampUserName"];
                if (userNameNew)
                    userNewAnalysisDataJson.userName = userNameNew;
            } catch (e) {
                CommonUtil.logError(e);
            }
        },
        setUserType: function () {
            try {
                var userType = sessionStorage["ampUserTypeName"];
                if (CommonUtil.isEmpty(userType)) {
                    userType = document.getElementById("analysisUserType").value;
                } else {
                    sessionStorage["ampUserTypeName"] = userType;
                }
                userNewAnalysisDataJson.userType = userType;
            } catch (e) {
                CommonUtil.logError(e);
            }
        },
        setUserDepartment: function () {
            try {
                var userDepartment = sessionStorage["ampUserDepartment"];
                if (CommonUtil.isEmpty(userDepartment)) {
                    userDepartment = document.getElementById("analysisUserDepartment").value;
                } else {
                    sessionStorage["ampUserDepartment"] = userDepartment;
                }
                userNewAnalysisDataJson.userDepartment = userDepartment;
            } catch (e) {
                CommonUtil.logError(e);
            }
        },
        setUserSex: function () {
            try {
                var userSex = sessionStorage["ampUserSex"];
                if (CommonUtil.isEmpty(userSex)) {
                    userSex = document.getElementById("analysisUserSex").value;
                } else {
                    sessionStorage["ampUserSex"] = userSex;
                }
                userNewAnalysisDataJson.userSex = userSex;
            } catch (e) {
                CommonUtil.logError(e);
            }
        },
        setSiteType: function () {
            try {
                if (siteType) {
                    userNewAnalysisDataJson.siteType = siteType;
                }
            } catch (e) {
                CommonUtil.logError(e);
            }
        },
        setPageNumId: function () {
            try {
                var pageNumIdFlag = appFlagId + "pageNumId";
                var pageNumId = sessionStorage[pageNumIdFlag];
                if (CommonUtil.isEmpty(pageNumId)) {
                    pageNumId = 1;
                    sessionStorage[pageNumIdFlag] = pageNumId;
                } else {
                    pageNumId = eval(pageNumId) + 1;
                    sessionStorage[pageNumIdFlag] = pageNumId;
                }
                userActionDataJson.pageNumId = pageNumId;
            } catch (e) {
                CommonUtil.logError(e);
            }
        },
        setCurPageUrl: function () {
            try {
                var curPageUrl = window.location.href;
                curPageUrl = CommonUtil.getUrlNotParams(curPageUrl);
                userActionDataJson.curPageUrl = curPageUrl;
                var refPageUrl = document.referrer;
                refPageUrl = CommonUtil.getUrlNotParams(refPageUrl);
                userActionDataJson.refPageUrl = refPageUrl;
            } catch (e) {
                CommonUtil.logError(e);
            }
        },
        setStartTime: function () {
            var startTime = new Date().getTime();
            userActionDataJson.startTime = startTime;
        },
        init: function () {
            try {
                var arry = appFlagId.split("AaA");
                userActionDataJson.appkey = arry[0];
                userActionDataJson.schoolId = arry[1];
                userNewAnalysisDataJson.schoolId = arry[1];
                this.setUserVistInsId();
                this.setStartTime();
                this.setClientAttrInfo();
                this.setUserClientId();
                this.setUserId();
                this.setUserIdNew();
                this.setUserName();
                this.setUserNameNew();
                this.setPageNumId();
                this.setCurPageUrl();
                this.setUserType();
                this.setUserDepartment();
                this.setUserSex();
                this.setSiteType();
            } catch (e) {
                CommonUtil.logError(e);
            }
        }
    };
    try {
        InitData.init();
        CommonUtil.sendData();
        CommonUtil.sendDataByNewAnalysis(); //glhan发送到新的统计分析
    } catch (e) {
        CommonUtil.logError(e);
    }
};
window.onload = function () {
    if (parent.window.AMPConstant.operationAnalysisRequestPath) {
        Wisedu.userActionDataSend();

        var senduserIp = sessionStorage["ampUserIp"];
        var senduserType = sessionStorage["userType"];
        Wisedu.userActionDataSendNew(senduserIp, senduserType);
    } else {
        Wisedu.userActionDataSend();
    }

}