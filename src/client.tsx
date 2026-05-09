import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { createRouter } from './router' 
import './styles.css'

// Create the router using your project's existing logic
const router = createRouter()

// This is the magic line that fixes the "This page didn't load" error
// It tells the router it lives inside the /timebridge/ folder
router.options.basepath = '/timebridge/'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
