// Storage Controller

const StorageCtrl = (() => {
    return {
        storeItem: (item) => {
            let items
            if (localStorage.getItem('items') === null) {
                items = []
                items.push(item)
                localStorage.setItem('items', JSON.stringify(items))
            } else {
                items = JSON.parse(localStorage.getItem('items'))
                items.push(item)
                localStorage.setItem('items', JSON.stringify(items))
            }
        },

        getItemsFromStorage: () => {
            let items
            if (localStorage.getItem('items') === null) {
                items = []
            } else {
                items = JSON.parse(localStorage.getItem('items'))
            }
            return items
        },

        updateItemStorage: (updatedItem) => {
            let items = JSON.parse(localStorage.getItem('items'))

            items.forEach((item, index) => {
                if (item.id === updatedItem.id) {
                    items.splice(index, 1, updatedItem)
                }
                localStorage.setItem('items', JSON.stringify(items))
            })
        },

        deleteItemFromStorage: (id) => {
            let items = JSON.parse(localStorage.getItem('items'))

            items.forEach((item, index) => {
                if (item.id === id) {
                    items.splice(index, 1)
                }
                localStorage.setItem('items', JSON.stringify(items))
            })
        },

        clearItemsFromStorage: () => {
            localStorage.clear('items')
        }
    }
})()

// Item Controller

const ItemCtrl = (function () {

    const Item = function (id, name, calories) {
        this.id = id
        this.name = name
        this.calories = calories
    }

    const data = {
        // items: [
        // { id: 1, name: "Dosai", calories: 120 },
        // { id: 2, name: "Vadai", calories: 97 },
        // { id: 3, name: "Sambar", calories: 114 }
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    return {
        addItem: (name, calories) => {
            let ID
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1
            } else {
                ID = 0
            }
            calories = parseInt(calories)
            const newItem = new Item(ID, name, calories)
            data.items.push(newItem)

            return newItem
        },
        getItems: () => {
            return data.items
        },
        getItemById: (id) => {
            let found = null
            data.items.forEach((item) => {
                if (item.id === id) {
                    found = item
                }
            })
            return found
        },
        setCurrentItem: (item) => {
            data.currentItem = item
        },

        getCurrentItem: () => {
            return data.currentItem
        },
        updateItem: (name, calories) => {
            calories = parseInt(calories)

            let found = null

            data.items.forEach((item) => {
                if (item.id === data.currentItem.id) {
                    item.name = name
                    item.calories = calories
                    found = item
                }
            })
            return found
        },
        deleteItem: (id) => {
            const ids = data.items.map((item) => {
                return item.id
            })

            const index = ids.indexOf(id)
            data.items.splice(index, 1)
        },
        clearAllItems: () => {
            data.items = []
        },
        getTotalCalories: () => {
            let total = 0
            data.items.forEach((item) => {
                total += item.calories
            })
            data.totalCalories = total
            return data.totalCalories
        },
        logData: function () {
            return data
        }
    }

})()

