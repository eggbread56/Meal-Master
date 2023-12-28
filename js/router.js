const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

const loadComponent = async (componentName) => {
  const { default: component } = await import(`../components/${componentName}.js`);
  return component();
};

const loadComponentWithId = async (componentName, id) => {
  const { default: component } = await import(`../components/${componentName}.js`);
  return component(id);
};

const getUser = async () => {
  try {
      const response = await fetch('./database/fetch_session.php');
      if (!response.ok) {
          throw new Error('Network response was not ok.');
          }
          return await response.json();
  } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      return `<div class="container mt-3"><p>Something went wrong in the connection with the database.</p></div>`;
  }
};


const logout = () => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'So soon...',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Logout'
  }).then((result) => {
    if (result.isConfirmed) {

      $.ajax({
        type: "POST",
        url: "./database/logout.php",
        success: function(response) {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            },
            willClose: (toast) => {
              window.location.href = '/meal-master/login.php';
            }
          })
          Toast.fire({
            icon: 'success',
            title: 'Signed out successfully'
          });
        },
        error: function() {
          Swal.fire(
              'Error',
              'An error occurred during the AJAX request.',
              'error'
          )
        }
      });
    }
  });
};

const router = async () => {
  const path = window.location.pathname;
  const user = await getUser();

  const app = document.getElementById('app');
  switch (true) {
    case /\/meal-master\/home$/.test(path):
      if (user.user_role == 'user') {
        app.innerHTML = await loadComponent('home');
      } else {
        app.innerHTML = `<h2>Page Not Found</h2>`;
      }
      break;
    case /\/meal-master\/users$/.test(path):
      if (user.user_role == 'admin') {
        app.innerHTML = await loadComponent('users');
      } else {
        app.innerHTML = `<h2>Unauthorized Access</h2>`;
      }
      break;
    case /\/meal-master\/recipes$/.test(path):
      if (user.user_role === 'admin') {
        app.innerHTML = await loadComponent('recipes');
      } else {
        app.innerHTML = `<h2>Unauthorized Access</h2>`;
      }
      break;
    case /\/meal-master\/addrecipe$/.test(path):
      if (user.user_role === 'admin') {
        app.innerHTML = await loadComponent('addrecipe');
      } else {
        app.innerHTML = `<h2>Unauthorized Access</h2>`;
      }
      break;
    case /^\/meal-master\/editrecipe\/\d+$/.test(path):
      break;
    case /\/meal-master\/editrecipe$/.test(path):
      break;
    case /\/meal-master\/planner$/.test(path):
      if (user.user_role === 'user') {
        app.innerHTML = await loadComponent('planner');
      } else {
        app.innerHTML = `<h2>Page Not Found</h2>`;
      }
      break;
    case /\/meal-master\/logout$/.test(path):
      break;
    default:
      app.innerHTML = `<h2>Page not found</h2>`;
  }
};

window.onload = function() {
  router();

  const path = window.location.pathname;

  const setActiveLink = (link) => {
    const links = document.querySelectorAll('.menus');
    links.forEach((el) => {
      el.parentElement.classList.remove('active');
    });
    link.classList.add('active');
  };

  const handleClick = (e) => {
    e.preventDefault();
    const href = e.target.getAttribute('href');
    const link = e.target.closest('li');

    if (link) {
      setActiveLink(link);
    }

    if (href == 'logout') {
      logout();
    } else if (href == 'editrecipe') {
      const recipeId = e.target.dataset.recipeId;
      navigateTo(`editrecipe/${recipeId}`);
    } else {
      navigateTo(href);
    }
  };

  $(document).on("click",".menus, #addRecipeBtn, #backRecipeBtn, .edit-recipe", handleClick);

  const links = document.querySelectorAll('.menus');
  links.forEach((link) => {
    if (link.getAttribute('href') === path) {
      setActiveLink(link.closest('li'));
    }
  });

  window.addEventListener('popstate', () => {
    const activeLink = document.querySelector('.menus.active');
    if (activeLink) {
      activeLink.parentElement.classList.remove('active');
    }

    const currentLink = document.querySelector(`.menus[href="${window.location.pathname}"]`);
    if (currentLink) {
      setActiveLink(currentLink.closest('li'));
    } 
    router();
  });
};
