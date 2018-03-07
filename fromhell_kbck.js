define(function(require) {

  var utils = require('utils');
  var zttk = require('../zttk/zttk');
  var pub_param={};
  var nqxnxq="";
  var dqxq="";//当前星期几
  var tkType = '0';
  var viewConfig = {
    initialize: function(param,xnxq) {
      var self = this;
      nqxnxq=param.xnxqdm;
      var week=this.initZc();
      if(week!=null && week<22){
    	  param.zc=week;
      } 
      pub_param=param;
      var indexView = utils.loadCompiledPage('kbckIndexPage', require);
      var list=this.initTkWpk();
	  this.$rootElement.html(indexView.render({data:list}), true);
	  $("#zkbzc").text(param.zc);
	  
	  $('#zttk_zc').on('click', function(e){
		self.initZttk(tkType);
	  });
      /*if(param.flag){
    	  var list=this.initTkWpk();
    	  _this.$rootElement.html(indexView.render(list), true);
      }else{
    	  _this.$rootElement.html(indexView.render(), true);
      }*/
      this.initXnxq(param);
      this.inintWeekTable(xnxq);
      this.initClick();
      this.eventMap = {
          '[data-action="周课表学年学期"]': this.actionCheckZKb,
	      '[data-action="周课表左移"]': this.actionLeft,
	      '[data-action="周课表右移"]': this.actionRight
      };
    },
    
    initZc:function(){
    	var week=1;
    	var xnxqArr = nqxnxq.split("-");
		var xn = xnxqArr[0] + "-" + xnxqArr[1];
		var xq = xnxqArr[2];
		var myDate = new Date();
		var year = myDate.getFullYear();
		var month = myDate.getMonth() + 1;
		var day = myDate.getDate();
		var rq = year + '-' + month + '-' + day;// 拼写出的日期2015-3-27
		var dqrqParams ={XN: xn,XQ: xq,RQ: rq};
    	var data=BH_UTILS.doSyncAjax(WIS_EMAP_SERV.getAbsPath("/modules/jshkcb/dqzc.do"), dqrqParams);
    	if(data.datas.dqzc.extParams.code==1 && data.datas.dqzc.rows.length == 1){
    		week=data.datas.dqzc.rows[0].ZC;
    		if(week == 0){
    			week = 1;
    		}
    		dqxq=data.datas.dqzc.rows[0].XQJ;
    	}
    	return week;
    },
    
    actionCheckXnxqKb:function(){
    	$("div[data-action='周课表学年学期']").hide();
    	$("div[data-action='周课表周课表']").show();
    	$("div[data-action='周课表切换']").hide();
    	var _this=this;
    	
    	pub_param.zc="";
    	pub_param.xnxqdm = $("#dqxnxq2").attr("value");
    	this.inintWeekTable("xnxq");
		var wptk = utils.loadCompiledPage('wptk', require);
		var dataList = _this.initTkWpk();
		$("#wptk_contaner").html(wptk.render({data:dataList}), true);
		
		tkType = '1';
		$('#zttk_zc').on('click', function(e){
			_this.initZttk(tkType);
		});
    },
    
    actionCheckZKb:function(){
    	$("div[data-action='周课表切换']").show();
    	$("div[data-action='周课表学年学期']").show();
    	$("div[data-action='周课表周课表']").hide();
    	var _this=this;
    	
    	pub_param.zc=$("#zkbzc").text();
    	pub_param.xnxqdm = $("#dqxnxq2").attr("value");
    	this.inintWeekTable();
		var wptk = utils.loadCompiledPage('wptk', require);
		$("#wptk_contaner").html(wptk.render({data:_this.initTkWpk()}), true);
		
		tkType = '0';
		$('#zttk_zc').on('click', function(e){
			_this.initZttk(tkType);
		});
    },
    
    actionLeft:function(){
    	$("div[data-action='周课表学年学期']").show();
    	$("div[data-action='周课表周课表']").hide();
    	var _this=this;
    	var zc=$("#zkbzc").text();
    	if(zc>1){
    		$("#zkbzc").text(parseInt(zc)-1);
    	}
    	if(zc==1){
    		$("#zkbzc").text(22);
    	}
		pub_param.zc=$("#zkbzc").text();
		pub_param.xnxqdm = $("#dqxnxq2").attr("value");
		this.inintWeekTable();
		var wptk = utils.loadCompiledPage('wptk', require);
		$("#wptk_contaner").html(wptk.render({data:_this.initTkWpk()}), true);
		$('#zttk_zc').on('click', function(e){
			_this.initZttk(tkType);
		});
    },
    
    actionRight:function(){
    	$("div[data-action='周课表学年学期']").show();
    	$("div[data-action='周课表周课表']").hide();
    	var _this=this;
    	var zc=$("#zkbzc").text();
    	if(zc<22){
    		if((parseInt(zc) + 1) == 0){
    			$("#zkbzc").text(parseInt(zc)+2);
    		}else{
    			$("#zkbzc").text(parseInt(zc)+1);
    		}
    	}
    	if(zc>=22){
    		$("#zkbzc").text(1);
    	}
    	pub_param.zc=$("#zkbzc").text();
		pub_param.xnxqdm = $("#dqxnxq2").attr("value");
		this.inintWeekTable();
		var wptk = utils.loadCompiledPage('wptk', require);
		$("#wptk_contaner").html(wptk.render({data:_this.initTkWpk()}), true);
		$('#zttk_zc').on('click', function(e){
			_this.initZttk(tkType);
		});
    },
    
    initClick:function(){
    	var _this=this;
    	$('a[data-action="更改2"]').off('click').on('click', function() {
    		_this.actionChange();
    	});
    	$('a[id="print_button"]').off('click').on('click', function() {
    		_this.print();
    	});
    	$('i[data-action="周课表左移"]').off('click').on('click', function() {
    		_this.actionLeft();
    	});
    	$('i[data-action="周课表右移"]').off('click').on('click', function() {
    		_this.actionRight();
    	});
    	$('div[data-action="周课表学年学期"]').off('click').on('click', function() {
    		_this.actionCheckXnxqKb();
    	});
    	$('[data-action="周课表周课表"]').off('click').on('click', function() {
    		_this.actionCheckZKb();
    	});
    	$('a[id="down_button"]').off('click').on('click', function() {
    		_this.down_picture();
    	});
    },
    
    isIE:function() { //ie?  
	    if (!!window.ActiveXObject || "ActiveXObject" in window)  
	        return true;  
	    else  
	        return false;  
	},
    
    down_picture:function(){
    	var _this=this;
    	html2canvas($('#kcb_container').find('table'), {
            onrendered: function(canvas) {
            	//var isIe = /msie/.test(navigator.userAgent.toLowerCase());
                if (_this.isIE() || (navigator && navigator.userAgent.indexOf("Edge") !== -1)) {
                    var blob = canvas.msToBlob();
                    navigator.msSaveBlob(blob, 'my_schedule.png');
                } else {
                	var url = canvas.toDataURL();
                    //以下代码为下载此图片功能
                    var triggerDownload = $("<a>").attr("href", url).attr("download", "my_schedule.png").appendTo("body");
                    triggerDownload[0].click();
                    triggerDownload.remove();
                }
            }
        });
    },
    
    print:function(){
    	$("div[id='kcb_container']").printArea();
    },
    
    initTkWpk:function(){
    	if(!pub_param.flag){
    		return;
    	}
    	var params=this.getParam();
    	var data1=BH_UTILS.doSyncAjax(WIS_EMAP_SERV.getAbsPath(pub_param.tkurl), params);
    	var data2=BH_UTILS.doSyncAjax(WIS_EMAP_SERV.getAbsPath(pub_param.wpkurl), params);
    	var tkurl_data=data1.datas[pub_param.tk_ation].rows;
    	var wpkurl_data=data2.datas[pub_param.wpk_action].rows;
    	var kcList={};
    	//kcList.tk_data=tkurl_data;
    	//kcList.wpk_data=wpkurl_data;
    	if(tkurl_data.length == 0 || data1.datas[pub_param.tk_ation].extParams.code!=1){
    		kcList.tk_empty=[{}];
    	}else{
    		for(var i=0;i<tkurl_data.length;i++){
    			var tk=tkurl_data[i];
    			if('01'==tk.TKLXDM){//调课
    				tkurl_data[i].TK=1;
    			}else if('02'==tk.TKLXDM){//听课
    				tkurl_data[i].DK=1;
    			}else{//补课
    				tkurl_data[i].BK=1;
    			}
    		}
    		kcList.tk_data=tkurl_data;
    	}
    	if(wpkurl_data.length == 0 || data2.datas[pub_param.wpk_action].extParams.code!=1){
    		kcList.wpk_empty=[{}];
    	}else{
    		kcList.wpk_data=wpkurl_data;
    	}
    	return kcList;
    },
    
    getParam:function(){
    	var params={};
    	params.XNXQDM=pub_param.xnxqdm;
    	if(pub_param.zc!=""){
    		params.SKZC=pub_param.zc;
    	}
    	return params;
    },
    
    inintWeekTable:function(value){
    	var params=this.getParam();
    	var data=BH_UTILS.doSyncAjax(WIS_EMAP_SERV.getAbsPath(pub_param.url), params);
    	var kb_data=data.datas[pub_param.action].rows;
        var results=[];
        if(kb_data.length>0){
        	for(var i=0;i<kb_data.length;i++){
        		var kb={};
        		kb.kcdm=kb_data[i].KCH;
        		kb.kxh = kb_data[i].KXH;
        		kb.kcmc=kb_data[i].KCM;
        		kb.beginUnit=kb_data[i].KSJC;
        		kb.endUnit= kb_data[i].JSJC;
        		kb.week=kb_data[i].SKXQ+"";
        		//kb.weekNum= kb_data[i].SKXQ;
                //weekName: kb_data.ZCMC;
        		kb.teacherName= kb_data[i].SKJS;
        		if(pub_param.action != "jaskcb"){
        			if(value == "xnxq"){
            			kb.classroomName = kb_data[i].ZCMC+",星期"+kb_data[i].SKXQ+","+kb_data[i].KSJC+"-"+kb_data[i].JSJC+"节,"+(kb_data[i].JASMC == null ? "无" : kb_data[i].JASMC);
            		}else{
            			kb.classroomName = (kb_data[i].JASMC == null ? "无" : kb_data[i].JASMC);
            		}
        		}
        		kb.tzkc=(kb_data[i].ISTK==0 ? false:true);
        		results.push(kb);
        	}
        }
        var strs = pub_param.xnxqdm.split("-");
        var data = BH_UTILS.doSyncAjax(WIS_EMAP_SERV.getAbsPath("/modules/jshkcb/cxjcs.do"), {"XN":strs[0]+"-"+strs[1],"XQ":strs[2]});
        var rows = data.datas.cxjcs.rows;
        var total = 12;
        var swjc = 4;
        var xwjc = 4;
        var wsjc = 4;
        if(rows.length>0){
        	total = parseInt(rows[0].SFJJ == null ? 4 : rows[0].SFJJ) + parseInt(rows[0].XFJJ == null ? 4 : rows[0].XFJJ) + parseInt(rows[0].WSJJ == null ? 4 : rows[0].WSJJ);
        	swjc = rows[0].SFJJ == null ? 4 : rows[0].SFJJ;
        	xwjc = rows[0].XFJJ == null ? 4 : rows[0].XFJJ;
        	wsjc = rows[0].WSJJ == null ? 4 : rows[0].WSJJ;
        }
        var weeks = [{
            code: "1",
            name: "星期一"
        }, {
            code: "2",
            name: "星期二"
        }, {
            code: "3",
            name: "星期三"
        }, {
            code: "4",
            name: "星期四"
        }, {
            code: "5",
            name: "星期五"
        }, {
            code: "6",
            name: "星期六"
        }, {
            code: "7",
            name: "星期日"
        }];
        var units = [];
        for(var i=0;i<total;i++){
        	units.push({code: (i+1),name: (i+1)});
        }
        var unitsSpread = [{
            code: "1",
            name: "上午",
            spread: swjc
        }, {
            code: "2",
            name: "下午",
            spread: xwjc
        }, {
            code: "3",
            name: "晚上",
            spread: wsjc
        }];
        var weekUnitTableInfo;
        if(dqxq==""){
        	weekUnitTableInfo = new WeekUnitTableInfo({
                container: '.d',//必填
                weeks: weeks,
                units: units,
                unitsSpread:unitsSpread,
                unitMode: 2 
            });
        }else{
        	weekUnitTableInfo = new WeekUnitTableInfo({
                container: '.d',//必填
                weeks: weeks,
                units: units,
                unitsSpread:unitsSpread,
                unitMode: 2,
                highLightWeeks:dqxq
            });
        }
        weekUnitTableInfo.render();
        weekUnitTableInfo.setResults(results, function() {
            
        });
    },
    
    initXnxq: function(param){
    	$("#dqxnxq2").html(param.xnxqmc);
	    $("#dqxnxq2").attr("value",param.xnxqdm);
	},
	
    actionChange: function() {
    	var _this=this;
    	var indexView = utils.loadCompiledPage('./ggxnxq', require);
    	utils.window({
    		title: '更改学年学期',
    		content: indexView.render(),
    		height: 'auto',
    		width: '465px',
    		buttons: [{ //选填
    			text: '确定',
    			className: 'bh-btn-primary',
    			callback: function() {
    				var selectedItem = $('.dropdowm-xnxqList2').jqxDropDownList("getSelectedItem");
    				$("#dqxnxq2").html(selectedItem.label);
    			    $("#dqxnxq2").attr("value",selectedItem.value);
    				//pkglUtil.Dom.setXnxqText({MC: selectedItem.label, DM: selectedItem.value});
    			    $("div[data-action='周课表切换']").show();
    			    $("div[data-action='周课表学年学期']").show();
    		    	$("div[data-action='周课表周课表']").hide();
    				pub_param.zc=$("#zkbzc").text();
    				pub_param.xnxqdm = selectedItem.value;
    				_this.inintWeekTable();
    				var wptk = utils.loadCompiledPage('wptk', require);
    				$("#wptk_contaner").html(wptk.render({data:_this.initTkWpk()}), true);
    				$('#zttk_zc').on('click', function(e){
    					_this.initZttk(tkType);
    				});
    				return true;
    			}
    		}, {
    			text: '取消',
    			className: 'bh-btn-default',
    			callback: function() {}
    		}]
    	});
    	$('.dropdowm-xnxqList2').jqxDropDownList({
            source: _this.getXNXQSource(),
            selectedIndex: 0,
            width: '100%',
            height: '25px'
          });
        $('.dropdowm-xnxqList2').jqxDropDownList('selectItem',$("#dqxnxq2").attr("value"));
    },
    
    getXNXQSource:function(){
    	var data=BH_UTILS.doSyncAjax(WIS_EMAP_SERV.getAbsPath("/modules/jshkcb/xnxqcx.do"), {"*order":"+DM"});
    	var xnxqList = [{value:"",label:"请选择"}];
		for (var i = 0; i < data.datas.xnxqcx.rows.length; i ++) {
			var r = data.datas.xnxqcx.rows[i];
			xnxqList.push({ value: r.DM, label: r.MC });
		}
		return xnxqList;
    },
    initZttk:function(type) {
    	var xnxqdm = $("#dqxnxq2").attr("value");
    	var zc = $("#zkbzc").text();
    	var param = new Object();
    	param.xnxqdm = xnxqdm;
    	if (type != null && type == '0') {
    		param.zc = zc;
    	}    	
    	zttk.initialize(param);
    }
  };

  return viewConfig;
});