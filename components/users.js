const Users = () => {
    
    $(document).ready(function () {
        const userTable = $('#users').DataTable({
            serverSide: true,
            processing: true,
            ordering: true,
            paging: true,
            order: [[0, "desc"]],
            ajax: {
                url: "./database/fetch_users.php",
                type: "post",
                data: function (d) {
                    d.draw = d.draw || 1;
                    d.start = d.start || 0;
                    d.length = d.length || 10;
                    d.order = d.order || [{ column: 0, dir: 'desc' }];
                    d.search = d.search || { value: '' };
                }
            },
            columns: [
                { data: 'id' },
                { data: 'name' },
                { data: 'email' },
                { data: 'role' },
                {
                    data: 'actions',
                    render: function (data, type, row) {
                        return `
                            <button class="btn btn-danger delete-user" data-id="${row.id}">Delete</button>
                        `;
                    }
                }
            ],
            createdRow: function (row, data, dataIndex) {
                row.style.transition = '1s';
                row.setAttribute('data-health-condition', data.health_conditions);
            }
        });

        $(document).on('submit', '#addAdmin', function (e) {
            e.preventDefault();
            var name = $('#addAdminField').val();
            var email = $('#addEmailField').val();
            if (name != '' && email != '') {
                $.ajax({
                    url: "./database/add_user.php",
                    type: "post",
                    data: {
                        name: name,
                        email: email
                    },
                    success: function (data) {
                        var json = JSON.parse(data);
                        var status = json.status;
                        if (status == 'true') {
                            userTable.draw();
                            $('#addAdminField').val('');
                            $('#addEmailField').val('');
                            $('#addAdminModal').modal('hide');
                            Swal.fire(
                                'Added!',
                                'New admin has been added',
                                'success'
                            )
                        } else {
                            Swal.fire(
                                'Error',
                                'Database Error',
                                'error'
                            )
                        }
                    }
                });
            } else {
                Swal.fire(
                    'Warning!',
                    'All Fields are required!',
                    'warning'
                )
            }
        });

        $('#users').on('click', '.expand-row', function () {
            const tr = $(this).closest('tr');
            const i = $(this).closest('i');
            const row = userTable.row(tr);
            const condition = $(this).closest('tr').attr('data-health-condition');

            if (row.child.isShown()) {
                row.child.hide();
                tr.removeClass('shown');
                i.removeClass('fa-circle-minus');
                i.addClass('fa-circle-plus');
            } else {
                if(condition != "null") {
                    row.child('Conditions: ' + condition).show('slow');
                }else {
                    row.child('Conditions: None').show('slow');
                }
                tr.addClass('shown');
                i.removeClass('fa-circle-plus');
                i.addClass('fa-circle-minus');
            }
        });

        $('#users').on('click', '.delete-user', function (e) {
            const userID = $(this).attr('data-id');
            const currentRow = $(this).closest('tr');

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false
            });

            swalWithBootstrapButtons.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        url: "./database/delete_user.php",
                        data: {
                            id: userID
                        },
                        type: "post",
                        success: function (data) {
                            if (data == 'success') {
                                userTable.draw();
                                swalWithBootstrapButtons.fire(
                                    'Deleted!',
                                    'User has been deleted',
                                    'success'
                                )
                                currentRow.remove();
                            } else {
                                swalWithBootstrapButtons.fire(
                                    'Abort',
                                    'Database Error',
                                    'error'
                                )
                                return;
                            }
                        }
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire(
                        'Cancelled',
                        'User not deleted',
                        'error'
                    )
                }
            });
        });
    });

    return `
        <button id="addAdminBtn" type="button" class="btn btn-primary add-button" data-bs-toggle="modal" data-bs-target="#addAdminModal">Add Admin</button>
        <div class="modal fade" id="addAdminModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Add Admin</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addAdmin" action="">
                            <div class="mb-3 row">
                                <label for="addNameField" class="col-md-3 form-label">Name</label>
                                <div class="col-md-9">
                                    <input type="text" class="form-control" id="addAdminField" name="name">
                                </div>
                            </div>
                            <div class="mb-3 row">
                                <label for="addEmailField" class="col-md-3 form-label">Email</label>
                                <div class="col-md-9">
                                    <input type="email" class="form-control" id="addEmailField" name="email">
                                </div>
                            </div>
                            <div class="text-center">
                                <button type="submit" class="btn btn-primary">Submit</button>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
        <table id="users" class="table table-hover table-sm" style="width:100%">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>`;
}

export default Users;