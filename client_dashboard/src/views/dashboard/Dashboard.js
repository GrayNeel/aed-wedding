import React from 'react'
import classNames from 'classnames'
import './style.css';
import { useEffect, useState } from 'react';

import {
  CAvatar,
  CBadge,
  CButton,
  CButtonGroup,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormLabel,
  CFormInput,
  CFormFeedback,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
  cilDelete,
} from '@coreui/icons'

import API from '../../api/api.js'

const Dashboard = () => {
  // List of families
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal removal activation
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [deleteInvitation, setDeleteInvitation] = useState([]);

  // Modal addition activation
  const [addModalVisible, setAddModalVisible] = useState(false)

  const [updated, setUpdated] = useState(false);

  // Get available invitations
  useEffect(() => {
    API.getAvailableInvitations().then(newInvitations => {
      // Sort the invitations by name
      if(newInvitations.length > 0) {
        newInvitations.sort((a, b) => a.name.localeCompare(b.name));
        setInvitations(newInvitations);
      } else 
        setInvitations([]);
      setLoading(false);
      setUpdated(false);
    }).catch(err => {
      console.log(err);
      setInvitations([]);
      setLoading(false);
      setUpdated(false);
    });
  }, [updated]);

  if (loading) {
    return (
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Lista Inviti</CCardHeader>
            <CCardBody>
              <CProgress color="info" value={100} animated className="mb-3" />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    );
  } else {

  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-3">
            <CCardHeader>Tutte le partecipazioni</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">ID</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Nome Partecipazione</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Stato</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Membri</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Invitati</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary"></CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {invitations.map((item, index) => (
                    <CTableRow v-for="item in invitations" key={index}>
                      <CTableDataCell className="text-center">
                        <CAvatar color="primary" textColor="white">{item.invitationNumber}</CAvatar>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.invitationId}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.name}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="primary" shape="rounded-pill">{item.status}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.guests.length}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.guests.length === 0 ? <em>{'Nessun invitato'}</em> : item.guests.map((guest) => (guest.fullName))}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                      <CButtonGroup role="group" aria-label="Basic example">
                        <CButton color="primary" size="sm" onClick={() => window.location.href = '/#/invitations/' + item.invitationId}>Visualizza</CButton>
                        <CButton color="primary" size="sm" onClick={() => {setDeleteModalVisible(true); setDeleteInvitation(item)}}>Elimina</CButton>
                      </CButtonGroup>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      { /* Rounded button with a plus icon */}
      <CButton className="floating-button" color="primary" shape="rounded-pill" size="lg" onClick={() => setAddModalVisible(true)}>
        +
      </CButton>
      <AddInvitationModal visible={addModalVisible} setVisible={setAddModalVisible} setUpdated={setUpdated} invitations={invitations}/>
      <DeleteInvitationModal visible={deleteModalVisible} setVisible={setDeleteModalVisible} invitation={deleteInvitation} setInvitation={setDeleteInvitation} setUpdated={setUpdated}/>
    </>
  )
}
}

function DeleteInvitationModal(props) {
  const handleClose = () => {
    props.setVisible(false);
    props.setInvitation([]);
  }

  function removeInvitation(invitationId) {
      API.removeInvitation(invitationId).then(() => {
          props.setVisible(false);
          props.setInvitation([]);
          props.setUpdated(true);
      }).catch(err => {
          console.log(err);
      });
  }

  return (
      <CModal visible={props.visible} onClose={handleClose} aria-labelledby="deleteInvitationModal">
          <CModalHeader>
            <CModalTitle id="deleteInvitationModal">Ripensaci..</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <p>Aspetta, aspetta! Stai per eliminare l'invito <b>{props.invitation.name}</b>.</p> 
            <p>Ne sei proprio sicuro?</p>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={handleClose}>
              Annulla
            </CButton>
            <CButton color="primary" onClick={() => removeInvitation(props.invitation.invitationId)}>Procedi</CButton>
          </CModalFooter>
        </CModal>
  );
}

function AddInvitationModal(props) {
  const [validated, setValidated] = useState(false)
  const [name, setName] = useState("")
  const [invalid, setInvalid] = useState(false)
  const [feedback, setFeedback] = useState("")

  const handleSubmit = (event) => {
    let valid = true;
    const form = event.currentTarget
    
    event.preventDefault()

    if (form.checkValidity() === false) {  
      event.stopPropagation()
      valid = false;
    } else {
      /* Check that the field name of the input is at least one character */
      if (name.length < 1) {
        event.stopPropagation()
        valid = false;
        setInvalid(true);
        setFeedback("Il nome dell'invito deve essere almeno un carattere");
      } 

      /* Check that the invitatio name is not in the invitations props */
      if (props.invitations.some(invitation => invitation.name === name)) {
        event.stopPropagation()
        valid = false;
        setInvalid(true);
        setFeedback("Esiste già un invito con questo nome");
      }
    }

    if (valid) {
      let res = {name: name, status: "Pending", comment: ""}
      
      API.addInvitation(res).then(() => {
        props.setVisible(false);
        props.setUpdated(true);
        setInvalid(false);
        setFeedback("");
        setName("");
      }).catch(err => {
          console.log(err);
      });
      setValidated(true);
    }
    
    
  }

  const handleClose = () => {
    props.setVisible(false);
    props.setUpdated(true);
    setValidated(false);
    setName("");
    setFeedback("");
    setInvalid(false);
  }

  return (
      <CModal visible={props.visible} onClose={handleClose} aria-labelledby="addInvitationModal">
          <CModalHeader>
            <CModalTitle id="addInvitationModal">Aggiungi un invito</CModalTitle>
          </CModalHeader>
          <CForm className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleSubmit}>
            <CModalBody>  
              <div className="mb-3">
                <CFormLabel htmlFor="addInvitation">Nome invito</CFormLabel>
                <CFormInput id="addInvitation" value={name} type="text" placeholder="Famiglia Rossi" invalid={invalid} feedbackInvalid={feedback} onChange={td => setName(td.target.value)}/>
              </div>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={handleClose}>
                Annulla
              </CButton>
              <CButton color="primary" type="submit">Aggiungi</CButton>
            </CModalFooter>
          </CForm>
        </CModal>
  );
}


export default Dashboard
