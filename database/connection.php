<?php
    $con  = mysqli_connect('localhost','root','','meal-master');
    if(mysqli_connect_errno())
    {
        echo 'Database Connection Error';
    }
?>