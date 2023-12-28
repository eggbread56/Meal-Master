<?php
session_start();
if(isset($_SESSION['id'])) {
include('connection.php');
$id = $_SESSION['id'];
$sql = "SELECT u.id, u.name, 
        up.health_conditions
        FROM users u
        LEFT JOIN user_profile up ON u.id = up.user_id
        WHERE id = $id";

$result = $con->query($sql);

$users = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $user = array(
            "id" => $row["id"],
            "name" => $row["name"],
            "health_conditions" => $row["health_conditions"]
        );
        $users[] = $user;
    }
    echo json_encode($users);
} else {
    echo json_encode(array("message" => "No info found"));
}

$con->close();
}
?>