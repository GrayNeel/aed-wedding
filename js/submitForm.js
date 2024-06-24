import { card } from './card.js';
import { util } from './util.js';
import { storage } from './storage.js';

export const submitForm = (() => {

    const owns = storage('owns');
    const session = storage('session');

    // Define the request function
    const request = async (baseUrl, path) => {
        const response = await fetch(baseUrl + path);
        if (!response.ok) {
            if (response.status === 404) {
                // Specific handling for 404 status
                const errorBox = document.getElementById('informationBox');
                if (errorBox) {
                    errorBox.style.display = 'block'; // Make the hidden box visible
                }
            }
            return;
        } else {
            // Hide box if it was visible
            const errorBox = document.getElementById('informationBox');
            if (errorBox) {
                errorBox.style.display = 'none';
            }
        }
        return response.json();
    };

    const send = async (button) => {
        const id = button.getAttribute('data-uuid');

        const inviteCode = document.getElementById('form-invite-code');
        if (inviteCode.value.length == 0) {
            alert('Per favore, inserisci un codice invito.');
            return;
        }

        const btn = util.disableButton(button);

        // Use the request function
        try {
            const responseData = await request('http://localhost:3001', '/api/invitations/' + encodeURIComponent(inviteCode.value));
            if (responseData) {
                const dataDisplayElement = document.getElementById('dataDisplay');
                const submitFormButton = document.getElementById('submit-form-button');
                const inputCodeForm = document.getElementById('input-code-form');
                const insertCodeText = document.getElementById('insert-code-text');
                const submitForm = document.getElementById('submitForm');

                // Save invite code for future use
                owns.set('inviteCode', inviteCode.value);

                // Hide the form
                submitFormButton.style.display = 'none';
                inputCodeForm.style.display = 'none';
                insertCodeText.style.display = 'none';
                submitForm.style.display = 'none';

                // Show the invitation
                dataDisplayElement.style.display = 'block';
                dataDisplayElement.style.visibility = 'visible';
                
                // Content
                const name = responseData.name;
                const status = responseData.status;
                const comment = responseData.comment;
                const guests = responseData.guests;

                // Save guests for future use
                owns.set('guests', guests);

                const nameElement = document.getElementById('invitationName');
                nameElement.textContent = name;


                guests.forEach((guest) => {
                    const form = createFormElement(guest, guest.guestId);
                    appendFormToContainer(form);
                });

                // If guests accepted, show the additional options
                guests.forEach((guest) => {
                    if (guest.status === 'Accepted') {
                        const index = guest.guestId;
                        const additionalOptions = document.getElementById(`additionalOptions-${index}`);
                        additionalOptions.style.display = 'block';
                    }
                });

                const commentElement = document.getElementById('comments');
                commentElement.textContent = comment;
            } else {
                // Handle null response (e.g., error case)
                console.log('No data returned');
            }
        } catch (error) {
            console.error("Error during request:", error);
            // Optionally, handle errors such as network issues
        }
        
        btn.restore();

        // if (response?.code === 201) {
        //     owns.set(response.data.uuid, response.data.own);
        // }
    };

    const toggleAttendanceOptions = function (index) {
        const attendSelect = document.getElementById(`attend-${index}`);
        const additionalOptions = document.getElementById(`additionalOptions-${index}`);
        if (attendSelect.value === 'Accepted') {
            additionalOptions.style.display = 'block';
        } else {
            additionalOptions.style.display = 'none';
        }
    }

    const sendAllForms = function () {
        const guestForms = document.querySelectorAll('form[id^="guestForm-"]');
        const comment = document.getElementById('comments').value;
        const guestsData = Array.from(guestForms).map((form, index) => {
            // Remove the guestForm- prefix from index
            index = parseInt(form.id.split('-')[1]);
            let menuKids = document.getElementById(`kid-${index}`).value;

            // make menuKids a boolean
            if (menuKids === 'true') {
                menuKids = true;
            } else {
                menuKids = false;
            }
        
        let res = {
            guestId: index,
            menuType: document.getElementById(`menuType-${index}`).value,
            menuKids: menuKids,
            needs: document.getElementById(`help-${index}`).value,
            status: document.getElementById(`attend-${index}`).value
        };
        
        //console.log("Generated JSON is: " + JSON.stringify(res));

        return res; 
    });
        sendDataToAPI(comment, guestsData);
    };

    return {
        send,
        toggleAttendanceOptions,
        sendAllForms,
        renderLoading: card.renderLoading,
    };
})();

