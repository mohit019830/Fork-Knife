let allMeals=[]
let recipe_list = document.querySelector(".straight_caraousel")

let renderData=(meals)=>{
    recipe_list.innerHTML=""

    if(meals.length===0){
        recipe_list.innerHTML = `
            <div class="no-results">
                No matching recipes found
            </div>
        `
        return
    }

    meals.forEach((meal)=>{
        recipe_list.innerHTML+=`
        <div class="recipe-card">
    
            <div class="recipe-image">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            </div>
    
            <div class="recipe-content">
                <p class="cuisine">${meal.strCategory}</p>
    
                <h3>${meal.strMeal}</h3>
    
                <div class="recipe-det">
                    <button class="view-btn" data-id="${meal.idMeal}">View →</button>
                </div>
            </div>
    
        </div>
        `
    })
}


let loader = document.getElementById("loader")
loader.style.display="flex"
let letters="abcdefghijklmnopqrstuvwxyz"

let promises=letters.split("").map(letter=>{
    return fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
        .then(res=>res.json())
})

Promise.all(promises).then(results=>{
    results.forEach(data=>{
        if(data.meals){
            data.meals.forEach(meal=>{
                allMeals.push(meal)
            })
        }
    })
    loader.style.display="none"

    renderData(allMeals)
    console.log(allMeals)

})

// Filter Buttons handling

let filters=document.querySelectorAll(".filter-btn")

filters.forEach(btn=>{
    btn.addEventListener("click", function(){

        filters.forEach(filter=>filter.classList.remove("active"))
        this.classList.add("active")
        let category=this.innerHTML;

        if(category==="All"){
            renderData(allMeals)
        }else{
            let filteredMeals=allMeals.filter(meal =>{
                return meal.strCategory===category
            })
            renderData(filteredMeals)
        }

    })

})


// Popup Handling
let popup = document.getElementById("recipe-popup")
let closeBtn = document.querySelector(".close-btn")

document.addEventListener("click", function(e){

    if(e.target.classList.contains("view-btn")){

        let id=e.target.dataset.id

        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(res=>res.json())
        .then(data=>{
            let meal = data.meals[0]
            document.getElementById("popup-title").innerText = meal.strMeal
            document.getElementById("popup-img").src = meal.strMealThumb
            document.getElementById("popup-instructions").innerText = meal.strInstructions
            document.getElementById("popup-yt").href = meal.strYoutube

            let ingredientsList = document.getElementById("popup-ingredients")
            ingredientsList.innerHTML = ""

            for(let i=1;i<=20;i++){

                let ingredient=meal[`strIngredient${i}`]
                let measure=meal[`strMeasure${i}`]

                if(ingredient && ingredient.trim()!=""){
                    let li = document.createElement("li")
                    li.innerText=`${ingredient}-${measure}`
                    ingredientsList.appendChild(li)
                }
            }

            popup.style.display="flex"

        })
    }

})
// Close Button
closeBtn.addEventListener("click",()=>{
    popup.style.display="none"
})

window.addEventListener("click",(e)=>{
    if(e.target===popup){
        popup.style.display="none"
    }
})

//Search Handling
let searchInput=document.getElementById("search-bar_input")
let searchBtn=document.querySelector("#search_input button")

searchBtn.addEventListener("click",function(){
    let query=searchInput.value.toLowerCase()

    let filteredMeals=allMeals.filter(meal=>{
        return meal.strMeal.toLowerCase().includes(query)
    })
    renderData(filteredMeals)

})

