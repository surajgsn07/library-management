import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider , createBrowserRouter  } from 'react-router-dom'
import LandingPage from './components/LandingPae.jsx'
import Login from './components/student/Auth/Login.jsx'
import AdminLogin from './components/admin/AdminLogin.jsx'
import Register from './components/student/Auth/Register.jsx'
import AdminRegister from './components/admin/AdminRegister.jsx'
import StudentSidebar from './components/student/dashboard/Sidebar.jsx'
import AdminSidebar from './components/admin/dashboard/Sidebar.jsx'
import ProfileComponent from './components/student/dashboard/Profile.jsx'
import SearchBooks from './components/student/dashboard/Search.jsx'
import StudentDashboard from './components/student/dashboard/DashBoard.jsx'
import RequestedBooks from './components/admin/dashboard/RequestedBooks.jsx'
import AdminSearchBooks from "./components/admin/dashboard/SearchBook.jsx"
import BorrowedBooks from './components/admin/dashboard/BorrowedBooks.jsx'
import History from './components/admin/dashboard/History.jsx'
import AddBook from './components/admin/dashboard/AddBook.jsx'
import ExpandLibrary from "./components/student/dashboard/ExpandLibrary.jsx"
import { Provider } from 'react-redux'
import {store} from "./store/store.js"
import AllBookSuggestions from './components/admin/dashboard/BookSuggestions.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children:[
      {
        path:"/",
        element:<LandingPage/>
      },{
        path:"/student-login",
        element:<Login/>
      },{
        path:"/admin-login",
        element:<AdminLogin/>
      },{
        path:"/student-register",
        element:<Register/>
      },{
        path:"/student/dashboard",
        element:<StudentSidebar/>,
        children:[
          {
            path:"/student/dashboard/",
            element:<StudentDashboard/>
          },{
            path:"/student/dashboard/search",
            element:<SearchBooks/>
          },{
            path:"/student/dashboard/profile",
            element:<ProfileComponent/>
          },{
            path:"/student/dashboard/expand-library",
            element:<ExpandLibrary/>
          }
        ]
      },{
        path:"/admin/dashboard",
        element:<AdminSidebar/>,
        children:[
          {
            path:"/admin/dashboard/",
            element:<RequestedBooks/>,
          },{
            path:"/admin/dashboard/search",
            element:<AdminSearchBooks/>
          },{
            path:"/admin/dashboard/borrowed-books",
            element:<BorrowedBooks/>
          },{
            path:"/admin/dashboard/history",
            element:<History/>
          },{
            path:"/admin/dashboard/add-new-book",
            element:<AddBook/>
          },{
            path:"/admin/dashboard/book-suggestions",
            element:<AllBookSuggestions/>
          },{
            path:"/admin/dashboard/add-admin",
            element:<AdminRegister/>
          }
        ]
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
