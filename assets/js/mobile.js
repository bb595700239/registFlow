/**  
* js时间对象的格式化; 
* eg:format="yyyy-MM-dd hh:mm:ss";   
*/  
Date.prototype.format = function (format) {  
    var o = {  
        "M+": this.getMonth() + 1,  //month   
        "d+": this.getDate(),     //day   
        "h+": this.getHours(),    //hour   
        "m+": this.getMinutes(),  //minute   
        "s+": this.getSeconds(), //second   
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter   
        "S": this.getMilliseconds() //millisecond   
    }  
    var week=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];  
    if (/(y+)/.test(format)) {  
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));  
    }  
    if (/(w+)/.test(format)){  
        format = format.replace(RegExp.$1, week[this.getDay()]);  
    }  
    for (var k in o) {  
        if (new RegExp("(" + k + ")").test(format)) {  
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));  
        }  
    }  
    return format;  
}  
   
/** 
*js中更改日期  
* y年， m月， d日， h小时， n分钟，s秒  
*/  
Date.prototype.add = function (part, value) {  
    value *= 1;  
    if (isNaN(value)) {  
        value = 0;  
    }  
    switch (part) {  
        case "y":  
            this.setFullYear(this.getFullYear() + value);  
            break;  
        case "m":  
            this.setMonth(this.getMonth() + value);  
            break;  
        case "d":  
            this.setDate(this.getDate() + value);  
            break;  
        case "h":  
            this.setHours(this.getHours() + value);  
            break;  
        case "n":  
            this.setMinutes(this.getMinutes() + value);  
            break;  
        case "s":  
            this.setSeconds(this.getSeconds() + value);  
            break;  
        default:  
   
    }
    return this
}

//alert(new Date().add("m", -1).format('yyyy-MM-dd hh:mm:ss')); //时间格式化使用方法 
$(function(){
    $('.top-bar').on({click:function(){
        rule.checkstate();//检查所有状态
        if(rule.allright){
            setStorage()
            if($(this).data('end')!=1){
                window.location.href=$('.g-form').data('gotourl');
                return
            }
            rule.getStatesFn()

            return
        }
    }},'.right'); 

})
$(function(){
    var page=$('.g-form').attr('id');
    if(localStorage[page]){
        localStorage[page].split('&').forEach(function(param){
            param = param.split('=');
            var name = param[0],
                val = param[1];

            $('*[name=' + name + ']').val(val);
        })
    }

})



function setStorage(){
    var form=$('.g-form');
    localStorage[form.attr('id')]=form.serialize()
}

function back(){
    history.go(-1)
}
;(function($){
        $.getQueryString=function(name){
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
            var r = window.location.search.substr(1).match(reg); 
            if (r != null) return decodeURI(r[2]); return null; 
        },
        $.enterSend=function(arg){
            arg.main.keyup(function(e) {//回车搜索
                var keycode = (e.keyCode ? e.keyCode : e.which);
                if (keycode == '13') {
                    arg.action()
                }
            }); 
        }

})(Zepto);

var  rule={
    getStatesFn:function(){
        var form=$('.g-form');
        var defaults = {
                dialogmes: null,
                gotourl: '#'
            };
        var options=$.extend(defaults, {
            dialogmes:form.data('dialogmes'),
            gotourl:$.getQueryString('fromurl') || form.data('gotourl')
        })
        function getformdata(){
            var data=''
            for(var i=0;i<localStorage.length;i++){
                data+=localStorage[localStorage.key(i)]+'&'
            }
            data=data.substring(0,data.length-1)
            return data
        }
        $.ajax({
            type: "POST",
            url:form.data('posturl'),
            data:getformdata(),
            success: function(data) {
                location.href=options.gotourl;

                data.message = data.data || data.message;
                if(data.message=="success"){
                    if(options.dialogmes){
                        $.alert(options.dialogmes,true,function(){
                            location.href=options.gotourl;
                        },5000); 
                        return;
                    }
                }else{
                    $.alert(mess);
                }
            },
            error:function(){
                $.alert("系统繁忙，请稍后再试");
            }
        });
    },
    allright:true,
    erroralert:function(obj,text) {
        obj.data('group-state',false);

        $.alert(text);
    },
    success:function(obj) {
        obj.data('group-state',true);
    },
    checkstate:function() {//检查所有状态
        rule.allright=true; 
        $.each($('*[data-group-state]'),function (item) {
        	if($(this).attr('onblur')){
                eval($(this).attr('onblur'));
        	}else{
        		eval($(this).data('isblur'));
        	}
            if(!$(this).data('group-state')){
                rule.allright=false; 
                return false;
            }

        })
        return rule.allright;
    },
    empty:function(obj,mess){//不能为空
        var str=obj.val().replace(/(^\s+)|(\s+$)/g,"");
        if(str==''){
            this.erroralert(obj,mess)
        }else{
            this.success(obj);
        }   
    },
    phone:function(obj,callback) {//手机号校验
        var myReg = /^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
        if (!myReg.test(obj.val())) {
            this.erroralert(obj,'手机号格式不正确')
        }else{
            if(callback){
                callback(obj)
            }else{
                this.success(obj);
            };
        }
    },
    password:function(obj,obj2) {//密码校验
        var myReg = /^[0-9a-zA-Z]{8,20}$/;
        if (!myReg.test(obj.val())) {
            this.erroralert(obj,'密码格式不正确')
        }else{
            this.success(obj);
        }
        if(obj2&&obj2.val()!=''){
            eval(obj2.attr('onblur'));
        }
    },
    tradingPassword:function(obj,obj2,callback) {//交易密码校验
        var myReg = /^[0-9]{6}$/;
        if (!myReg.test(obj.val())) {
            this.erroralert(obj,'交易密码格式不正确')
        }else{
            if(callback){
                callback(obj)
            }else{
                this.success(obj);
            };
        }
        if(obj2&&obj2.val()!=''){
            eval(obj2.attr('onblur'));
        }
    },
    repassword:function(obj,obj2) {//重复密码检验
        if (obj.val()!=obj2.val()) {
            this.erroralert(obj,'两次密码不一致')
        }else{
            this.success(obj);
        }
    },
    bankcard:function(obj){//银行卡校验
        var myReg= /^(\d{16}|\d{19}|\d{18})$/;
        if(!myReg.test( obj.val().replace(/\s+/g,"") )){
            this.erroralert(obj,'银行卡格式不正确')
        }else{
            this.success(obj);
        }
    },
    idcard:function(obj) {//身份证号校验
        var myReg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
        if (!myReg.test(obj.val())) {
            this.erroralert(obj,'身份证格式不正确')
        }else{
            this.success(obj);
        }
    },
    custom:function(obj,reg,mess,callback){
        var myReg=eval(reg);
        if (!myReg.test(obj.val())) {
            this.erroralert(obj,mess)
        }else{
            if(callback){
                callback(obj)
            }else{
                this.success(obj);
            };
        }
    }
    
}


