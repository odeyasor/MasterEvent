

import React from "react"
//import Home from "./pages/Login.tsx"
import LoginPage from "./pages/Login.tsx"
import EventForm from "./pages/Add_guest.tsx"
import Add_guest from "./pages/Add_guest.tsx"
import Add_event from "./pages/AddEventPage.tsx"
import RegisterPage from "./pages/RegisterPage.tsx"
import Home from "./pages/Home.tsx"
import GuestForm from "./components/forms/AddEventForm.tsx"
import OrganizerForm from "./components/forms/OrganizerForm.tsx"
import OrganizersList from "./components/forms/OrganizersList.tsx"
import GuestsList from "./components/forms/GuestsList.tsx"
import Groups from "./components/Groups.tsx"

export default function App() {
    return <div className="">
        {/* <OrganizerForm onSubmit={undefined}/> */}
       <OrganizersList/>
    </div>
} 