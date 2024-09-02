let sortByView = false
let lastSelectedCategoryId
let isLastRenderedCategoryItemsSorted

const categoryHandler = async () => {
    const response = await fetch('https://openapi.programming-hero.com/api/videos/categories')
    const json = await response.json()
    const categoryDatas = json.data
    
    const categoryButtonsContainer = document.getElementById('category-buttons-container')
    const categoryButtons = categoryDatas.map(categoryData => `<button id="${categoryData.category_id}" class="text-lg font-medium rounded-[4px] px-5 py-[5px] duration-300 hover:-translate-y-1 hover:shadow-md active:translate-y-[-2px] active:shadow-sm text-3770 bg-gray3715" onclick="selectCategory('${categoryData.category_id}')">${categoryData.category}</button>`)
    categoryButtonsContainer.innerHTML = categoryButtons.join('')

    return categoryDatas[0].category_id
}

const styleCategoryButtons = categoryId => {
    const grayStyle = ['text-3770', 'bg-gray3715', 'font-medium']
    const redStyle = ['text-white', 'bg-red3d', 'font-semibold']

    if(lastSelectedCategoryId) {
        const lastSelectedCategoryButton = document.getElementById(lastSelectedCategoryId)
        lastSelectedCategoryButton.classList.remove(...redStyle)
        lastSelectedCategoryButton.classList.add(...grayStyle)
    }

    const selectedCategoryButton = document.getElementById(categoryId)
    selectedCategoryButton.classList.remove(...grayStyle)
    selectedCategoryButton.classList.add(...redStyle)
}

const formatTime = seconds => {
    const hours = Math.floor(seconds / 3600)
    const min_seconds = seconds % 3600
    const minutes = Math.floor(min_seconds / 60)

    return `${hours}hrs ${minutes} min ago`
}

const styleSortByViewButton = (isDisabled=false) => {
    const sortByViewButtton = document.getElementById('sort-by-view-button')
    
    const grayStyle = ['text-dark25', 'bg-gray3720', 'font-medium']
    const redStyle = ['text-white', 'bg-red3d', 'font-semibold']
    
    if(sortByView && !isDisabled) {
        sortByViewButtton.classList.remove(...grayStyle)
        sortByViewButtton.classList.add(...redStyle)
    } else {
        sortByViewButtton.classList.remove(...redStyle)
        sortByViewButtton.classList.add(...grayStyle)
    }
}

const disableSortByViewButton = (disable=true) => {
    const sortByViewButtton = document.querySelector('#sort-by-view-button')

    if(disable) {
        sortByViewButtton.setAttribute('disabled', true)
        // sortByViewButtton.classList.add('disabled:opacity-25')
        sortByViewButtton.classList.remove('hover:-translate-y-1', 'hover:shadow-md', 'active:translate-y-[-2px]', 'active:shadow-sm')
        styleSortByViewButton(true)
    } else {
        sortByViewButtton.removeAttribute('disabled')
        // sortByViewButtton.classList.remove('disabled:opacity-25')
        sortByViewButtton.classList.add('hover:-translate-y-1', 'hover:shadow-md', 'active:translate-y-[-2px]', 'active:shadow-sm')
        styleSortByViewButton()
    }
}

const renderCategoryItems = async categoryId => {
    const response = await fetch('https://openapi.programming-hero.com/api/videos/category/' + categoryId)
    const json = await response.json()
    const categoryItems = json.data

    const categoryItemsContainer = document.getElementById('category-items-container')
    categoryItemsContainer.innerHTML = ''

    if(categoryItems.length === 0) {
        disableSortByViewButton()
        categoryItemsContainer.innerHTML = `
            <div class="text-center mt-[50px] lg:mt-[150px]">
                <img class="mx-auto h-[140px] mb-8" src="./images/novideo.svg" alt="No Video">
                <p class="text-dark17 font-bold text-[32px] leading-[40px]">Oops!! Sorry, There is no<br> content here</p>
            </div>
        `
    } else {
        disableSortByViewButton(false)
        if(sortByView) {
            categoryItems.sort((a, b) => {
                const viewA = parseFloat(a.others.views.slice(0, -1))
                const viewB = parseFloat(b.others.views.slice(0, -1))
                return viewB - viewA
            })
        }

        const items = categoryItems.map(item => {
            return `<div class="flex flex-col max-w-[312px] hover:-translate-y-2 duration-300">
                        <div class="relative">
                            ${item.others.posted_date === "" ? "" :`<span class="absolute bg-dark17 px-[5px] py-[4px] rounded text-white text-[10px] right-3 bottom-3">${formatTime(parseInt(item.others.posted_date))}</span>`}
                            <img class="h-[200px] w-[312px] rounded-lg" src="${item.thumbnail}" alt="thumbnail">
                        </div>
                        <div class="flex gap-3 mt-5">
                            <img class="h-[40px] w-[40px] rounded-[40px]" src="${item.authors[0].profile_picture}" alt="Profile Picture of ${item.authors[0].profile_name}">
                            <div>
                                <h1 class="text-[dark17] text-base font-bold leading-6">${item.title}</h1>
                                <div>
                                    <span class="text-gray2370 text-sm font-normal">${item.authors[0].profile_name}</span>
                                    ${item.authors[0].verified == true ? `<img class="inline" src="./images/tick.svg" alt="Blue Tick">` : ''}
                                </div>
                                <span class="text-gray2370 text-sm font-normal">${item.others.views} views</span>
                            </div>
                        </div>
                    </div>`
        })


        categoryItemsContainer.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-10 gap-6 justify-items-center">${items.join('')}</div>
        `

        isLastRenderedCategoryItemsSorted = sortByView
    }
}

const selectCategory = async categoryId => {
    if(categoryId !== lastSelectedCategoryId) {
        styleCategoryButtons(categoryId)
    }

    if(isLastRenderedCategoryItemsSorted !== sortByView || categoryId !== lastSelectedCategoryId) {
        renderCategoryItems(categoryId)
    }

    lastSelectedCategoryId = categoryId
}

const sortByViewHandler = () => {
    sortByView = !sortByView
    styleSortByViewButton()

    if(lastSelectedCategoryId) {
        selectCategory(lastSelectedCategoryId)
    }
}

const main = async () => {
    const categoryToBeSelected = await categoryHandler()
    await selectCategory(categoryToBeSelected)
}

main()