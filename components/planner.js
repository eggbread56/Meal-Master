let filteredRecipes = [];
const fetchFavorites = async () => {
  try {
    const response = await fetch('./database/fetch_saved_recipe.php');
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching saved recipes:', error);
    return [];
  }
};
const saveFavorites = async (recipeId) => {
  try {
    const response = await fetch('./database/save_recipe.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recipeId: recipeId
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Succeed!",
      text: "Saved to Favorite Recipes!",
      icon: "success"
    });
  } catch (error) {
    console.error('Error saving recipe:', error);
  }
};

const unsaveFavorites = async (recipeId) => {
  try {
    const response = await fetch('./database/unsave_recipe.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipeId }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const recommendedContent = await getFavoriteRecipes();
    const recommendedSection = document.querySelector('.recommended-section');
    recommendedSection.innerHTML = recommendedContent;
  } catch (error) {
    console.error('Error unsaving recipe:', error);
  }
};

const openFavoriteModal = (recipe) => {
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  modalTitle.textContent = recipe.recipeName;
  const ingredientsList = recipe.ingredients.split('|').map(ingredient => `<li>${ingredient.trim()}</li>`).join('');
  const proceduresList = recipe.procedures.split('|').map((step, index) => `<p><strong>Step ${index + 1}: </strong>${step.trim()}</p>`).join('');

  modalBody.innerHTML = `
    <h6>Nutritional Values:</h6>
    <ul>
      <li>Carbs: ${recipe.carbs}</li>
      <li>Fat: ${recipe.fat}</li>
      <li>Protein: ${recipe.protein}</li>
      <li>Calories: ${recipe.calories}</li>
    </ul>

    <h6>Ingredients:</h6>
    <ul>${ingredientsList}</ul>

    <h6>Procedure:</h6>
    ${proceduresList}
  `;
  const myModal = new bootstrap.Modal(document.getElementById('recipeModal'));
  myModal.show();
};

const fetchFavoriteRecipes = async () => {
  const response = await fetch('./database/fetch_recipe.php');
  if (!response.ok) {
    throw new Error('Network response was not ok.');
  }
  return response.json();
};

const fetchFavoriteUser = async () => {
  const responseUser = await fetch('./database/fetch_user_by_ID.php');
  if (!responseUser.ok) {
    throw new Error('Network response was not ok.');
  }
  return responseUser.json();
};

const filterFavoriteRecipesByCondition = (recipes, condition, filters) => {
  if (condition.includes('Allergy')) {
    const conditionFilters = filters[condition] || [];
    conditionFilters.forEach(filter => {
      recipes = recipes.filter(recipe => !recipe.ingredients.toLowerCase().includes(filter.toLowerCase()));
    });
  } else if (condition === "Hypertension" || condition === "Heart Disease" || condition === "Diabetes") {
    recipes = recipes.filter(recipe => {
      const { carbs, fat, protein, calories } = recipe;
      return (
        (condition === "Hypertension" && carbs < 325 && fat < 78 && protein < 175 && calories < 700) ||
        (condition === "Heart Disease" && carbs < 75 && fat < 40 && protein < 77 && calories < 700) ||
        (condition === "Diabetes" && carbs < 325 && fat < 175 && protein < 78 && calories < 700)
      );
    });
  }
  return recipes;
};

const getFavoriteRecipes = async () => {
  try {
    const recipesData = await fetchFavoriteRecipes();
    const userDataArray = await fetchFavoriteUser();
    const savedRecipes = await fetchFavorites();
    const userData = userDataArray[0];

    const userHealthConditions = userData.health_conditions.split(', ').map(condition => condition.trim());

    const healthConditionsFilters = {
      'Fish Allergy': ["Salmon","Tuna","Cod","Tilapia","Trout","Haddock","Mackerel","Sardines","Anchovies","Mahi-mahi","Halibut","Catfish","Swordfish","Bass","Perch","Snapper","Flounder","Carp","Eel","Sole","Smelt","Pike","Whitefish","Butterfish","Wolffish","Caviar","Roe","Octopus","Squid","Cuttlefish","Scallops","Shrimp","Prawns","Lobster","Crab","Crawfish","Clams","Mussels","Oysters","Abalone","Jellyfish","Geoduck","Sea urchin","Conch","Cockles","Limpets","Barnacles","Sea cucumber","Razor clams","Slipper shell","Chiton","Krill","Plankton","Krill oil","Fish sauce","Fish stock","Dashi","Bonito","Fish paste","Fish balls","Fish cakes","Surimi","Fish maw","Fish roe","Fish collagen","Fish meal","Fish oil","Fish skin","Fish bone broth","Fish skin crackers","Fish skin snacks","Fish jerky","Fish floss","Fish flakes","Fish sausage","Fish sticks","Fish fingers","Fish fillet","Fish steak","Fish head","Fish tail","Fish belly","Fish belly strips","Fish gut","Fish liver","Fish eyes","Fish scales","Fish fins","Fish swim bladder","Fish bladder","Fish lips","Fish cheeks","Fish throat","Fish collar","Fish bones","Fish spine","Fish blood","Fish gills","Fish innards","Fish intestines"],
      'Poultry Allergy': ["Chicken","Turkey","Duck","Goose","Quail","Pheasant","Ostrich","Emu","Egg","Hen","Rooster","Broiler","Fowl","Gizzard","Liver","Oviduct","Ovum","Albumen","Yolk","Shell","Eggshell","Egg white","Egg yolk","Scrambled egg","Omelette","Hard-boiled egg","Soft-boiled egg","Fried egg","Poached egg","Deviled egg","Egg salad","Egg custard","Egg wash","Egg noodles","Egg drop soup","Egg roll","Egg foo young","Egg tart","Egg bread","Egg substitute","Egg wash","Eggshell membrane"],
      'Dairy Allergy': ["Milk","Butter","Cheese","Yogurt","Cream","Sour cream","Ice cream","Ghee","Whey","Curd","Cottage cheese","Cream cheese","Mozzarella","Cheddar","Parmesan","Provolone","Swiss cheese","Feta","Ricotta","Goat cheese","Sheep cheese","Buttermilk","Condensed milk","Evaporated milk","Powdered milk","Whipped cream","Whipping cream","Half-and-half","Malted milk","Flavored milk","Almond milk","Soy milk","Coconut milk","Rice milk","Oat milk","Cashew milk","Hemp milk","Macadamia milk","Quark","Kefir","Lassi","Clabber","Casein","Lactose","Lactase","Lactaid","Skim milk","Low-fat milk","Fat-free milk","2% milk","Whole milk","Raw milk","Pasteurized milk","Homogenized milk","UHT milk","Chocolate milk","Strawberry milk","Vanilla milk","Cinnamon milk","Peanut milk","Hazelnut milk","Butterfat","Milk protein","Milk solids","Milk powder","Creamer","Non-dairy creamer"],
      'Nut Allergy': ["Almond","Peanut","Cashew","Walnut","Pistachio","Hazelnut","Macadamia","Brazil nut","Pecan","Coconut","Pine nut","Chestnut","Ginkgo nut","Hickory nut","Butternut","Shea nut","Beech nut","Acorn","Filbert","Chufa","Kola nut","Marcona almond","Monkey nut","Prunus amygdalus dulcis","Groundnut","Mandelonas","Mongongo","Nangai","Cicada nut","Pili nut","Redskin peanut","Sacha inchi","Snickerdoodle nut"],
      'Hypertension': [],
      'Heart Disease': [],
      'Diabetes': []
    };

    filteredRecipes = recipesData;

    userHealthConditions.forEach(condition => {
      if (healthConditionsFilters[condition]) {
        filteredRecipes = filterFavoriteRecipesByCondition(filteredRecipes, condition, healthConditionsFilters);
      }
    });

    filteredRecipes.forEach(recipe => {
      const isSaved = savedRecipes.some(savedRecipe => savedRecipe.recipe_id == recipe.id && savedRecipe.user_id == userData.id);
      recipe.isSaved = isSaved;
    });
    const favorites = filteredRecipes.filter(recipe => recipe.isSaved);
    
    if (favorites.length === 0) {
        return `
          <div class="container mt-3">
            <p>No recipes available.</p>
            <button class="btn btn-primary" onclick="window.location.href='/meal-master/home'">Go to Home</button>
          </div>`;
    } else {
      const chunkedRecipes = [];

    for (let i = 0; i < favorites.length; i += 6) {
    chunkedRecipes.push(favorites.slice(i, i + 6));
    }

      const carouselItems = chunkedRecipes.map((chunk, index) =>{
        const savedRecipesInChunk = chunk.filter(recipe => recipe.isSaved);
      return `
      <div class="carousel-item${index === 0 ? ' active' : ''}" data-bs-interval="10000">
        <div class="row">
          ${savedRecipesInChunk
            .map(recipe => `
            <div class="col-md-2">
              <div class="card">
                <img src="${recipe.recipeImage}" class="card-img-top" alt="${recipe.recipeName} Image" style="object-fit: cover; height: 200px;">
                <div class="card-body">
                  <h5 class="card-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${recipe.recipeName}</h5>
                  <div class="row">
                      <div class="col-8">
                           <button class="btn btn-primary view-favorite-recipe-btn" data-id="${recipe.id}">View</button>
                      </div>
                      <div class="col-4">
                          <div class="d-flex justify-content-end">
                              <button class="btn btn-primary save-favorite-recipe-btn" data-id="${recipe.id}">
                                ${recipe.isSaved ? '<i class="fa-regular fa-square-minus"></i>' : '<i class="fas fa-bookmark"></i>'}
                            </button>
                          </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `}).join('');

      return `
        <div id="carouselExampleDark" class="carousel carousel-dark slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            ${carouselItems}
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      `;
    }
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return `<div class="container mt-3"><p>Something went wrong while fetching recipes.</p></div>`;
  }
};

const createCarouselHTML = async (recipes, mealtime, currentDate, currentUserID) => {

  const mealPlanData = await fetchMealPlan();
  const mealPlanExistsData = mealPlanData.find(
    (item) => item.date === currentDate && item.meal_description == mealtime && item.user_id === currentUserID && recipes.some((recipe) => recipe.recipe_id == item.recipe_id)
  );
  
  const mealPlanExists = !!mealPlanExistsData;
  
  const existingRecipeID = mealPlanExists ? mealPlanExistsData.recipe_id : null;

  const noRecipeItem = `
    <div class="carousel-item active">
      <img src="./images/recipes/default.jpg" class="d-block w-100 carousel-meal-image" alt="">
      <div class="carousel-caption d-none d-md-block">
        <h5 class="recipeCarouselName">No Recipe Selected for this Meal</h5>
      </div>
    </div>
  `;

  let carouselItems = '';

if (!mealPlanExists) {
  carouselItems += noRecipeItem;
}

carouselItems += recipes
  .map((recipe, index) => `
    <div class="carousel-item${mealPlanExists ? (recipe.recipe_id == existingRecipeID ? ' active' : '') : ''}">
      <img src="${recipe.recipe_image}" class="d-block w-100 carousel-meal-image" alt="${recipe.recipe_name}">
      <div class="carousel-caption d-none d-md-block">
        <h6 class="recipeCarouselName">${recipe.recipe_name}</h6>
        <button class="btn btn-success view-recipe-btn" data-id="${recipe.recipe_id}">View</button>
      </div>
    </div>
  `)
  .join('');

  const carouselHTML = `
    <div id="carousel_${mealtime}" class="carousel carousel-dark slide" data-bs-interval="false">
      <div class="carousel-inner">
        ${carouselItems}
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carousel_${mealtime}" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carousel_${mealtime}" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  `;

  const carouselElement = document.createElement('div');
  carouselElement.innerHTML = carouselHTML;
  return carouselElement.innerHTML;
};

const getFavoriteSessionInfo = async () => {
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

const fetchMealPlan = async () => {
    try {
      const response = await fetch('./database/fetch_meal_plan.php');
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching meal plan:', error);
      return [];
    }
  };
  
  const populateCalendar = async () => {
    try {
      const mealPlanData = await fetchMealPlan();
      const user = await fetchFavoriteUser();
      const user_id = user[0].id;
      if (mealPlanData.message === "0 results") {
        const calendarEl = document.getElementById('calendar');
        const calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: 'dayGridMonth',
          events: []
        });
        calendar.render();
      } else {
        
        const events = mealPlanData.filter(meal => meal.user_id === user_id).map(item => {
            const [month, day, year] = item.date.split(' ');
            const parsedDate = new Date(`${month} ${day}, ${year}`);
    
            let start;
            switch (item.meal_description.toLowerCase()) {
                case 'breakfast':
                    start = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate(), 6, 0, 0);
                    break;
                case 'lunch':
                    start = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate(), 12, 0, 0);
                    break;
                case 'dinner':
                    start = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate(), 18, 0, 0);
                    break;
                default:
                    start = parsedDate;
                    break;
            }
            return {
              title: item.recipe_name,
              display: item.meal_description,
              start: start,
              description: item.meal_description,
              id: item.recipe_id,
            };
        });

        const calendarEl = document.getElementById('calendar');
        const calendar = new FullCalendar.Calendar(calendarEl, {
            eventContent: function(arg) {
                const eventTime = (arg.event.display || arg.timeText).toUpperCase();
                const eventName = arg.event.title;
                const recipe_id = arg.event.id;
                return {
                    html: `<div class="fc-content" data-id="${recipe_id}"><div class="fc-title" style="font-weight: 700;">${eventTime}</div><div class="fc-title">${eventName}</div></div>`
                };
            },
            initialView: 'dayGridMonth',
            events: events
        });
        calendar.render();
      }
    } catch (error) {
      console.error('Error fetching meal plan data:', error);
    }
  };

  const isModalOpen = () => {
    return $('#recipeModal').hasClass('show');
  };

  let editingEnabled = true;

  const toggleEditMode = () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });

    if ($('#editButton').text().trim() == "Edit") {
      editingEnabled = false;
      $('.section-overlay').hide('slow');
      $('#editButton').text('Save');
    } else {
      
      const breakfastvalue = $('#breakfastSection .active .carousel-caption').text().trim();
      const lunchvalue = $('#lunchSection .active .carousel-caption').text().trim();
      const dinnervalue = $('#dinnerSection .active .carousel-caption').text().trim();

      const date = $('#offcanvasRightLabel').text().trim();

      const breakfastID = $('#breakfastSection .active .carousel-caption .view-recipe-btn').attr('data-id');
      const lunchID = $('#lunchSection .active .carousel-caption .view-recipe-btn').attr('data-id');
      const dinnerID = $('#dinnerSection .active .carousel-caption .view-recipe-btn').attr('data-id');

      if(breakfastvalue != "No Recipe Selected for this Meal" && ( lunchvalue != "No Recipe Selected for this Meal" && lunchvalue != "") && dinnervalue != "No Recipe Selected for this Meal") {
        $.ajax({
          type: 'POST',
          url: "./database/add_meal_plan.php",
          data: {
            breakfast: breakfastID,
            lunch: lunchID,
            dinner: dinnerID,
            date: date
          },
          success: function (response) {
            if(response == "Updated") {
              swalWithBootstrapButtons.fire({
                title: "Success!",
                text: "Meal Plan Updated!",
                icon: "success"
              });
              populateCalendar();
            }
            editingEnabled = true;
            $('.section-overlay').show('slow');
            $('#editButton').text('Edit');
          },
          error: function (error) {
            console.error('Error saving meal plan:', error);
          }
        });
      }else {
        swalWithBootstrapButtons.fire({
          title: "Warning!",
          text: "Please select recipes for all Meals!",
          icon: "warning"
        });
      }
    }
  };

  let iseditButtonAttach = false;
  let isfc_event_mainAttach = false;
  let isview_recipe_btnAttach = false;
  let isfc_daygrid_dayAttach = false;
  let issave_favorite_recipe_btnAttach = false;

const Planner = async () => {
    const recommendedContent = await getFavoriteRecipes();
    const user = await getFavoriteSessionInfo();
        

    $(document).ready(function() {
      populateCalendar();
        const today = new Date();
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = today.toLocaleDateString('en-US', options);
        $('.date-to-plan').attr('aria-label', formattedDate).text(`Date: ${formattedDate}`);

        document.querySelectorAll('.view-favorite-recipe-btn').forEach((button) => {
          button.addEventListener('click', (event) => {
            const recipeId = event.currentTarget.getAttribute('data-id') || event.currentTarget.closest('.fc-content').dataset.id;
            const recipe = filteredRecipes.find(recipe => recipe.id === recipeId);
            openFavoriteModal(recipe);
          });
        });

        if (!iseditButtonAttach) {
          $('.offcanvas').off('click').on('click', '#editButton', function(event) {
            event.stopPropagation()
            toggleEditMode();
          })
          iseditButtonAttach = true;
        }
    
        if (!isfc_event_mainAttach) {
          $('#calendar').on('click', '.fc-event-main',async function(event) {
            event.stopPropagation();
            if(isModalOpen) {
              $('#recipeModal').modal('hide');
            }
            const recipeId = $(this).children('.fc-content').attr('data-id');
            const recipes = await getFavoriteRecipes();
            const recipe = filteredRecipes.find(recipe => recipe.id === recipeId);
            openFavoriteModal(recipe);
          });
          isfc_event_mainAttach = true;
        }
    
        if (!isview_recipe_btnAttach) {
          $(document).off('click').on('click', '.view-recipe-btn',async function(event) {
            event.stopPropagation();
            if(isModalOpen) {
              $('#recipeModal').modal('hide');
            }
            const recipeId = $(this).attr('data-id');
            const recipes = await getFavoriteRecipes();
            const recipe = filteredRecipes.find(recipe => recipe.id === recipeId);
            openFavoriteModal(recipe);
          })
          isview_recipe_btnAttach = true;
        }
    
        if (!isfc_daygrid_dayAttach) {
          $(document).off('click').on('click', '.fc-daygrid-day',async function(event) {
            const datePlanner = $(this).find('.fc-daygrid-day-number').attr('aria-label');
            $('.date-to-plan').attr('aria-label', datePlanner).text(`Date: ${datePlanner}`);
            try {
              const recipes = await fetchFavorites();
    
              const breakfastRecipes = recipes;
              const lunchRecipes = recipes;
              const dinnerRecipes = recipes;
              
              const breakfastCarousel = await createCarouselHTML(breakfastRecipes,'breakfast', datePlanner, user.id);
    
              const lunchCarousel = await createCarouselHTML(lunchRecipes,'lunch', datePlanner, user.id);
              
              const dinnerCarousel = await createCarouselHTML(dinnerRecipes,'dinner', datePlanner, user.id);
    
              const offcanvasContent = `
              <div class="offcanvas-header">
                  <h5 id="offcanvasRightLabel">${datePlanner}</h6>
                  <button id="editButton" type="button" class="btn btn-success">Edit</button>
                  <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
              </div>
              <div class="offcanvas-body">
                <div class="row mb-3">
                  <div class="col">
                    <h6>Breakfast</h6>
                      <div id="breakfastSection">
                      </div>
                  </div>
                </div>
                <div class="row mb-3">
                  <div class="col">
                    <h6>Lunch</h6>
                      <div id="lunchSection">
                      </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <h6>Dinner</h6>
                      <div id="dinnerSection">
                      </div>
                  </div>
                </div>
                <div class="section-overlay position-absolute top-20 start-0 w-100 h-100" style="background-color: rgba(0, 0, 0, 0.5);"></div>
              </div>
            `;
    
            $('#offcanvasRight').html(offcanvasContent);
            $('#breakfastSection').html(breakfastCarousel);
            $('#lunchSection').html(lunchCarousel);
            $('#dinnerSection').html(dinnerCarousel);
    
            const bsOffcanvas = new bootstrap.Offcanvas('#offcanvasRight')
            bsOffcanvas.toggle();
    
            } catch (error) {
              console.error('Error fetching recipes:', error);
            }
    
         });
          isfc_daygrid_dayAttach = true;
        }
    
        if (!issave_favorite_recipe_btnAttach) {
          $(document).on('click', '.save-favorite-recipe-btn', async function() {
            const recipeId = $(this).data('id');
            const savedRecipes = await fetchFavorites();
            const isRecipeSaved = savedRecipes.some(savedRecipe => {
              return savedRecipe.recipe_id == recipeId && savedRecipe.user_id == user.id;
            });
            if (isRecipeSaved) {
              const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: "btn btn-success",
                  cancelButton: "btn btn-danger"
                },
                buttonsStyling: false
              });
              swalWithBootstrapButtons.fire({
                title: "Are you sure?",
                text: "This recipe seems fine!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, Unsave!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true
              }).then(async (result) => {
                if (result.isConfirmed) {
                  await unsaveFavorites(recipeId);
                  $(this).html('<i class="fas fa-bookmark"></i>');
                  swalWithBootstrapButtons.fire({
                    title: "Unsaved!",
                    text: "Removed this recipe in your favorites.",
                    icon: "success"
                  });
                } else if (
                  result.dismiss === Swal.DismissReason.cancel
                ) {
                  swalWithBootstrapButtons.fire({
                    title: "Cancelled",
                    text: "This recipe is still part of your favorites",
                    icon: "error"
                  });
                }
              });
            } else {              
                await saveFavorites(recipeId);
                $(this).html('<i class="fa-regular fa-square-minus"></i>');
            }
          });
          issave_favorite_recipe_btnAttach = true;
        }

    });

    const plannerHTML = `
            <h5>Calendar</h5>
            <div id="calendar">
            </div>
            <div class="modal fade" id="recipeModal" tabindex="-1" aria-labelledby="recipeModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="modalTitle"></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body" id="modalBody">
                  </div>
                </div>
              </div>
            </div>
    `;

    return plannerHTML;
};

export default Planner;
