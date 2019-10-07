$(document).ready(function () {

    //onLoad set the auth data
    let user = JSON.parse(localStorage.getItem('user'))
    $('.userTopLastName').children().remove();
    $('.userTopLastName').text(user.lastName);
    let hallID = localStorage.getItem('hallID');

    //function for getting the departments
    function getRoom(){
        $.ajax({
            method: 'get',
            url:`http://localhost:5000/api/rooms/${hallID}`,
            success:function (data) {
                if(data.ok){
                    //removing children
                    $('.roomsBody').children().remove();
                    data.data.map(function (room, i) {
                        $('.roomsBody').append(`
                            <tr >
                                <td>${room.name}</td>
                                <td>${room.usersId.length}</td>
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

    getRoom();
    //add new room for this department
    $('.addRoom').submit(function (e) {
        e.preventDefault();
       $.ajax({
           method: 'post',
           url:'http://localhost:5000/api/room/create',
           dataType:'json',
           data:{
               hallId:hallID
           },
           success:function (data) {
               if(data.ok){
                   $.notify('Added new room successfully');
               }
           },
           error:function (err) {
               console.log(err);
           }
       })
        setTimeout(()=>{
            getRoom();
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
});