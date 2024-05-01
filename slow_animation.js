document.querySelectorAll('.show').forEach(function(link) {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        
        let desc = this.parentElement.nextElementSibling;
        
        if (desc.style.display === 'none') {
            desc.style.display = 'block';
            // Add slide down effect
            desc.style.height = desc.scrollHeight + 'px';
        } else {
            // Add slide up effect
            desc.style.height = '0';
            setTimeout(function() {
                desc.style.display = 'none';
            }, 300); // Adjust the timing to match your CSS transition timing
        }
    });
});


<ul>
    <li>
        <div class="line">
            <a href="#" class="show">Show Description</a>
        </div>
        <div class="desc" style="display: none;">
            Description content goes here...
        </div>
    </li>
</ul>




.desc {
    display: none;
    overflow: hidden;
    transition: height 0.3s ease; /* Adjust the duration and easing as needed */
}

document.querySelectorAll('.show').forEach(function(link) {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        
        let desc = this.parentElement.nextElementSibling;
        
        if (desc.style.display === 'none') {
            desc.style.display = 'block';
            desc.style.height = desc.scrollHeight + 'px';
        } else {
            desc.style.height = '0';
            setTimeout(function() {
                desc.style.display = 'none';
            }, 300); // Match the transition duration in CSS
        }
    });
});