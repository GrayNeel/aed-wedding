import { card } from './card.js';
import { util } from './util.js';
import { storage } from './storage.js';
import { request, HTTP_GET, HTTP_POST, HTTP_DELETE, HTTP_PUT } from './request.js';

export const submitForm = (() => {

    const owns = storage('owns');
    const session = storage('session');

    const send = async (button) => {
        const id = button.getAttribute('data-uuid');

        const inviteCode = document.getElementById('form-invite-code');
        if (inviteCode.value.length == 0) {
            alert('Per favore, inserisci un codice invito.');
            return;
        }

        const btn = util.disableButton(button);

        const response = await request(HTTP_POST, '/api/comment')
            .token(session.get('token'))
            .body({
                id: id,
                name: name.value,
                presence: presence ? presence.value === "1" : true,
                comment: form.value
            })
            .then();

        btn.restore();

        if (response?.code === 201) {
            owns.set(response.data.uuid, response.data.own);
        }
    };

    return {
        send,
        renderLoading: card.renderLoading,
    }
})();