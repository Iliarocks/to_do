const firebaseConfig = {
  apiKey: "AIzaSyDX1HIJ-MrVHpfUwn6yXPytD4Hgt_pDtvY",
  authDomain: "to-do-list-a3aaf.firebaseapp.com",
  databaseURL: "https://to-do-list-a3aaf.firebaseio.com",
  projectId: "to-do-list-a3aaf",
  storageBucket: "to-do-list-a3aaf.appspot.com",
  messagingSenderId: "728937903391",
  appId: "1:728937903391:web:3f4b5cb1aecd54c738ac2a",
  measurementId: "G-SJ75SMSVCF"
};
firebase.initializeApp(firebaseConfig);
var database = firebase.database()
var auth = firebase.auth()
var loginPage = document.querySelector('.login')
var nameIn = document.getElementById('name-input')
var emailIn = document.getElementById('email-input')
var passIn = document.getElementById('password-input')
var signUpBtn = document.getElementById('sign-up')
var signInBtn = document.getElementById('sign-in')
var logOutBtn = document.getElementById('logout')
var changedLogIn = document.getElementById('change-link')
var logedIn = document.querySelector('.body')
var logedOut = document.querySelector('.login')
var profile = document.querySelector('.profile')
var folderHolder = document.querySelector('.folder-exists')
var addFolderCircle = document.querySelector('.add-folder')
var addFolderLink = document.getElementById('create-folder-link')
var createFolderBtn = document.getElementById('create-folder-btn')
var folderNameIn = document.getElementById('folder-name-input')
var circleOpenFolder = document.getElementById('add-circle')
var linkOpenFolder = document.getElementById('create-folder-link')
var folderPopUp = document.querySelector('.create-folder')
var listPopUp = document.querySelector('.create-list')
var closeFolderPopUp = document.getElementById('close-icon')
var closeListPopUp = document.getElementById('close-icon-list')
var listTitle = document.getElementById('folder-title')
var listHolder = document.getElementById('to-do-items-holder')
var addListItem = document.getElementById('add-list-item')
var createListItem = document.getElementById('create-list-btn')
var listNameIn = document.getElementById('list-name-input')
var items = []
var folderNames = []
let userName;
//sign up
signUpBtn.addEventListener('click', function(){
  var email = emailIn.value;
  var pass = passIn.value;
  var name = nameIn.value;
  if (name === '') {
    window.alert('Please insert a name before signing up')
    return
  }
  database.ref(`/${email.split('@')[0]}/info`).set({name: name})
  var promise = auth.createUserWithEmailAndPassword(email, pass)
  promise.catch(e => window.alert(e))
})

//sign in
signInBtn.addEventListener('click', function(){
  var email = emailIn.value;
  var pass = passIn.value;
  var promise = auth.signInWithEmailAndPassword(email, pass)
  promise.catch(e => window.alert(e))
})

//logOutBtn
logOutBtn.addEventListener('click', function(){
  auth.signOut()
})

//change from login to sign up or vise-versa
changedLogIn.addEventListener('click', function(e){
  let link = e.target
  let nameLabel = document.getElementById('name-label')
  if(link.innerText === 'Sign in?'){
    signInBtn.style.display = 'inline-block'
    signUpBtn.style.display = 'none'
    nameLabel.style.display = 'none'
    nameIn.style.display = 'none'
    link.innerText = 'Sign up?'
  }else{
    signUpBtn.style.display = 'inline-block'
    nameLabel.style.display = 'block'
    signInBtn.style.display = 'none'
    nameIn.style.display = 'block'
    link.innerText = 'Sign in?'
  }
})

//get name from database
var getName = email => {
  database.ref(`/${email.split('@')[0]}/info/name`).once('value').then(function(snap){
    document.querySelector('.profile > h3').innerText = snap.val()
  })
}

//adds event to open folder to each folder
var openFolderEvent = () => {
  folderNames.forEach(folder => {
    document.getElementById(`${folder.split(' ').join('-')}-folder`).addEventListener('click', function(){
      openFolder(folder)
    })
  })
}

