$(document).ready(function () {
    //onLoad set the auth data
    let user = JSON.parse(localStorage.getItem('user'))
    $('.userTopLastName').children().remove();
    $('.userTopLastName').text(user.lastName);


    //function for getting the departments
    function getDepartment(){
        $.ajax({
            method: 'get',
            url:'http://localhost:5000/api/departments',
            success:function (data) {
                if(data.ok){
                    //removing children
                    $('.departmentsBody').children().remove();
                    data.data.map(function (dept, i) {
                        $('.departmentsBody').append(`
                            <tr >
                                <td>${dept.name}</td>
                                <td>${dept.code}</td>
                            </tr>
                        `)
                    });
                }
            },
            error:function (err) {
                console.log(err);
            }
        })
    }

    getDepartment();

    //on click on add button to show form
    $('.addDepartmentBtn').click(function () {
        $('.addDepartmentBlock').removeAttr('hidden');
        $(this).attr('hidden',true)
    });

    //submit adding department
    $('.addDepartment').submit(function (e) {
        e.preventDefault();
        let name = $('#dept_name').val().trim();
        let code = $('#dept_code').val().trim();

        if(name == ''){
            $('#dept_name').css('border','1px solid #f00');
        }else if(code == ''){
            $('#dept_name').css('border','1px solid #b2b2b2');
            $('#dept_code').css('border','1px solid #f00');
        }else{
            $('#dept_code').css('border','1px solid #b2b2b2');
            //submit here
            $.ajax({
                method:'Post',
                url:'http://localhost:5000/api/department/create',
                dataType:'json',
                data:{
                    name:name,
                    code:code
                },
                success:function(data){
                    if(data.ok){
                        $.notify(`${data.data.name} department was added successfully`);
                    }
                },
                error:function (err) {
                    console.log(err);
                }
            })
        }
        $('#dept_name').val('');
        $('#dept_code').val('');
        setTimeout(()=>{
            getDepartment();
        },1000)
    });

    //onclick on logout remove user from localstorage
    $('.logoutBtn').click(function () {
        localStorage.removeItem('user');
        $.notify(`Logging out <i class="fa fa-refresh"></i>...`);

        setTimeout(()=>{
            window.location.href = 'login.htm';
        },2000);
    });
})