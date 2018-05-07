var Wisedu = window.Wisedu || {};
Wisedu.ampAppDataSendNew = function(schoolId, userID, ip, appKey, userType, appName, appurl) {
    var userActionDataJson = {
        // is4Java: false, //是否支持java
        // is4Cookie: false, //是否支持cookie
        // language: "Other", //浏览器使用语言
        // flash: "Other", //flash支持的版本
        // screenCD: "Other", //浏览器调色板的比特深度
        // userClientId: "Other", //浏览器客户端唯一标志(cookie存放有效期1年)
        // userVistInsId: "Other", //用户该次访问应用实例(存在sessionStore中，有效期为浏览器窗口有效期)
        // homePage: true, //是否为访问某应用的首页
        // pageNumId: 0, //访问某应用某页面的编号，应用页面访问顺序
        // // curPageUrl: "Other", //当前页面url
        // refPageUrl: "Other", //上一页面url

        appKey: "Other", //应用编号
        appId: "Other", //应用编号
        appName: "Other", //应用名称
        userId: "Other", //用户账号--用户登陆门户账号，如果没有会随机生成
        userName: "Other", //用户名称
        userType: "Other", //用户类型
        schoolId: "Other", //学校编号
        browser: "Other", //浏览器名称
        screenWH: "Other", //屏幕分辨率
        deviceType: "Other", //使用设备类型(区分为移动端或电脑端)
        deviceModels: "Other", //设备机型
        os: "Other", //操作系统
        startTime: 0, //此次访问页面开始时间
        city: "Other", //获取用户当前地理位置-所在城市
        province: "Other", //获取用户当前地理位置-所在省份
        ip: "Other", //用户客户端IP地址
        message: ""
    };
    //原来门户点击应用传的数据:appInsId、schoolID、appKey、appReqTime、appResTime、appEndTime、userID、userIP、osVersion、browserName、screenResolution、deviceID
    var CommonUtil = {
        logError: function(e) {
            if (window.console) {
                console.log(e.message);
            }
        },
        isEmpty: function(o) {
            return ((null == o) || (undefined == o) || ("" == o) || (o.length < 1));
        },
        getUserIdByUrl: function(url, key) {
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
        getUrlNotParams: function(url) {
            if (url.indexOf("?") != -1) {
                var str = url.split("?");
                return str[0];
            }
            return url;
        },
        appDataSendStatus: window.appDataSendStatus = function(status) {

        },
        sendData: function() {

            var deferred = $.Deferred();
            var url = parent.window.AMPConstant.operationAnalysisRequestPath + "addUserActionData";
            $.ajax({
                type: 'get',
                // url: 'http://172.16.7.21:8086/httpbridge/UserActionDataController/addUserActionData',
                url: url,
                data: userActionDataJson,
                contentType: 'application/json;charset=utf-8',
                dataType: "jsonp",
                jsonp: "callback", //服务端用于接收callback调用的function名的参数   
                jsonpCallback: "appDataSendStatus", //callback的function名称,服务端会把名称和data一起传递回来   
                success: function(resp) {
                    deferred.resolve(resp);
                },
                error: function(resp) {
                    deferred.reject(resp);
                }
            });
        },
        createRandomNum: function() {
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
        setCookie: function(key, v) {
            try {
                var d = new Date();
                d.setTime(d.getTime() + 1000 * 60 * 60 * 24 * 365 * 2);
                var expires = "expires=" + d.toGMTString();
                document.cookie = key + "=" + v + "; " + expires + "; path=/";
            } catch (e) {
                this.logError(e);
            }
        },
        getCookie: function(key) {
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
        setClientAttrInfo: function() {
            try {
                userActionDataJson.screenWH = (window.screen.width || 0) + "x" + (window.screen.height || 0);
                userActionDataJson.is4Java = window.navigator.javaEnabled();
                userActionDataJson.is4Cookie = window.navigator.cookieEnabled;
                userActionDataJson.language = navigator.language || navigator.systemLanguage || navigator.userLanguage || "Other";
                userActionDataJson.screenCD = (window.screen.colorDepth + "-bit") || (0 + "-bit");

                var parser = new UAParser();
                // var browserInfo = parser.getBrowser();
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
                        userActionDataJson.deviceModels = "Other";
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
        setUserClientId: function() {
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
        setUserName: function() {
            try {
                //var userName = document.getElementById("analysisUserName").value;
                var userName = sessionStorage['ampUserName'];
                userActionDataJson.userName = userName;
            } catch (e) {
                userActionDataJson.userName = "T3RoZXI=";
                CommonUtil.logError(e);
            }
        },
        setGeolocation: function() {
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
        init: function() {
            try {
                // var userVistInsId = new Date().getTime() + "" + CommonUtil.createRandomNum();
                // userActionDataJson.userVistInsId = userVistInsId;
                userActionDataJson.appId = userActionDataJson.appKey = appKey.split("-")[0];
                userActionDataJson.appName = appName;
                userActionDataJson.schoolId = schoolId;
                userActionDataJson.userId = userID;
                userActionDataJson.userType = userType;
                userActionDataJson.ip = ip;
                var startTime = new Date().getTime();
                userActionDataJson.startTime = startTime;
                this.setClientAttrInfo();
                this.setUserName();
                this.setGeolocation();
                // this.setUserClientId();
                // userActionDataJson.pageNumId = 1;
                // userActionDataJson.curPageUrl = appurl;
            } catch (e) {
                CommonUtil.logError(e);
            }
        }
    };
    InitData.init();
    CommonUtil.sendData();
};