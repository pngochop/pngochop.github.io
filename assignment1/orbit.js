<span id="cir" style="position:absolute; top:100px; left:300px;z-index:2">[ <font color="red">YOUR TEXT</font> ]</span>
<p id=circle>Circle</p>
<p id=circle2>Circle</p>
<script type="text/javascript"><!--
/*
 _____________________________________
/¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯\
| Another JavaScript from Uncle Jim   |
| Feel free to copy, use and change   |
| this script as long as this part    |
| remains unchanged. You can visit    |
| my website at http://jdstiles.com   |
| for more scripts like this one.     |
| Created: 1996 Updated: 2006         |
\_____________________________________/
 ¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯
*/
// CIRCLE
R0=50 // Radius
A=0 // Rads. 1 degree = 3.14150/180 radians
//cx=screen.availwidth/2-cir.offsetWidth/2 //use for centering x
//cy=screen.availHeight/2-cir.offsetHeight/2 // use for centering y
cx=parseInt(document.getElementById("cir").style.left) // use for positioning left
cy=parseInt(document.getElementById("cir").style.top) // use for positioning top

function orbit(){
A=A+.05 // Increase angle adding .1 each time. Change direction by subtracting.
c=Math.cos(A)
s=Math.sin(A)
x=(R0*c)+cx // new x coordinates
y=(R0*s)+cy // new y coordinates
document.getElementById("cir").style.left=x
document.getElementById("cir").style.top=y
document.getElementById("circle").innerHTML="Circle x = "+parseInt(x)
document.getElementById("circle2").innerHTML="Circle y = "+parseInt(y)
orb1=setTimeout("orbit()",30)
} 
// --></script>
