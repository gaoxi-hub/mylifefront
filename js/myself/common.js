var captcha=0;
/*打开注册弹框并，关闭登录框*/
function goRegister() {
    //表单重置
    $("#regform")[0].reset();
    $("#regshow").css("display","none");
    $('#myTab li:eq(1) a').tab('show');
    //拼图拖动验证
    console.log(captcha);
    captcha=0;

}
/*跳转到登录页面*/
function goLogin() {
    $("#loginform")[0].reset();
    $('#myTab li:eq(0) a').tab('show');
}

//验证码
$('#mpanel4').slideVerify({
    type: 2,		//类型
    vOffset: 5,	//误差量，根据需求自行调整
    vSpace: 5,	//间隔
    imgName: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg'],
    imgSize: {
        width: '262px',
        height: '150px',
    },
    blockSize: {
        width: '40px',
        height: '40px',
    },
    barSize: {
        width: '262px',
        height: '30px',
    },
    ready: function () {
        console.log('图片验证码生成完成')
    },
    success: function () {
        console.log('验证成功，添加你自己的代码！');
        //......后续操作
          captcha=1;
    },
    error: function () {
          captcha=0;
//		        	alert('验证失败！');
    }
});


var regTip=$("#regtip");
var regShow=$("#regshow");


//检验手机格式
function checkPhone(){
    var regphone=$("#regname").val();
    console.log(regphone);
    var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(regphone)) {
        regShow.css("display","block");
        regTip.text("手机号格式不正确");
        $("#regname").parent().removeClass("has-success");
        $("#regname").parent().addClass("has-error");
        return false;
    } else {
        console.log("格式正确");
        //验证手机号是否存在
        $.ajax({
            url : "http://www.gaoxi.com/auths/reg/checkPhone",
            type : "GET",
            data: {"phoneNum":regphone},
            success : function(res){
                if(res.retcode =='000000'){
                    regShow.css("display","none");
                    $("#regname").parent().removeClass("has-error");
                    $("#regname").parent().addClass("has-success");

                }else{
                    regShow.css("display","block");
                    regTip.text(res.retinfo);
                    $("#regname").parent().removeClass("has-success");
                    $("#regname").parent().addClass("has-error");

                }
            },
            error : function(){
                alert('手机号检验失败');
            }
        });

        if($("#regname").parent().hasClass("has-success")){
            return true;
        }else {
            return false;
        }

    }
}
//注册栏监听
$("#regname").change(checkPhone);


$("#regpwd").change(checkPwd);

//检验密码长度
function checkPwd(){
    console.log("密码验证")
    var regpwd=$("#regpwd").val();
    if (regpwd.length>=6&&regpwd.length<10) {
        console.log("正确");
        $("#regpwd").parent().removeClass("has-error");
        $("#regpwd").parent().addClass("has-success");
        regShow.css("display","none");
        return true;
    } else {
        $("#regpwd").parent().removeClass("has-success");
        $("#regpwd").parent().addClass("has-error");
        regShow.css("display","block");
        regTip.text("密码长度不合法");
        return false;
    }
}

function checkPhoneCode(){
    var phonecode=$("#phonecode").val();
    if(phonecode.length!=6){
        regShow.css("display","block");
        regTip.text("验证码长度不正确");
        $("#phonecode").parent().removeClass("has-success");
        $("#phonecode").parent().addClass("has-error");
        return false;
    }else {
        console.log("正确")
        $("#phonecode").parent().removeClass("has-error");
        $("#phonecode").parent().addClass("has-success");
        regShow.css("display","none");
        return true;
    }
}

function checkImgCap(){
    if(captcha!=1){
        regShow.css("display","block");
        regTip.text("请完成图片验证");
        return false;
    }else {
        console.log("正确")
        regShow.css("display","none");
        return true;
    }
}



