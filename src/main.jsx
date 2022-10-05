import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import Root, { loader as rootLoader, action as rootAction } from './routes/Root'
import ErrorPage from './ErrorPage'
import Contact, { loader as contactLoader, action as contactAction } from './routes/Contact'

import { action as destroyAction } from './routes/Destroy'
import Index from "./routes/index";
import EditContact, { action as editAction, loader as editLoader } from './routes/Edit'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Index />
      },
      {
        path: 'contacts/:contactId',
        element: <Contact />,
        loader: contactLoader,
        action: contactAction,
        children: [
          {
            path: '/contacts/:contactId/destroy',
            action: destroyAction,
            errorElement: <div> Error </div>
          }
        ]
      },
      {
        path: 'contacts/:contactId/edit',
        element: <EditContact />,
        loader: editLoader,
        action: editAction,

      }
    ],
    loader: rootLoader,
    action: rootAction,
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
