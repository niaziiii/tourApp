 export function openTab() {
    let i, tabcontent, tablinks
    tabcontent = document.querySelectorAll('.tabcontent');
    tablinks = document.querySelectorAll('.tablinks');
  
    if (!tabcontent) return;
    if(!document.querySelector('.active')) return;
    
    tabcontent.forEach((el, i) => el.style.display = 'none')
    document.querySelector('.active').style.display = 'block'

    tablinks.forEach((el, i) => {
      el.addEventListener('click', (e) => {
        let target;
        if (e.target.className.includes("tablinks") || e.target.parentElement.className.includes('tablinks'))
          target = e.target.className.includes("tablinks") ? e.target.dataset.targets : e.target.parentElement.dataset.targets
        tabcontent.forEach(el => {
          if (el.id === target) {
            el.style.display = 'block'
            el.classList.add('active')
          } else {
            el.classList.remove('active')
            el.style.display = 'none'
          }
        })
      }
  
      )
    })
  }