// UI Controller
const UICtrl = (function () {

    const UISelectors = {
        itemList: '#item-list',
        listItem: 'li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    return {

        populateItemList: (items) => {
            let html = ''
            items.forEach((item) => {
                html += `
                 <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pen"></i></a>
            </li>
                `
            })

            document.querySelector(UISelectors.itemList).innerHTML = html
        },
        getItemInput: () => {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: (item) => {
            document.querySelector(UISelectors.itemList).style.display = 'block'
            const li = document.createElement('li')
            li.className = 'collection-item'
            li.id = `item-${item.id}`
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pen"></i></a>`
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        updateListItem: (item) => {
            let listItems = document.querySelectorAll(UISelectors.listItem)
            listItems = Array.from(listItems)

            listItems.forEach((listItem) => {
                const itemId = listItem.getAttribute('id')
                if (itemId === `item-${item.id}`) {
                    document.querySelector(`#${itemId}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content"><i class="edit-item fa fa-pen"></i></a>`
                }
            })
        },
        deleteListItem: (id) => {
            const itemId = `#item-${id}`
            let item = document.querySelector(itemId)
            item.remove()
        },
        addItemToForm: () => {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories
            UICtrl.showEditState()
        },
        removeItems: () => {
            let listItems = document.querySelectorAll(UISelectors.listItem)

            listItems = Array.from(listItems)

            listItems.forEach((item) => {
                item.remove()
            })
        },
        showTotalCalories: (totalCalories) => {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories
        },
        clearInput: () => {
            document.querySelector(UISelectors.itemNameInput).value = ''
            document.querySelector(UISelectors.itemCaloriesInput).value = ''
        },
        clearEditState: () => {
            UICtrl.clearInput()
            document.querySelector(UISelectors.updateBtn).style.display = 'none'
            document.querySelector(UISelectors.deleteBtn).style.display = 'none'
            document.querySelector(UISelectors.backBtn).style.display = 'none'
            document.querySelector(UISelectors.addBtn).style.display = 'inline'
        },
        showEditState: () => {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline'
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline'
            document.querySelector(UISelectors.backBtn).style.display = 'inline'
            document.querySelector(UISelectors.addBtn).style.display = 'none'
        },
        hideList: () => {
            document.querySelector(UISelectors.itemList).style.display = 'none'
        },
        getSelectors: () => {
            return UISelectors
        }

    }

})()

// App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {

    const UISelectors = UICtrl.getSelectors()

    const loadEventListeners = () => {
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)

        document.addEventListener('keypress', (e) => {
            // keycode for enter key is 13; e.which is used for old browsers that don't support keycode
            if (e.keyCode == 13 || e.which == 13) {
                e.preventDefault()
                return false
            }
        })

        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick)

        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit)

        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState)

        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit)

        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick)
    }

    const itemAddSubmit = (e) => {

        const input = UICtrl.getItemInput()

        if (input.name !== '' && input.calories !== '') {
            const newItem = ItemCtrl.addItem(input.name, input.calories)

            UICtrl.addListItem(newItem)

            StorageCtrl.storeItem(newItem)

            const totalCalories = ItemCtrl.getTotalCalories()
            UICtrl.showTotalCalories(totalCalories)

            UICtrl.clearInput()
        }


        e.preventDefault()
    }

    const itemEditClick = (e) => {

        if (e.target.classList.contains('edit-item')) {

            const listId = e.target.parentNode.parentNode.id

            const listIdArr = listId.split('-')

            const id = parseInt(listIdArr[1])

            const itemToEdit = ItemCtrl.getItemById(id)

            ItemCtrl.setCurrentItem(itemToEdit)

            UICtrl.addItemToForm()

        }


        e.preventDefault()
    }

    const itemUpdateSubmit = (e) => {

        const input = UICtrl.getItemInput()

        const updatedItem = ItemCtrl.updateItem(input.name, input.calories)

        UICtrl.updateListItem(updatedItem)

        const totalCalories = ItemCtrl.getTotalCalories()

        UICtrl.showTotalCalories(totalCalories)

        StorageCtrl.updateItemStorage(updatedItem)

        UICtrl.clearEditState()

        e.preventDefault()
    }

    const itemDeleteSubmit = (e) => {

        const currentItem = ItemCtrl.getCurrentItem()

        ItemCtrl.deleteItem(currentItem.id)

        UICtrl.deleteListItem(currentItem.id)

        const totalCalories = ItemCtrl.getTotalCalories()

        UICtrl.showTotalCalories(totalCalories)

        StorageCtrl.deleteItemFromStorage(currentItem.id)

        UICtrl.clearEditState()

        e.preventDefault()
    }

    const clearAllItemsClick = (e) => {
        ItemCtrl.clearAllItems()

        const totalCalories = ItemCtrl.getTotalCalories()

        UICtrl.showTotalCalories(totalCalories)

        UICtrl.removeItems()

        StorageCtrl.clearItemsFromStorage()

        UICtrl.hideList()
        e.preventDefault()
    }

    return {
        init: () => {

            UICtrl.clearEditState()

            const items = ItemCtrl.getItems()
            
            const totalCalories = ItemCtrl.getTotalCalories()
            UICtrl.showTotalCalories(totalCalories)

            if (items.length == 0) {
                UICtrl.hideList()
            } else {
                UICtrl.populateItemList(items)
            }

            loadEventListeners()

        }
    }


})(ItemCtrl, StorageCtrl, UICtrl)

App.init()