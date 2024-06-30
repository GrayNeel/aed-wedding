async function getAvailableInvitations() {
    const response = await fetch('/api/invitations');
    if (response.ok) {
        const invitations = await response.json();
        return invitations;
    }
    else {
        return { 'err': 'Error while fetching invitations' };
    }
}

// Get the QR Code of a given invitation
async function getQRCode(invitationId) {
    const response = await fetch(`/api/invitations/${invitationId}/qrcode`);
    if (response.ok) {
        const qrCode = await response.blob();
        return qrCode;
    }
    else {
        return { 'err': 'Error while fetching the QR Code' };
    }
}

// Remove invitation by its id
async function removeInvitation(invitationId) {
    const response = await fetch(`/api/invitations/${invitationId}`, { method: 'DELETE' });
    if (!response.ok) {
        return { 'err': 'Error while deleting the invitation' };
    }
}

// Add an invitation
async function addInvitation(invitation) {
    const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(invitation),
    });
    if (response.ok) {
        const invitationId = await response.json();
        return invitationId;
    }
    else {
        return { 'err': 'Error while adding the invitation' };
    }
}

/*********************************** USER'S SESSION API *********************************************/

async function logIn(credentials) {
    let response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user.name;
    }
    else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}

async function logOut() {
    await fetch('/api/sessions/current', { method: 'DELETE' });
}

async function getUserInfo() {
    const response = await fetch('http://localhost:3001/api/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;  // an object with the error coming from the server
    }
}

const API = { getAvailableInvitations, getQRCode, logIn, logOut, getUserInfo, removeInvitation, addInvitation};


export default API;