function createFormElement_old(guest, index) {
    // Create a form for each guest
    const form = document.createElement('form');
    form.id = `guestForm-${index}`;
    form.innerHTML = `
        <h2 class="font-esthetic" style="font-size: 2rem;" id="invitationName">${guest.fullName}</h2>
        <div class="mb-3">
            <label for="attend-${index}" class="form-label">Presente</label>
            <select class="form-select" id="attend-${index}" onchange="submitForm.toggleAttendanceOptions(${index})">
                <option value="Pending">Seleziona..</option>
                <option value="Accepted">Sì</option>
                <option value="Declined">No</option>
            </select>
        </div>
        <div id="additionalOptions-${index}" style="display: none;">
            <div class="mb-3">
                <label for="menuType-${index}" class="form-label">Menù desiderato</label>
                <select class="form-select" id="menuType-${index}">
                    <option value="Standard">Standard</option>
                    <option value="Vegetarian">Vegetariano</option>
                    <option value="Vegan">Vegano</option>
                    <option value="Gluten-Free">Senza glutine</option>
                    <option value="Lactose-Free">Senza lattosio</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="kid-${index}" class="form-label">Menù bimbo</label>
                <select class="form-select" id="kid-${index}">
                    <option value="false">No</option>
                    <option value="true">Sì</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="help-${index}" class="form-label">Necessiti assistenza con il trasporto o pernottamento?</label>
                <select class="form-select" id="help-${index}">
                    <option value="Autonomous">Sono autonomo</option>
                    <option value="Bus-Only">Bus</option>
                    <option value="Hotel-Only">Hotel</option>
                    <option value="Bus-And-Hotel">Bus e Hotel</option>
                </select>
            </div>
        </div>
    `;
    return form;
}

