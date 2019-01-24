
    window.onload = function() {
        document.getElementById('textfield').onkeypress = function searchKeyPress(event) {
            if(event.keyCode == 13){
                document.getElementById('btnsearch').click();
            }
        }
    };

    function goSearch() {
        var carnum = document.getElementById('textfield').value;
        if(!carnum){
            alert("차량 고유번호를 입력하세요.");
            return;
        }
        location.href = "./search?carid="+carnum;
    }
