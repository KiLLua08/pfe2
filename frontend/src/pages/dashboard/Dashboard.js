import React from 'react'
import Sidebar from './Sidebar.js';
import DashboardHome from './Home.js';
import ChatComponent from './chats/ChatComponent.js';
import Tickets from './tickets/Tickets.js';
import Suiviprojets from './Suiviprojets.js';
import TicketCreate from './tickets/TicketCreate.js'
import TicketUpdate from './tickets/TicketUpdate.js'
import Utlisateur_list from './utilisateurs/Utilisateurs.js'
import Utilisateur_create from './utilisateurs/UtilisateurCreate.js'
import Utilisateur_update from './utilisateurs/UtilisateurUpdate.js'


import PackageList from './packages/Packages';
import PackageCreate from './packages/PackageCreate';
import PackageUpdate from './packages/PackageUpdate';

import DemandeCLientList from './demandesclient/DemandesClients.js';
import DemandeCLientUpdate from './demandesclient/DemandeClientUpdate.js';

import ProjetCreate from './projets/ProjetCreate.js';
import ProjetUpdate from './projets/ProjetUpdate.js';
import ProjetList from './projets/Projets.js';

import UserStories from './userstories/UserStories.js';
import Sprints from './sprints/Sprints.js';

import TacheCreate from './taches/TacheCreate.js';
import Taches from './taches/Taches.js';
import TacheUpdate from './taches/TacheUpdate.js';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute'; // Import your PrivateRoute component


const Dashboard = () => {



  return (
    <>
      <main>
        {/*Account home start*/}
        <section className="py-lg-7 py-5 bg-light-subtle">
          <div className="container">
            <div className="row">
              <Sidebar />
              <div className="col-lg-9 col-md-8">
                <Routes>
                  <Route path="/" element={<PrivateRoute element={DashboardHome} />} />
                  <Route path="/chat" element={<PrivateRoute element={ChatComponent} />} />
                  <Route path="/tickets" element={<PrivateRoute element={Tickets} />} />
                  <Route path="/ticket/create" element={<PrivateRoute element={TicketCreate} />} />
                  <Route path="/ticket/update/:id" element={<PrivateRoute element={TicketUpdate} />} />
                  <Route path="/suivi" element={<PrivateRoute element={Suiviprojets} />} />
                  <Route path="/projet" element={<PrivateRoute element={ProjetList} />} />
                  <Route path="/projet/create" element={<PrivateRoute element={ProjetCreate} />} />
                  <Route path="/projet/update/:id" element={<PrivateRoute element={ProjetUpdate} />} />
                  <Route path="/utilisateurs" element={<PrivateRoute element={Utlisateur_list} />} />
                  <Route path="/utilisateurs/create" element={<PrivateRoute element={Utilisateur_create} />} />
                  <Route path="/utilisateurs/update/:id" element={<PrivateRoute element={Utilisateur_update} />} />
                  <Route path="/packages" element={<PrivateRoute element={PackageList} />} />
                  <Route path="/packages/create" element={<PrivateRoute element={PackageCreate} />} />
                  <Route path="/packages/update/:id" element={<PrivateRoute element={PackageUpdate} />} />
                  <Route path="/demandes-client" element={<PrivateRoute element={DemandeCLientList} />} />
                  <Route path="/demandes-client/update/:id" element={<PrivateRoute element={DemandeCLientUpdate} />} />
                  <Route path="/projet/userstories/:projetId" element={<PrivateRoute element={UserStories} />} />

                  <Route path="/projet/sprint/:projetId" element={<PrivateRoute element={Sprints} />} />
                  <Route path="/taches" element={<PrivateRoute element={Taches} />} />
                  <Route path="/tache/create" element={<PrivateRoute element={TacheCreate} />} />
                  <Route path="/tache/update/:id" element={<PrivateRoute element={TacheUpdate} />} />
                </Routes>
              </div>
            </div>
          </div>
        </section>
        {/*Account home end*/}
      </main>

    </>
  )
}

export default Dashboard
