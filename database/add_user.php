<?php 
session_start();
include('connection.php');

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["password"]) && isset($_POST["checkedValues"])) {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $password = md5($password);
    $conditions = $_POST['checkedValues'];
    $stringCondition = implode(", ", $conditions);

    $sql = "INSERT INTO `users` (`name`,`email`,`password`) VALUES ('$name', '$email', '$password')";
    $query = mysqli_query($con, $sql);

    if ($query) {
        $lastUserId = mysqli_insert_id($con);

        $roleSql = "INSERT INTO `user_role` (`user_id`, `role`) VALUES ('$lastUserId', 'user')";
        $roleQuery = mysqli_query($con, $roleSql);

        $conditionSql = "INSERT INTO `user_profile` (`user_id`, `health_conditions`) VALUES ('$lastUserId', '$stringCondition')";
        $conditionQuery = mysqli_query($con, $conditionSql);

        if ($roleQuery && $conditionQuery) {

            $_SESSION['id'] = $lastUserId;
            $_SESSION['email'] = $email;
            $_SESSION['name'] = $name;
            $_SESSION['role'] = 'user';
            $data = array('status' => 'true');
            echo json_encode($data);
        } else {
            $data = array('status' => 'false');
            echo json_encode($data);
        }
    } else {
        $data = array('status' => 'false');
        echo json_encode($data);
    }

}else if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["email"]) && isset($_POST["name"])){
    $name = $_POST['name'];
    $email = $_POST['email'];

    $password = md5('admin');

    $sql = "INSERT INTO `users` (`name`,`email`,`password`) VALUES ('$name', '$email', '$password')";
    $query = mysqli_query($con, $sql);

    if ($query) {
        $lastUserId = mysqli_insert_id($con);

        $roleSql = "INSERT INTO `user_role` (`user_id`, `role`) VALUES ('$lastUserId', 'admin')";
        $roleQuery = mysqli_query($con, $roleSql);

        if ($roleQuery) {
            $data = array('status' => 'true');
            echo json_encode($data);
        } else {
            $data = array('status' => 'false');
            echo json_encode($data);
        }
    } else {
        $data = array('status' => 'false');
        echo json_encode($data);
    }
}
?>