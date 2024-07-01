import React from 'react'
import { CForm, CFormTextarea, CFormCheck, CFormSelect, CFormInput, CButton, CFormLabel } from '@coreui/react'
import API from '../api/api.js'
import { useEffect, useState } from 'react';

// This is opened in the browser when the link is clicked and invitationId is passed as a parameter
// The invitationId is used to fetch the invitation details from the server
// The invitation details are then displayed on the page

const InvitationPage = () => {
    // Fetch invitationId from url parameter that is like this: http://localhost:3000/#/invitations/RNJW5E
    const invitationId = window.location.hash.split('/')[2];

    // Fetch invitation details from server
    const [invitation, setInvitation] = useState({});
    const [loading, setLoading] = useState(true);

    // Get the invitation
    useEffect(() => {
        API.getInvitationDetails(invitationId).then(invitation => {
        // If invitation contains 'err' attribute, it means there was an error
        if(invitation.err) {
            console.log(invitation.err);
            setInvitation({});
        } else {
            setInvitation(invitation);
        }
        setLoading(false);
        }).catch(err => {
            console.log(err);
            setInvitation({});
            setLoading(false);
        });
    }, [loading]);

  return (
    <>
    <div className="text-center">
        <h1>Dettagli partecipazione</h1>
    </div>
        <CForm validated={true}>
        <div className="mb-3">
            <CFormLabel htmlFor="invitationName">Nome partecipazione</CFormLabel>
            <CFormInput
            type="text"
            id="invitationName"
            placeholder="Nome partecipazione"
            value={invitation.name}
            required
            />
        </div>
        <div className="mb-3">
            <CFormLabel htmlFor="invitationNumber">Numero partecipazione</CFormLabel>
            <CFormInput
            type="number"
            id="invitationNumber"
            placeholder="Numero partecipazione"
            value={invitation.invitation_number}
            required
            readOnly
            />
        </div>
        <div className="mb-3">
            <CFormLabel htmlFor="invitationStatus">Stato partecipazione</CFormLabel>
            <CFormInput
            type="text"
            id="invitationStatus"
            placeholder="Stato partecipazione"
            value={invitation.status}
            required
            readOnly
            />
        </div>

        {invitation.guests && invitation.guests.map((guest, index) => {
            return (
                <>
                <div key={index} className="mb-3">
                    <CFormLabel htmlFor={`invitationGuest${index}`}>Ospite {index + 1}</CFormLabel>
                    <CFormInput
                    type="text"
                    id={`invitationGuest${index}`}
                    placeholder={`Nome ospite`}
                    value={guest.fullName}
                    required
                    />
                </div>
                <div key={index} className="mb-3">
                    <CFormLabel htmlFor={`invitationMenuType${index}`}>Tipo menù</CFormLabel>
                    <CFormSelect
                    id={`invitationMenuType${index}`}
                    value={guest.menuType}
                    required
                    >
                    <option value="Standard">Standard</option>
                    <option value="Vegetarian">Vegetariano</option>
                    <option value="Vegan">Vegano</option>
                    <option value="Gluten-Free">Senza Glutine</option>
                    <option value="Lactose-Free">Senza Lattosio</option>
                    </CFormSelect>
                </div>

                </>
            )
        })}
        <div className="mb-3">
            <CFormLabel htmlFor="invitationComment">Commento</CFormLabel>
            <CFormTextarea
            id="invitationComment"
            placeholder="Questa sezione conterrà un commento degli invitati"
            value={invitation.comment}
            readOnly
            ></CFormTextarea>
        </div>
        <div className="mb-3">
            <CButton type="submit" color="primary">
            Conferma
            </CButton>
        </div>
        </CForm>
        </>
  )
}

export default React.memo(InvitationPage)
