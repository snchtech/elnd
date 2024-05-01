// Get the description content
let descriptionContent = document.getElementById('description').innerHTML;

// Open the modal with the description content
function openModal() {
    document.getElementById('modal-content').innerHTML = descriptionContent;
    document.getElementById('modal').style.display = 'block';
}

// Close the modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Close the modal when clicking outside of it
window.onclick = function(event) {
    let modal = document.getElementById('modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};







.modal {
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.4);
}

.modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
}

<div id="container">
    <div id="description">
        <!-- Your content goes here -->
        <h2>Title</h2>
        <p>Description goes here...</p>
    </div>
</div>

<div id="modal" class="modal">
    <div class="modal-content" id="modal-content"></div>
</div>