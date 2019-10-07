$(document).ready(function () {
   $('.loginForm').submit(function (e) {
       e.preventDefault();
       let id = $('#id').val().trim();
       let pin = $('#pin').val().trim();

       if(id == ''){
           $('#id').css('border-bottom','1px solid #f00');
       }else if(pin == ''){
           $('#id').css('border-bottom','1px solid #b2b2b2');
           $('#pin').css('border-bottom','1px solid #f00');
       }else{
           $('#pin').css('border-bottom','1px solid #b2b2b2');

           //post data
           $.ajax({
               method:'post',
               url:'http://localhost:5000/api/login',
               dataType:'json',
               data:{
                   id:id,
                   pin:pin
               },
               onload:console.log('loading'),
               success:function (data) {
                   if(data.ok){
                       localStorage.setItem('user',JSON.stringify(data.data));
                       $.notify(`Authenticated successful<br /> Redirecting in 5...`);
                       //redirect
                       setTimeout(()=>{
                           if(data.data.userType == 'student'){
                               window.location.href = 'student_dasboard.htm'
                           }else{
                               window.location.href = 'admin_dashboard.htm'
                           }
                       },5000);
                   }
               },
               error:(err) => {
                   $.notify(err.responseJSON.error);
               }
           })
       }
   });
});