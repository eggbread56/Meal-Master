<?php
session_start();
include('connection.php');

$output = array();
$draw = isset($_POST['draw']) ? $_POST['draw'] : 1;
$start = isset($_POST['start']) ? $_POST['start'] : 0;
$length = isset($_POST['length']) ? $_POST['length'] : 10;
$order_column = isset($_POST['order'][0]['column']) ? $_POST['order'][0]['column'] : 0;
$order_dir = isset($_POST['order'][0]['dir']) ? $_POST['order'][0]['dir'] : 'desc';
$search = isset($_POST['search']['value']) ? $_POST['search']['value'] : '';

$columns = array(
    0 => 'id',
    1 => 'name',
    2 => 'email',
    3 => 'role',
);

$order_by = $columns[$order_column];

$sql = "SELECT users.*, user_role.role, user_profile.health_conditions
FROM users 
LEFT JOIN user_role ON users.id = user_role.user_id 
LEFT JOIN user_profile ON users.id = user_profile.user_id
WHERE users.name LIKE '%$search%' OR users.email LIKE '%$search%' OR user_role.role LIKE '%$search%' OR user_profile.health_conditions LIKE '%$search%'
ORDER BY $order_by $order_dir 
LIMIT $start, $length";

$totalQuery = mysqli_query($con, "SELECT COUNT(*) as total FROM users 
LEFT JOIN user_role ON users.id = user_role.user_id 
LEFT JOIN user_profile ON users.id = user_profile.user_id
WHERE users.name LIKE '%$search%' OR users.email LIKE '%$search%' OR user_role.role LIKE '%$search%' OR user_profile.health_conditions LIKE '%$search%'");
$total_all_rows = mysqli_fetch_assoc($totalQuery)['total'];

$query = mysqli_query($con, $sql);
$count_rows = mysqli_num_rows($query);
$data = array();
while ($row = mysqli_fetch_assoc($query)) {
    $sub_array = array();
    $sub_array['id'] = $row['id'];
    $sub_array['name'] = '<i class="fa-solid fa-circle-plus expand-row extend-icon more-user-info" data-id="' . $row['id'] . '">  </i>' . $row['name'];
    $sub_array['email'] = $row['email'];
    $sub_array['role'] = $row['role'];
    $sub_array['health_conditions'] = $row['health_conditions'];
    $sub_array['actions'] = '<button data-id="' . $row['id'] . '" type="button" class="btn btn-danger btn-sm deleteBtn delete-user">Delete</button>';
    $data[] = $sub_array;
}

$output = array(
    'draw' => intval($draw),
    'recordsTotal' => $total_all_rows,
    'recordsFiltered' => $total_all_rows,
    'data' => $data,
);
echo json_encode($output);
?>