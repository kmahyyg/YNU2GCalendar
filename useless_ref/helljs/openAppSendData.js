var Wisedu = window.Wisedu || {};
Wisedu.ampAppDataSend = function (schoolId, userID, ip, appkey, appId, appName,siteType, appurl) {
    var userActionDataJson = {
        browser: "Other", //浏览器名称
        screenWH: "Other", //屏幕分辨率
        is4Java: false, //是否支持java
        is4Cookie: false, //是否支持cookie
        language: "Other", //浏览器使用语言
        flash: "Other", //flash支持的版本
        screenCD: "Other", //浏览器调色板的比特深度
        os: "Other", //操作系统
        device: "Other", //使用设备(区分为PC或Phone)
        userClientId: "Other", //浏览器客户端唯一标志(cookie存放有效期1年)
        userVistInsId: "Other", //用户该次访问应用实例(存在sessionStore中，有效期为浏览器窗口有效期)
        userId: "Other", //用户账号--用户登陆门户账号，如果没有会随机生成
        appkey: "Other", //应用编号
        schoolId: "Other", //学校编号
        homePage: true, //是否为访问某应用的首页
        pageNumId: 0, //访问某应用某页面的编号，应用页面访问顺序
        curPageUrl: "Other", //当前页面url
        refPageUrl: "Other", //上一页面url
        startTime: 0, //此次访问页面开始时间
        userName: "Other", //用户名称
        siteType:"Other"
    };
    //原来门户点击应用传的数据:appInsId、schoolID、appKey、appReqTime、appResTime、appEndTime、userID、userIP、osVersion、browserName、screenResolution、deviceID
    var CommonUtil = {
        logError: function (e) {
            if (window.console) {
                console.log(e.message);
            }
        },
        isEmpty: function (o) {
            return ((null == o) || (undefined == o) || ("" == o) || (o.length < 1));
        },
        getUserIdByUrl: function (url, key) {
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                var strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    var arr = strs[i].split("=");
                    if (arr[0] == key) {
                        var app = strs[i].substring((key + "=").length);
                        return app;
                    }
                }
                return "";
            }
            return "";
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
                var userActionData = "ampAppDataAaA" + JSON.stringify(userActionDataJson);
	        var protocol = window.location.protocol;
		//console.log(userActionData);
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
                var siteTypeVal="Other";
                if (siteType) {
                    siteTypeVal = siteType;
                }
                AmpUtils.dataAnalysis("访问应用", ({
                    "appId": appId,
                    "appName": appName,
                    "appKey": appkey,
                    "siteType":siteTypeVal
                }));
            } catch (e) {
                CommonUtil.logError(e);
            }
        },
        createRandomNum: function () {
            try {
                var len = 20;
                var rdmstring = "";
                for (; rdmstring.length < len; rdmstring += Math.random()
                    .toString(36).substr(2));
                return rdmstring.substr(0, len);
            } catch (e) {
                this.logError(e);
            }
        },
        setCookie: function (key, v) {
            try {
                var d = new Date();
                d.setTime(d.getTime() + 1000 * 60 * 60 * 24 * 365 * 2);
                var expires = "expires=" + d.toGMTString();
                document.cookie = key + "=" + v + "; " + expires + "; path=/";
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
                    if (arr[0] == key) {
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

                //				var agent = window.navigator.userAgent.toLowerCase();
                //				var s;
                //				if (/msie ([\d.]+)/.test(agent)) {
                //					s = agent.match(/msie ([\d.]+)/);
                //					userActionDataJson.browser = 'IE ' + s[1];
                //				} else if (/firefox\/([\d.]+)/.test(agent)) {
                //					//s = agent.match(/firefox\/([\d.]+)/);
                //					userActionDataJson.browser = 'Firefox';
                //				} else if (/chrome\/([\d.]+)/.test(agent)) {
                //					//s = agent.match(/chrome\/([\d.]+)/);
                //					if (/qqbrowser\/([\d.]+)/.test(agent)) {
                //						userActionDataJson.browser = 'QQ浏览器';
                //					} else if (/maxthon\/([\d.]+)/.test(agent)) {
                //						userActionDataJson.browser = '遨游浏览器';
                //					} else if (/metasr ([\d.]+)/.test(agent)) {
                //						userActionDataJson.browser = '搜狗浏览器';
                //					} else if (/lbbrowser/.test(agent)) {
                //						userActionDataJson.browser = '猎豹浏览器';
                //					} else {
                //						userActionDataJson.browser = 'Chrome';
                //					}
                //				} else if (/opera.([\d.]+)/.test(agent)) {
                //					//s = agent.match(/opera.([\d.]+)/);
                //					userActionDataJson.browser = 'Opera';
                //				} else if (/version\/([\d.]+).*safari/.test(agent)) {
                //					//s = agent.match(/version\/([\d.]+).*safari/);
                //					userActionDataJson.browser = 'Safari';
                //				} else if (Object.hasOwnProperty.call(window, "ActiveXObject")
                //						&& !window.ActiveXObject) {
                //					userActionDataJson.browser = 'IE 11';
                //				}

                //				var plateform = window.navigator.platform.toLowerCase();
                //				if (/win/.test(plateform)) {
                //					if (agent.indexOf("windows nt 5.0") > -1) {
                //						userActionDataJson.os = "Win 2000";
                //					} else if (agent.indexOf("windows nt 5.1") > -1) {
                //						userActionDataJson.os = "Win XP";
                //					} else if (agent.indexOf("windows nt 5.2") > -1) {
                //						userActionDataJson.os = "Win 2003";
                //					} else if (agent.indexOf("windows nt 6.0") > -1) {
                //						userActionDataJson.os = "Windows Vista";
                //					} else if (agent.indexOf("windows nt 6.1") > -1
                //							|| agent.indexOf("Windows 7") > -1) {
                //						userActionDataJson.os = "Win 7";
                //					} else if (agent.indexOf("windows 8") > -1) {
                //						userActionDataJson.os = "Win 8";
                //					} else if (agent.indexOf("windows 10") > -1) {
                //						userActionDataJson.os = "Win 10";
                //					}
                //				} else if (/mac/.test(plateform)) {
                //					userActionDataJson.os = "Mac Os";
                //				}
                //				var bIsIpad = agent.match(/ipad/i) == "ipad";
                //				var bIsIphoneOs = agent.match(/iphone os/i) == "iphone os";
                //				var bIsMidp = agent.match(/midp/i) == "midp";
                //				var bIsUc7 = agent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
                //				var bIsUc = agent.match(/ucweb/i) == "ucweb";
                //				var bIsAndroid = agent.match(/android/i) == "android";
                //				var bIsCE = agent.match(/windows ce/i) == "windows ce";
                //				var bIsWM = agent.match(/windows mobile/i) == "windows mobile";
                //				if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc
                //						|| bIsAndroid || bIsCE || bIsWM) {
                //					userActionDataJson.device = "Phone";
                //				} else {
                //					userActionDataJson.device = "PC";
                //				}
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
        setUserName: function () {
            try {
                var userName = document.getElementById("analysisUserName").value;
                userActionDataJson.userName = userName;
            } catch (e) {
                userActionDataJson.userName = "T3RoZXI=";
                CommonUtil.logError(e);
            }
        },
        init: function () {
            try {
                var userVistInsId = new Date().getTime() + "" + CommonUtil.createRandomNum();
                userActionDataJson.userVistInsId = userVistInsId;
                userActionDataJson.appkey = appkey;
                userActionDataJson.schoolId = schoolId;
                var startTime = new Date().getTime();
                userActionDataJson.startTime = startTime;
                this.setClientAttrInfo();
                this.setUserClientId();
                userActionDataJson.userId = userID;
                userActionDataJson.pageNumId = 1;
                userActionDataJson.curPageUrl = appurl;
                this.setUserName();
            } catch (e) {
                CommonUtil.logError(e);
            }
        }
    };
    InitData.init();
    CommonUtil.sendData();
    CommonUtil.sendDataByNewAnalysis(); //glhan发送到新的统计分析
};