var interval = null;
var has_game_started = false;
var elapsedTime = 0;

window.onbeforeunload = function (e) {
    if(has_game_started) {
        return "Are you sure you want to leave?";
    }
};

function shuffler(array){
    var counter = array.length;

    while (counter > 0) {
        counter--;
        var index = Math.floor(Math.random() * counter);

        var temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function ms_to_time(s) {

    function pad(n, z) {
        z = z || 2;
        return ('00' + n).slice(-z);
    }

    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;

    return  pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
}


function start_timer(){
    var startTime = Date.now();

    interval = setInterval(function() {
        elapsed_time = Date.now() - startTime;
        // document.getElementById("timer").innerHTML = (elapsed_time / 1000).toFixed(3);
        document.getElementById("timer").innerHTML = ms_to_time(elapsed_time);
    }, 100);
}

function stop_timer(){
    clearInterval(interval);
}

function start_game(){

    var new_array = []

    //little shuffle animation
    for(var i=0; i<10; i++){
        setTimeout(function(){
            new_array = shuffler([1,2,3,4,5,6,7,8,9]);
            for(var i = 0; i < new_array.length; i++){
                $("#index" + i).attr('data-value', new_array[i]);
                $("#index" + i).siblings('label').text(new_array[i]);
            }
        }, i* 100);
    }
    
    
    setTimeout(function(){
        start_timer();
        has_game_started = true;
    }, 1000);

    $("#buttons").hide();
    $("#timer_wrapper").show();
}

function toggle_color(input){
    if($(input).prop('checked')){
        $(input).siblings('label').css({'color':'yellow'});
    } else {
         $(input).siblings('label').css({'color':'white'});
    }
    
}

function number_is_clicked(input){

    if(has_game_started){
        toggle_color(input);
        if($("input[type=checkbox]:checked").length == 2){
            check_if_valid($("input[type=checkbox]:checked").first(), $("input[type=checkbox]:checked").last());
        }
    } else {
        $("#index" + $(input).attr('data-index')).prop('checked', false);
    }
}

function check_if_valid(first, second){

    var address1 = $(first).attr('data-index');
    var address2 = $(second).attr('data-index');

    var value1 = $(first).attr('data-value');
    var value2 = $(second).attr('data-value');

    if(address1 == (address2 + 1) ||
       address1 == (address2 - 1) ||
       address1 == (address2 + 3) ||
       address1 == (address2 - 3)) {
        swap_numbers(value1, value2, address1, address2);

    } else {
        //show prompt invalid move
        $(".alert.alert-danger").fadeTo(100, 1);
        $(".alert.alert-danger").fadeTo(1500, 0);

        $("#index" + address1).prop('checked', false);
        $("#index" + address1).siblings('label').css({'color':'white'});
        $("#index" + address2).prop('checked', false);
        $("#index" + address2).siblings('label').css({'color':'white'});
    }
}

function swap_numbers(value1, value2, address1, address2){

    //swap 2 value and its displayed number
    $("#index" + address1).attr('data-value', value2);
    $("#index" + address1).siblings('label').text(value2).css({'color':'white'});
    $("#index" + address2).attr('data-value', value1);
    $("#index" + address2).siblings('label').text(value1).css({'color':'white'});

    //remove checked property
    $("#index" + address1).prop('checked', false);
    $("#index" + address2).prop('checked', false);

    check_grid();
}

function check_grid(){
    var correct = "1,2,3,4,5,6,7,8,9";
    var current = [];

    $("input[type=checkbox]").each(function(){
        current.push($(this).attr('data-value'));
    });

    if(correct == current.toString()){
        stop_timer();
        submit_elapsed_time(elapsed_time);
        has_game_started = false;
    }
}

function submit_elapsed_time(elapsed_time){
    $("#elapsed_time").val(elapsed_time);
    $("form").submit();
}