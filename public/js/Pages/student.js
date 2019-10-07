
$(document).ready(function () {
    //onLoad set the auth data
    let user = JSON.parse(localStorage.getItem('user'))
    $('.userTopLastName').children().remove();
    $('.userTopLastName').text(user.lastName);

    $('.residentStatus').children().remove();
    $('.residentStatus').append(localStorage.getItem('roomId') == undefined ? `<a class="nav-link disabled" href="#">Not Set</a>` : `<a class="nav-link text-success disabled" href="#">Set</a>`)

    if(localStorage.getItem('roomId') == undefined){
        $('.registerBlock').removeAttr('hidden')
        $('.roomDetails').attr('hidden',true);
        $('.roomMoreDetails').attr('hidden',true);
    }else{
        $('.registerBlock').attr('hidden');
        $('.roomDetails').removeAttr('hidden');
        $('.roomMoreDetails').removeAttr('hidden');
    }

    //getSingleRoom
    function getsingleRoom(){
        $.ajax({
            method: 'get',
            url:`http://localhost:5000/api/room/${localStorage.getItem('roomId')}`,
            success:function (data) {
                if(data.ok){
                    $('.nameOfRoom').children().remove();
                    $('.nameOfRoom').append(data.data.name)
                }
            },
            error:function (err) {
                console.log(err);
            }
        })
    }

    getsingleRoom();
    
    //removing room
    $('.removeRoom').click(function (e) {
        e.preventDefault();
       $.ajax({
           method:'post',
           url:'http://localhost:5000/api/room/removeFromRoom',
           dataType:'json',
           data:{
               id:user._id,
               roomId:localStorage.getItem('roomId')
           },
           success:function (data) {
               if(data.ok){
                   localStorage.removeItem('roomId');
                   $.notify("Removed room");
                   setTimeout(()=>{
                       window.location.href = 'student_dasboard.htm'
                   },1000)
               }
           },
           error:function (e) {
               console.log(e);
           }
       })
    });
    
    //toggling the form for choosing hall
    $('.chooseHallBtn').click(function () {
       $('.formForChoosingHall').removeAttr('hidden')
        $(this).attr('hidden',true);
    });

    //choose halls
    //function for getting the departments
    function getHall(){
        $.ajax({
            method: 'get',
            url:'http://localhost:5000/api/halls',
            success:function (data) {
                if(data.ok){
                    //removing children
                    // $('.hallSelect').children().remove();
                    data.data.map(function (hall, i) {
                        $('.hallSelect').append(`
                            <option value="${hall._id}">${hall.name}</option>
                        `)
                    });
                }
            },
            error:function (err) {
                console.log(err);
            }
        })
    }
    getHall();

    //choose rooms based on halls
    function getRoom(val){
        if(val == ''){
            $('.roomSelect').children().remove();

            return  $('.roomSelect').append(`
                           <option value="">Please Choose</option>
                        `)
        }
        $.ajax({
            method: 'get',
            url:`http://localhost:5000/api/rooms/${val}`,
            success:function (data) {
                if(data.ok){
                    //removing children
                    $('.roomSelect').children().remove();
                    $('.roomSelect').append(`
                           <option value="">Please Choose</option>
                        `)
                    data.data.map(function (room, i) {
                        $('.roomSelect').append(`
                           <option value="${room._id}">${room.name}</option>
                        `)
                    });
                }
            },
            error:function (err) {
                console.log(err);
            }
        })
    }

    $('#hall').change(function () {
        let val = $(this).val().trim();
        getRoom(val);
    })

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

    //submiting
    $('.chooseHall').submit(function (e) {
        e.preventDefault();
        if($('#hall').val().trim() == ''){
            $('#hall').css('border','1px solid #f00');
        }else if($('#room').val().trim() == ''){
            $('#hall').css('border','1px solid #b2b2b2');
            $('#room').css('border','1px solid #f00');
        }else{
            $('#room').css('border','1px solid #b2b2b2');

            //post
            $.ajax({
                method:'post',
                url:'http://localhost:5000/api/room/applyToRoom',
                dataType:'json',
                data:{
                    id:user._id,
                    roomId:$('#room').val().trim()
                },
                success:function (data) {
                    if(data.ok){
                        localStorage.setItem('roomId',data.data._id);
                        $.notify('Registered to this room successfully');
                        setTimeout(()=>{
                            window.location.href = 'student_dasboard.htm';
                        },1000);
                    }
                },
                error:function (err) {
                    console.log(err);
                }
            })
        }
    });


    //onclick on logout remove user from localstorage
    $('.logoutBtn').click(function () {
        localStorage.removeItem('user');
        localStorage.removeItem('roomId');
        $.notify(`Logging out <i class="fa fa-refresh"></i>...`);

        setTimeout(()=>{
            window.location.href = 'login.htm';
        },2000);
    });
})