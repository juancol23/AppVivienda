<?php

 header('Access-Control-Allow-Origin: *'); 
 header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");


$json = file_get_contents('php://input');

$obj = json_decode($json);


require_once ('vendor/autoload.php');



$from = new SendGrid\Email("YoBusco", "yobusco@yobusco.pe");
$subject = "Informacion del solicitante " . $obj->{"nombre"} . " " .$obj->{"apellido"} ;
$to = new SendGrid\Email($obj->{"nombre_vendedor"}." ".$obj->{"apellido_vendedor"}, 
	$obj->{"email_vendedor"});
$content = new SendGrid\Content("text/html",

 '<div  style="color:white;font-weight:bold;font-size:30px;background-color:rgb(24, 52, 207);padding:15px;text-align:center">DATOS DEL SOLICITANTE</div><br>

<div ><br>
<div style="font-size:24px"><b>Nombre: </b><span style=\"color:#000000;\">
'.$obj->{"nombre"} . " " .$obj->{"apellido"}.'</span></div><br>
<div style="font-size:24px"><b>Email: </b><span style=\"color:#000000;\">    '.$obj->{"email_solicitante"}.'</span></div><br>
<div style="font-size:24px"><b>Celular: </b><span style=\"color:#000000;\">    '.$obj->{"celular"}.'</span></div><br>
<br>
</div> 

');


$mail = new SendGrid\Mail($from, $subject, $to, $content);
$apiKey = ('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');
$sg = new \SendGrid($apiKey);


$response = $sg->client->mail()->send()->post($mail);



echo $response->{"_status_code"};



?>


