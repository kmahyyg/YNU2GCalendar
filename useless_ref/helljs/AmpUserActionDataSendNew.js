var Wisedu = window.Wisedu || {};
Wisedu.userActionDataSendNew = function (ip, userType) {
    console.log("获取数据的点击量=" + AMPConfigure.schoolId);
    var appFlagId = "wiseduampAaA" + AMPConfigure.schoolId;
    var userActionDataJson = {
        appKey: "Other",
        appId: "Other",
        appName: "Other",
        userId: "Other",
        userName: "Other",
        userType: "Other",
        schoolId: "Other",
        browser: "Other",
        screenWH: "Other",
        deviceType: "Other",
        deviceModels: "Other",
        os: "Other",
        startTime: 0,
        city: "Other",
        province: "Other",
        ip: "Other",
        message: ""
        // is4Java: false,
        // is4Cookie: false,
        // language: "Other",
        // flash: "Other",
        // screenCD: "Other",
        // device: "Other",
        // userClientId: "Other",
        // userVistInsId: "Other",
        // homePage: false,
        // pageNumId: 0,
        // curPageUrl: "Other",
        // refPageUrl: "Other",

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

            var deferred = $.Deferred();
            var url = parent.window.AMPConstant.operationAnalysisRequestPath + "addUserActionData";
            $.ajax({
                type: 'get',
                //url: 'http://172.16.7.21:8086/httpbridge/UserActionDataController/addUserActionData',
                url: url,
                data: userActionDataJson,
                contentType: 'application/json;charset=utf-8',
                dataType: "jsonp",
                jsonp: "callback", //服务端用于接收callback调用的function名的参数   
                jsonpCallback: "appDataSendStatus", //callback的function名称,服务端会把名称和data一起传递回来   
                success: function (resp) {
                    deferred.resolve(resp);
                },
                error: function (resp) {
                    deferred.reject(resp);
                }
            });
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
                // var browserInfo = parser.getBrowser();
                // debugger
                // if (browserInfo && browserInfo.name) {
                // 	userActionDataJson.browser = browserInfo.name + " " + browserInfo.version;
                // }
                var osInfo = parser.getOS();
                if (osInfo && osInfo.name) {
                    userActionDataJson.os = osInfo.name + " " + osInfo.version;
                }
                var deviceInfo = parser.getDevice();
                if (deviceInfo) {
                    if (deviceInfo.model) {
                        userActionDataJson.deviceModels = deviceInfo.model;
                        userActionDataJson.deviceType = "移动端";
                    } else {
                        userActionDataJson.deviceModels = 'Other';
                        userActionDataJson.deviceType = "电脑端";
                    }
                }

                var agent = window.navigator.userAgent.toLowerCase();
                var s;
                if (/msie ([\d.]+)/.test(agent)) {
                    s = agent.match(/msie ([\d.]+)/);
                    userActionDataJson.browser = 'IE ' + s[1];
                } else if (/firefox\/([\d.]+)/.test(agent)) {
                    s = agent.match(/firefox\/([\d.]+)/);
                    userActionDataJson.browser = 'Firefox ' + s[1];
                } else if (/chrome\/([\d.]+)/.test(agent)) {
                    s = agent.match(/chrome\/([\d.]+)/);
                    if (/qqbrowser\/([\d.]+)/.test(agent)) {
                        userActionDataJson.browser = 'QQ浏览器';
                    } else if (/maxthon\/([\d.]+)/.test(agent)) {
                        userActionDataJson.browser = '遨游浏览器';
                    } else if (/metasr ([\d.]+)/.test(agent)) {
                        userActionDataJson.browser = '搜狗浏览器';
                    } else if (/lbbrowser/.test(agent)) {
                        userActionDataJson.browser = '猎豹浏览器';
                    } else if (/edge/.test(agent)) {
                        userActionDataJson.browser = 'Microsoft Edge';
                    } else {
                        userActionDataJson.browser = 'Chrome ' + s[1];
                    }
                } else if (/opera.([\d.]+)/.test(agent)) {
                    s = agent.match(/opera.([\d.]+)/);
                    userActionDataJson.browser = 'Opera ' + s[1];
                } else if (/version\/([\d.]+).*safari/.test(agent)) {
                    s = agent.match(/version\/([\d.]+).*safari/);
                    userActionDataJson.browser = 'Safari ' + s[1];
                } else if (Object.hasOwnProperty.call(window, "ActiveXObject") && !window.ActiveXObject) {
                    userActionDataJson.browser = 'IE 11.0';
                }

                // if (/IE/.test(userActionDataJson.browser)) {
                // 	var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                // 	if (swf) {
                // 		userActionDataJson.flash = "Flash " + Number(swf.GetVariable('$version').split(' ')[1]
                // 			.replace(/,/g, '.').replace(
                // 				/^(d+.d+).*$/, "$1"));
                // 	}
                // } else {
                // 	if (navigator.plugins && navigator.plugins.length > 0) {
                // 		var swf = navigator.plugins["Shockwave Flash"];
                // 		if (swf) {
                // 			var arr = swf.description.split(' ');
                // 			for (var i = 0, len = arr.length; i < len; i++) {
                // 				var ver = Number(arr[i]);
                // 				if (!isNaN(ver)) {
                // 					userActionDataJson.flash = "Flash " + ver;
                // 					break;
                // 				}
                // 			}
                // 		}
                // 	}
                // }

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
        setUserName: function () {
            try {
                // var userNameFlag = appFlagId + "userName";
                //var userName = sessionStorage[userNameFlag];
                var userName = sessionStorage['ampUserName'];
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

        // setPageNumId: function() {
        // 	try {
        // 		var pageNumIdFlag = appFlagId + "pageNumId";
        // 		var pageNumId = sessionStorage[pageNumIdFlag];
        // 		if (CommonUtil.isEmpty(pageNumId)) {
        // 			pageNumId = 1;
        // 			sessionStorage[pageNumIdFlag] = pageNumId;
        // 		} else {
        // 			pageNumId = eval(pageNumId) + 1;
        // 			sessionStorage[pageNumIdFlag] = pageNumId;
        // 		}
        // 		userActionDataJson.pageNumId = pageNumId;
        // 	} catch (e) {
        // 		CommonUtil.logError(e);
        // 	}
        // },
        // setCurPageUrl: function() {
        // 	try {
        // 		var curPageUrl = window.location.href;
        // 		curPageUrl = CommonUtil.getUrlNotParams(curPageUrl);
        // 		userActionDataJson.curPageUrl = curPageUrl;
        // 		var refPageUrl = document.referrer;
        // 		refPageUrl = CommonUtil.getUrlNotParams(refPageUrl);
        // 		userActionDataJson.refPageUrl = refPageUrl;
        // 	} catch (e) {
        // 		CommonUtil.logError(e);
        // 	}
        // },
        setStartTime: function () {
            var startTime = new Date().getTime();
            userActionDataJson.startTime = startTime;
        },
        setIp: function () {
            if (returnCitySN && returnCitySN["cip"]) {
                userActionDataJson.ip = returnCitySN["cip"];
            } else {
                userActionDataJson.ip = "";
            }
        },
        setGeolocation: function () {
            //通过调用新浪IP地址库接口查询用户当前省份和城市
            var protocol = window.location.protocol;
            if (protocol && protocol === 'https:') {
                $.getScript('https://ipip.yy.com/get_ip_info.php', function() {
                    if (returnInfo && returnInfo.province) {
                        userActionDataJson.province = returnInfo.province;
                    } else {
                        userActionDataJson.province = "";
                    }
                    if (returnInfo && returnInfo.city) {
                        userActionDataJson.city = returnInfo.city;
                    } else {
                        userActionDataJson.city = "";
                    }
                });
            } else {
                $.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js', function() {
                    if (remote_ip_info && remote_ip_info.province) {
                        userActionDataJson.province = remote_ip_info.province;
                    } else {
                        userActionDataJson.province = "";
                    }
                    if (remote_ip_info && remote_ip_info.city) {
                        userActionDataJson.city = remote_ip_info.city;
                    } else {
                        userActionDataJson.city = "";
                    }
                });
            }
        },
        init: function () {
            try {
                var arry = appFlagId.split("AaA");
                userActionDataJson.appId = userActionDataJson.appKey = arry[0];
                userActionDataJson.schoolId = arry[1];
                userActionDataJson.appName = '校内门户';
                userActionDataJson.userType = userType;
                userActionDataJson.ip = ip;
                this.setStartTime();
                this.setClientAttrInfo();
                this.setUserId();
                this.setUserName();
                // this.setIp();
                this.setGeolocation();
                // this.setUserVistInsId();
                // this.setUserClientId();
                // this.setPageNumId();
                // this.setCurPageUrl();
            } catch (e) {
                CommonUtil.logError(e);
            }
        }
    };
    try {
        InitData.init();
        CommonUtil.sendData();
    } catch (e) {
        CommonUtil.logError(e);
    }
};

window.onload = function() {
    if (parent.window.AMPConstant.operationAnalysisRequestPath) {
        Wisedu.userActionDataSend();
        var senduserIp = sessionStorage["ampUserIp"];
        var senduserType = sessionStorage["userType"];
        Wisedu.userActionDataSendNew(senduserIp, senduserType);
    } else {
        Wisedu.userActionDataSend();
    }
}