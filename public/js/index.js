import '@babel/polyfill'
import { loginUser, logoutUser } from './modules/login.js'
import { profileSettingSave } from './modules/profileSetting.js'
import { book } from './modules/booking.js'
import {openTab} from './modules/opentab.js'

const signUp = () => {
  const form = document.querySelector('#login_form');

  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.querySelector('.loginEmail').value;
    const password = document.querySelector('.loginPassword').value;

    if (!email || !password) return
    loginUser(email, password)
  })
}

const logout = () => {
  const logoutBtn = document.querySelector('.logoutBtn');
  if (!logoutBtn) return;

  logoutBtn.addEventListener('click', logoutUser)
}

const updateProfile = () => {
  const form = document.querySelector('.myaccountform');
  if (!form) return
  form.addEventListener('submit', (e) => {
    e.preventDefault()

    // const name = document.querySelector('.myaccountform__name').value
    // const email = document.querySelector('.myaccountform__email').value

    const form = new FormData()
    form.append('name', document.querySelector('.myaccountform__name').value)
    form.append('email', document.querySelector('.myaccountform__email').value)
    form.append('photo', document.getElementById('myaccountform__photo').files[0])

    // console.log(form);
    profileSettingSave(form, 'data')
  })
}

const bookingTour = () => {
  const btn = document.querySelector('#book_Btn');
  if (!btn) return
  btn.addEventListener('click', () => {
    btn.innerHTML = 'Processing...'
    const id = btn.dataset.id;
    book(id)
  })
}

signUp()
logout()

updateProfile()
bookingTour()
openTab()