//注销登录
function logout(){
    console.log("注销登录");
    $.ajax({
        url : "http://www.gaoxi.com/auths/login/logout",
        type : "GET",
        data: {"userToken":$.cookie("user_token")},
        success : function(res){
            $("#nologin").css("display","block");
            $("#islogin").css("display",'none');
            $.removeCookie("user_token");
        },
        error : function(){
            alert('退出登录请求失败');
        }
    });
}

var timec;
var totalSec=60;
//短信验证码定时器
function downSec(){
    if(totalSec!=0){
        $("#captchabtn").text("已发送("+(totalSec--)+")");
    }else{
        $("#captchabtn").text("发送手机验证码");
        $("#captchabtn").removeClass("disabled");
        totalSec=60
    }
}

$("#captchabtn").click(sendMessage);
//发送验证验证码
function sendMessage() {
    console.log('hello')
    if(checkPhone()){
        var regphone=$("#regname").val();
        //请求发送信息
        $.ajax({
            url : "http://www.gaoxi.com/auths/reg/sendVerificationCode",
            type : "GET",
            data: {"phoneNum":regphone},
            success : function(res){
                if(res.retcode =='000000')
                {
                    $("#captchabtn").addClass("disabled")
                    $('body').everyTime('1s','A',downSec,61);

                }else{
                    swal("验证码提示", res.retinfo, "error");
                }
            },
            error : function(){
                console.log('请求失败');
            }
        });
    }else{

    }

}


//进行注册
$("#doregNow").click(function () {
    if($("#regname").hasClass("has-success")&&checkPwd()&&checkPhoneCode()&&checkImgCap()){
        console.log("进行注册");
        //提交
        $.ajax({
            url : "http://www.gaoxi.com/auths/reg/doreg",
            type : "POST",
            data: {"userName":$("#regname").val(),"userPhone":$("#regname").val(),
                "userPwd":$("#regpwd").val(),"code":$("#phonecode").val()},
            success : function(res){
                if(res.retcode =='000000')
                {
                    console.log("注册成功");
                    swal({
                        title: "恭喜你",
                        text: "成功注册",
                        icon: "success",
                        button: "马上登录",
                    });
                    goLogin();


                }else{
                    regShow.css("display","block");
                    regTip.text("注册失败");
                }

            },
            error : function(){
                console.log('请求失败');
            }
        });
    }else {
        regTip.text("手机号错误");
        regShow.css("display","block");
        console.log("用户信息有误");
    }
});



//登录请求
$("#loginbtn").click(function () {
    $.ajax({
        url : "http://www.gaoxi.com/auths/login/accountLogin",
        type : "POST",
        data: {"useraccount":$("#account").val(),"userpwd":$("#pwd").val()},
        success : function(res){
          if(res.retcode=='000000')
          {
              console.log("登录成功");
              $("#modal-container-912437").modal('hide');
              location.reload();
          }else{
              console.log(res.retinfo);
              swal({
                  title: "提示",
                  text: res.retinfo,
                  icon: "error",
                  button: "我知道了",
              });
          }
        },
        error : function(){
            console.log('请求失败');
        }
    });
})

//登录信息获取
var user_token=$.cookie("user_token");
console.log(user_token);
//若用户已经登录信息获取
if(user_token!=undefined&&user_token!='')
{
    console.log(user_token);
    $.ajax({
        url : "http://www.gaoxi.com/auths/login/getuserinfo",
        type : "GET",
        data: {"userToken":user_token},
        success : function(res){
            var userInfo=res.data;
            if(userInfo!=null){
                console.log(userInfo);
                $("#nologin").css("display","none");
                $("#islogin").css("display",'block');
                if(userInfo.userImg !=''){   $("#userimg").attr("src",userInfo.userImg);}
                $("#username").text(userInfo.userName);
            }

        },
        error : function(){
            alert('请求失败');
        }
    });
}else{
    $("#nologin").css("display","block");
    $("#islogin").css("display",'none');
}