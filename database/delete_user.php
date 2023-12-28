<?php 
session_start();
include('connection.php');

if (!empty($_POST['id'])) {
    $user_id = $_POST['id'];
    $sql = "DELETE FROM users WHERE id='$user_id'";
    $delQuery =mysqli_query($con,$sql);
    if($delQuery==true)
    {
        echo 'success';
    }
    else
    {
        echo 'failed';
    } 
}


?>