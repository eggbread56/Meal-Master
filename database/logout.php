<?php
    session_start();
    session_destroy();
    // Additional cleanup or redirect logic if needed
    echo json_encode(['status' => 'success', 'message' => 'Session destroyed']);
?>