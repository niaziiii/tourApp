export const alertMsg = (status,msg) =>{
    const body = document.querySelector("body")

    const htmlMsg = `<div class= "alertMsg login-${status}"> <h1>${msg}</h1> </div>`
    body.insertAdjacentHTML('afterbegin', htmlMsg);

    setTimeout(() => {
       const el = document.querySelector('.alertMsg')
       el.style.display = 'none'
    }, 1500);
}