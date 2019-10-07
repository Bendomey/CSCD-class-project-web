$(document).ready(function () {
    //onLoad set the auth data
    let user = JSON.parse(localStorage.getItem('user'))
    $('.userTopLastName').children().remove();
    $('.userTopLastName').text(user.lastName);

    let now = new Date().getUTCHours();
    let name = user.firstName
    let fonstawesome = user.gender == 'm' ? "<i class='fa fa-male'></i>" : "<i class='fa fa-female'></i>"
    if(now > 0 && now < 12){
        $('.greeting').append(`Good morning, ${name} ${fonstawesome}`)
    }else if(now >= 12 && now < 4){
        $('.greeting').append(`Good afternoon, ${name} ${fonstawesome}`)
    }else{
        $('.greeting').append(`Good Evening, ${name} ${fonstawesome}`)

    }

    //get data
    function getRooms(){
        $.ajax({
            method:'get',
            url:'http://localhost:5000/api/room/users/a',
            dataType:'json',
            success:function (data) {
                if(data.ok){
                    $('.roomsWithUsers').children().remove();
                    data.data.map((room, i) => {
                        $('.roomsWithUsers').append(`
                        <tr>
                            <th scope="row">${room.name}</th>
                            <th>${room.users[0] == undefined ? 'N/A' : room.users[0].firstName + " " + room.users[0].lastName}</th>
                            <th>${room.users[1] == undefined ? 'N/A' : room.users[1].firstName + " " + room.users[1].lastName}</th>
                            <th>${room.users[2] == undefined ? 'N/A' : room.users[2].firstName + " " + room.users[2].lastName}</th>
                            <th>${room.users[2] == undefined ? 'N/A' : room.users[3].firstName + " " + room.users[3].lastName}</th>
                        </tr>
                    `)
                    });

                }
            },
            error:function (e) {
                console.log(e);
            }
        })
    }

    getRooms();


    //onclick on logout remove user from localstorage
    $('.logoutBtn').click(function () {
        localStorage.removeItem('user');
        $.notify(`Logging out <i class="fa fa-refresh"></i>...`);

        setTimeout(()=>{
            window.location.href = 'login.htm';
        },2000);
    });
})