   {
     setTimeout(window.onscroll = function(){
      if(window.scrollY > 20){
      pageTabsNavbar.classList.add('sticky')
      }else{
      pageTabsNavbar.classList.remove('sticky')
      }
    },200)
    
}