<?php
session_start();
include('connection.php');

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["email"]) && isset($_POST["password"])) {
    $email = urldecode($_POST['email']);
    $password = $_POST["password"];
    $password = md5($password);
    
    $sql = "SELECT users.*, user_role.role 
    FROM users 
    LEFT JOIN user_role ON users.id = user_role.user_id WHERE email = '$email'";
    $result = $con->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if ($row['password'] == $password) {
    
            $_SESSION['id'] = $row['id'];
            $_SESSION['email'] = $email;
            $_SESSION['name'] = $row['name'];
            $_SESSION['role'] = $row['role'];

            echo json_encode(['status' => 'success', 'message' => 'Login successful']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid password']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'User not found']);
    }

    $con->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
}
?>