// Функціонал перемикача списку додатків в правій панелі
/*
$(function(){
    $('.toggle').toggle({
      drag: false,
      text:{
        on:"YES",
        off:"NO"
      },
      checkbox:$('#sort-app__c-button-check'),
      width: 90,
      height: 30
});
});
*/

function filterApp() {
  // Declare variables
  var input, filter, ul, li, a, currLi, i, txtValue;
  input = document.getElementById('search-app');
  filter = input.value.toUpperCase();
  ul = document.getElementById("app-tree");
  li = ul.getElementsByTagName('li');

  // Return all search state to default
  let jsUL = ul.querySelectorAll('.jsl-collapsed');
  //console.log(jsUL);

  let jsSelector = ul.querySelectorAll('.jsl-list-closed');

  


  //console.log(filter);

  if(filter === '') {
    /*if(li) {
        li.forEach((liEl) => {
          liEl.style.display = "";
        });
    }*/
    console.log(li);
    for (let item of li) {
      //console.log(item);
      item.classList.remove('active');
      item.style.display = "";
    }
    
    jsUL.forEach((element) => {
      element.classList.remove("jsl-open");
      element.style.color = 'blue';
    });
    jsSelector.forEach((el) => {
      el.classList.remove('jsl-list-open');
    });
  }
  

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    currLi = li[i];
    //a = li[i].getElementsByTagName("a")[0];
    txtValue = currLi.textContent || currLi.innerText;
    

    if(filter.length > 2) {

      //console.log(txtValue.toUpperCase().indexOf(filter[i]));
    
    if (txtValue.toUpperCase().indexOf(filter) <= -1 && !li[i].classList.contains('active')) {
      //li[i].classList.remove('active');
      
      console.log(li[i]);
      
      if(li[i].classList.contains('active')) {
        console.log('TOOOOOOOO');
        //li[i].style.display = "";
        for (const sbm of li[i].children) {
          sbm.style.display = "";
          console.log(sbm);
          
        }
      } else {
        li[i].style.display = "none";
        li[i].style.color = "red";
      }
      
      
      
      /*for (const parent of currLi.parentElement) {
        if(parent.classList.contains('jslist-ul')) {
          parent.classList.add('jsl-open');
        }
      }*/


      /*while(currLi.parentNode && currLi.parentNode.classList.contains('jsl-list-closed')) {
        //currLi.parentNode.classList.add('jsl-list-open');
        console.log(currLi.parentNode);
      }*/

      //console.log(currLi.closest('.jsl-list-closed'));

    } /*else if(currLi.parentNode.classList.contains('jsl-open')) {
      currLi.style.display = "block";
      currLi.style.color = "green";
    } */else {
      
      
      //console.log(currLi);
      //while ((el = el.parentElement) && !el.classList.contains('jsl-list-closed'));
      //let innerUlEl = currLi.querySelector('ul');
      //innerUlEl.style.display = "block";

      //let allChildli = currLi.querySelectorAll('li');
      //console.log(allChildli);

        for (const child of li[i].children) {
          //console.log(child);
          //child.style.display = "";
          if(child.classList.contains('jslist-ul')) {
            li[i].classList.add('active');
            li[i].style.display = "";
            //console.log(child);
            child.classList.add('jsl-open');
           // console.log(child.lastChild.parentElement);
            /*for(const subchild of child.children) {
              console.log(subchild);
              subchild.style.display = "block !important";
            }*/
          }
        
          if(child.classList.contains('jsl-list-closed')) {
            child.classList.add('jsl-list-open');
          }
        }
      
    }
  }
  }
}