function createFormElement(guest, index) {
    const form = document.createElement('form');
    form.id = `guestForm-${index}`;

    const h2 = document.createElement('h2');
    h2.className = "font-esthetic";
    h2.style.fontSize = "2rem";
    h2.id = "invitationName";
    h2.textContent = guest.fullName;
    form.appendChild(h2);

    const div1 = document.createElement('div');
    div1.className = "mb-3";
    const label1 = document.createElement('label');
    label1.setAttribute("for", `attend-${index}`);
    label1.className = "form-label";
    label1.textContent = "Presente";
    div1.appendChild(label1);

    const select1 = document.createElement('select');
    select1.className = "form-select";
    select1.id = `attend-${index}`;
    select1.onchange = () => submitForm.toggleAttendanceOptions(index);
    ["Pending:Seleziona..", "Accepted:Sì", "Declined:No"].forEach(option => {
        const [value, text] = option.split(':');
        const opt = document.createElement('option');
        opt.value = value;
        opt.textContent = text;
        select1.appendChild(opt);
    });
    // Set the value of select1 based on guest.status
    select1.value = guest.status;

    div1.appendChild(select1);
    form.appendChild(div1);

    const div2 = document.createElement('div');
    div2.id = `additionalOptions-${index}`;
    div2.style.display = "none";

    const div2_1 = document.createElement('div');
    div2_1.className = "mb-3";
    const label2 = document.createElement('label');
    label2.setAttribute("for", `menuType-${index}`);
    label2.className = "form-label";
    label2.textContent = "Menù desiderato";
    div2_1.appendChild(label2);

    const select2 = document.createElement('select');
    select2.className = "form-select";
    select2.id = `menuType-${index}`;
    ["Standard", "Vegetarian:Vegetariano", "Vegan:Vegano", "Gluten-Free:Senza glutine", "Lactose-Free:Senza lattosio"].forEach(option => {
        const [value, text] = option.includes(':') ? option.split(':') : [option, option];
        const opt = document.createElement('option');
        opt.value = value;
        opt.textContent = text;
        select2.appendChild(opt);
    });
    // Set the value of select2 based on guest.menuType
    select2.value = guest.menuType;
    div2_1.appendChild(select2);
    div2.appendChild(div2_1);

    const div2_2 = document.createElement('div');
    div2_2.className = "mb-3";
    const label3 = document.createElement('label');
    label3.setAttribute("for", `kid-${index}`);
    label3.className = "form-label";
    label3.textContent = "Menù bimbo";
    div2_2.appendChild(label3);

    const select3 = document.createElement('select');
    select3.className = "form-select";
    select3.id = `kid-${index}`;
    ["false:No", "true:Sì"].forEach(option => {
        const [value, text] = option.split(':');
        const opt = document.createElement('option');
        opt.value = value;
        opt.textContent = text;
        select3.appendChild(opt);
    });
    // Set the value of select3 based on guest.menuKids
    // If guest.menuKids is 0, then set false, otherwise set true
    let menuKids = "false";
    if(guest.menuKids === 1) {
        menuKids = "true";
    }
    select3.value = menuKids;
    div2_2.appendChild(select3);
    div2.appendChild(div2_2);

    const div2_3 = document.createElement('div');
    div2_3.className = "mb-3";
    const label4 = document.createElement('label');
    label4.setAttribute("for", `help-${index}`);
    label4.className = "form-label";
    label4.textContent = "Necessiti assistenza con il trasporto o pernottamento?";
    div2_3.appendChild(label4);

    const select4 = document.createElement('select');
    select4.className = "form-select";
    select4.id = `help-${index}`;
    ["Autonomous:Sono autonomo", "Bus-Only:Bus", "Bus-And-Hotel:Hotel", "Hotel-Only:Bus e Hotel"].forEach(option => {
        const [value, text] = option.split(':');
        const opt = document.createElement('option');
        opt.value = value;
        opt.textContent = text;
        select4.appendChild(opt);
    });
    // Set the value of select4 based on guest.needs
    select4.value = guest.needs;
    div2_3.appendChild(select4);
    div2.appendChild(div2_3); 

    form.appendChild(div2);

    // Finally, add an hr
    const hr = document.createElement('hr');
    form.appendChild(hr);

    return form;
}

function appendFormToContainer(form) {
    const container = document.getElementById('guestFormsContainer');
    container.appendChild(form);
}

function sendDataToAPI(comment, guestsData) {
    const owns = storage('owns');

    let bodyJson = {
        comment: comment,
        guests: guestsData
    };

    const inviteCode = owns.get('inviteCode');

    fetch('http://localhost:3001/api/invitations/' + encodeURIComponent(inviteCode), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyJson),
    })
    .then(response => {
        // If this API call is fine it will return 204 No Content
        if (response.status === 204) {
            //alert('I dati sono stati inviati correttamente!');
            // Hide dataDisplay div
            const dataDisplayElement = document.getElementById('dataDisplay');
            dataDisplayElement.style.display = 'none';

            // Show confirmationResult div
            // const confirmationResultElement = document.getElementById('confirmationResult');
            // confirmationResultElement.style.display = 'block';
            // confirmationResultElement.style.visibility = 'visible';

            const thanksMessage = document.getElementById('thanksMessage');
            thanksMessage.textContent = "Grazie della conferma!";
        } else {
            alert('Si è verificato un errore durante l\'invio dei dati. Riprova più tardi.');
        }
    })
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
}