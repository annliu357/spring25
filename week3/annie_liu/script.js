var clickButton = new Audio("crunchy-bite-95979.mp3");
var cookieImg = document.getElementById("cookie");
var count = 0;
//imgs
var wholeCookie = "https://ferrero-kube-stack-prod-static.s3.eu-west-1.amazonaws.com/motherscookies-com/s3fs-public/2022-01/Circus-Animals-Group-home_0.png";
var biteCookie = "https://media.discordapp.net/attachments/1036463905800724501/1347150550365376614/image-removebg-preview_2.png?ex=67cac738&is=67c975b8&hm=e59c4c3f33eee5806fbdfe7df4721aa9773864a10d68dc7bf1be8b843fc54364&=&format=webp&quality=lossless&width=750&height=311";

function addOneToCounter(){
    document.getElementById("counter").innerText = parseInt(document.getElementById("counter").innerText) + 1;
    clickButton.play();
    count++;
    changeImage();

}

function changeImage (){
    if (count % 2 == 1) {
        //change to bite cookie img
        cookieImg.src = biteCookie;
    } else {
        //keep as is
        cookieImg.src = wholeCookie;
    }

}


function speed() { //will do this later


}
