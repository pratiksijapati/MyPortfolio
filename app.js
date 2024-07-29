document.addEventListener('DOMContentLoaded', function () {
        const navbarLinks = document.querySelectorAll('.navbar ul li a');
        const seemorebtn = document.getElementById("seemore");
        const seelessbtn = document.getElementById("seeless");
        const seembtn = document.getElementById("seem");
        const seelbtn = document.getElementById("seel");
        const hiddenboxes = document.querySelectorAll(".pbox.hidden");
        const hibox = document.querySelectorAll(".box.hidden");
        const collegeheading = document.getElementById("college-project-heading");
        const personalheading = document.getElementById("personal-project-heading");
        const education = document.getElementById("education");
        const skill = document.getElementById("skill");
        const projectbox = document.getElementById("project-box");
        const aboutbox = document.getElementById("ecperience");
        let currentIndex = 0;
        function adjustprojectboxheight() {
          if (hiddenboxes.length > 0) {
            let totalheight = 0;
            hiddenboxes.forEach((box) => {
              totalheight += box.offsetHeight;
            });
            projectbox.style.height = `${totalheight + 200}px`;
          }
        }
        function adjustaboutboxheight() {
          if (hibox.length > 0) {
            let totalheight = 0;
            hibox.forEach((box) => {
              totalheight += box.offsetHeight;
            });
            aboutbox.style.height = `${totalheight + 200}px`;
          }
        }
        // Smooth scroll for navigation links
        navbarLinks.forEach(link => {
          link.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
              behavior: 'smooth'
            });
          });
        });
        //see more
        seemorebtn.addEventListener("click", function () {
          hiddenboxes.forEach((box) => {
            box.classList.remove("hidden");
          });
          collegeheading.classList.remove("hidden");
          seemorebtn.classList.add("hidden");
          seelessbtn.classList.remove("hidden");
        });
        //see less
        seelessbtn.addEventListener("click", function () {
          hiddenboxes.forEach((box) => {
            box.classList.add("hidden");
          });
          collegeheading.classList.add("hidden");
          seemorebtn.classList.remove("hidden");
          seelessbtn.classList.add("hidden");

        })
        //see m
        seembtn.addEventListener("click", function () {
          hibox.forEach((box) => {
            box.classList.remove("hidden");
          });
          skill.classList.remove("hidden");
          seembtn.classList.add("hidden");
          seelbtn.classList.remove("hidden");
        });
        //see l
        seelbtn.addEventListener("click", function () {
          hibox.forEach((box) => {
            box.classList.add("hidden");
          });
          skill.classList.add("hidden");
          seembtn.classList.remove("hidden");
          seelbtn.classList.add("hidden");

        });
      
      });
  

    //Setup and start animation!

      var typed = new Typed('#element', {
        strings: ['Student', 'Web designer', 'Frontend Developer'],
        typeSpeed: 50,
        loop:true
      });
