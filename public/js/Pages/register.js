$(document).ready(function () {
    //toggling of user type
    $('#userType').change(function () {
       if($(this).val().trim() == 'student'){
           $('.departmentBlock').removeAttr('hidden');
       } else{
           $('.departmentBlock').attr('hidden', true);
       }
    });

    //get departments
    $.ajax({
        method: 'get',
        url:'http://localhost:5000/api/departments',
        success:function (data) {
            if(data.ok){
                data.data.map(function (dept, i) {
                   $('#department').append(`
                    <option value="${dept._id}">${dept.name}</option>
                   `)
                });
            }
        },
        error:function (err) {
            console.log(err);
        }
    })

    //register user
    $('.registerForm').submit(function (e) {
       e.preventDefault();
       //check the fields
       let first_name = $('#first_name').val().trim();
       let last_name = $('#last_name').val().trim();
       let gender = $('#gender').val().trim();
       let dob = $('#dob').val().trim();
       let userType = $('#userType').val().trim();
       let department = $('#department').val().trim();

       if(first_name == ''){
           $('#first_name').css('border-bottom','1px solid #f00')
       }else if(last_name == ''){
           $('#first_name').css('border-bottom','1px solid #b2b2b2')
           $('#last_name').css('border-bottom','1px solid #f00')
       }else if(gender == ''){
           $('#last_name').css('border-bottom','1px solid #b2b2b2')
           $('#gender').css('border-bottom','1px solid #f00')
       }else if(dob == ''){
           $('#gender').css('border-bottom','1px solid #b2b2b2');
           $('#dob').css('border-bottom','1px solid #f00')
       }else if(userType == ''){
           $('#dob').css('border-bottom','1px solid #b2b2b2');
           $('#userType').css('border-bottom','1px solid #f00');
       }else if (userType == 'student' && department == ''){
           $('#userType').css('border-bottom','1px solid #b2b2b2');
           $('#department').css('border-bottom','1px solid #f00');
       } else{
           $('#userType').css('border-bottom','1px solid #b2b2b2');
           //do shid
           $.ajax({
               method:'post',
               url:'http://localhost:5000/api/register',
               dataType:'json',
               data:{
                   firstName:first_name,
                   lastName:last_name,
                   gender:gender,
                   dob:dob,
                   userType:userType,
                   departmentID:department
               },
               success:function (data) {
                   if(data.ok == true){
                       $.notify(`Registration successful<br /> ID: ${data.data.id} and PIN: ${data.auth.pin} `);
                   }else{
                        alert(JSON.stringify(data));
                   }
               },
               error:function (err) {
                   console.log(err);
               }
           })
       }
   });



});