//gets list items from database
var openFolder = (folder) => {
  listTitle.innerText = folder;
  database.ref(`/${auth.currentUser.email.split('@')[0]}/folders/${folder}/list`).on('value', function(snap){
    listHolder.innerHTML = '';
    if (!snap.val()) return
    var listItems = Object.keys(snap.val())
    var newHtml = '';
    var newItems = []
    listItems.forEach(item => {
      newHtml += `<li class="list-item" id=${folder.split(' ').join('-')}-${item.split(' ').join('-')}><img src="close.png" class="delete-list-item" id="${item.split(' ').join('-')}-delete">${item}</li>`
      newItems.push(item)
      //console.log(newItems)
    })
    listHolder.innerHTML += newHtml
    items = newItems
    console.log(items)
    deleteItemEvent()
  })
}

//delete item
var deleteItemEvent = () => {
  let folder = listTitle.innerText
  items.forEach(item => {
    document.getElementById(`${item.split(' ').join('-')}-delete`).addEventListener('click', function(e){
      database.ref(`/${auth.currentUser.email.split('@')[0]}/folders/${folder}/list/${item}`).remove()
      e.target.parentElement.style.display = 'none'
    })
  })
}

//get folders from database
var getFolders = email => {
  database.ref(`/${email.split('@')[0]}/folders`).on('value', function(snap){
    if (!snap.val()) {
      addFolderCircle.style.display = 'block'
      addFolderLink.style.display = 'none'
      return
    }else{
      folderHolder.innerHTML = ''
      folderNames = Object.keys(snap.val())
      let newHtml = '';
      folderNames.forEach(folder => {
        newHtml += `<div class="folder" id="${folder.split(' ').join('-')}-folder">${folder}</div><img src="close.png" id="delete-${folder.split(' ').join('-')}" class="delete-folder">`
      })
      folderHolder.innerHTML = newHtml
      addFolderLink.style.display = 'block'
      addFolderCircle.style.display = 'none'
      deleteFolderEvent()
      openFolderEvent()
    }
  })
}

var deleteFolderEvent = () => {
  folderNames.forEach(folder => {
    document.getElementById(`delete-${folder.split(' ').join('-')}`).addEventListener('click', function(event){
      database.ref(`/${auth.currentUser.email.split('@')[0]}/folders/${folder}`).remove()
      document.getElementById(`${folder.split(' ').join('-')}-folder`).style.display = 'none'
      event.target.style.display = 'none'
      if (listTitle.innerText === folder) {
        listTitle.innerText = ''
        folderHolder.innerHTML = ''
      }
      getFolders()
    })
  })
}

//add folder to database
var addFolder = folderName => {
  database.ref(`/${auth.currentUser.email.split('@')[0]}/folders/${folderName}`).set({folderName})
  getFolders(auth.currentUser.email)
}

//add item to database
var addItem = (folder, itemName) => {
  database.ref(`/${auth.currentUser.email.split('@')[0]}/folders/${folder}/list/${itemName}`).set({item: itemName})
}

// do something if user is signed in
auth.onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    logOutBtn.style.display = 'inline-block'
    profile.style.display = 'inline-block '
    logedIn.style.display = 'block'
    logedOut.style.display = 'none'
    let email = auth.currentUser.email
    getName(email)
    getFolders(email)
  }else{
    logOutBtn.style.display = 'none'
    logedOut.style.display = 'block'
    logedIn.style.display = 'none'
    profile.style.display = 'none'
    listTitle.innerText = ''
    listHolder.innerHTML = ''
    nameIn.value = ''
    emailIn.value = ''
    passIn.value = ''
  }
})

addListItem.addEventListener('click', function(){
  if (listTitle.innerText === '') return
  listPopUp.style.display = 'block'
})

//closes create folder pop-up
closeFolderPopUp.addEventListener('click', function(e){
  folderPopUp.style.display = 'none'
})

//closes create item pop-up
closeListPopUp.addEventListener('click', function(e){
  listPopUp.style.display = 'none'
})

//circle that open create-folder pop up
circleOpenFolder.addEventListener('click', function(e){
  folderPopUp.style.display = 'block'
})

//same thing as the circle just different format
linkOpenFolder.addEventListener('click', function(e){
  folderPopUp.style.display = 'block'
})

//adds a folder to the database
createFolderBtn.addEventListener('click', function(e){
  folderPopUp.style.display = 'none'
  addFolder(folderNameIn.value)
  folderNameIn.value = ''
})

//creates a list item
createListItem.addEventListener('click', function(e){
  addItem(listTitle.innerText, listNameIn.value)
  listNameIn.value = ''
  listPopUp.style.display = 'none'
})
console.log('hello world!')
