import { createBrowserRouter } from "react-router";
import { Suspense, lazy } from "react";
// import LightSidebarWithHeader from "./layout/LightSidebarWithHeader.jsx";

// const Home = lazy(() => import("./pages/home/home.jsx"));
// const About = lazy(() => import("./pages/home/about.jsx"));

//const MainLayout = lazy(() => import('./layout/MainLayout'));
const Navlayout = lazy(() => import('./layout/Navlayout'));
const Shadcnlayout = lazy(() => import('./layout/shadcn'));
const LightSidebarWithHeader = lazy(() => import('./layout/LightSidebarWithHeader'));
//const DarkSidebarWithHeader = lazy(() => import('./layout/DarkSidebarWithHeader'));
//const AdminLayout = lazy(() => import('./layout/AdminLayout'));

const Home = lazy(() => import('./pages/main/home'));
const About = lazy(() => import('./pages/main/about'));
const Login = lazy(() => import('./pages/main/login'));

const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Panel = lazy(() => import('./pages/admin/Panel'));
//const Department = lazy(() => import('./pages/admin/departments/Department.tsx'));
const Departments = lazy(() => import('./pages/admin/departments/page'));
const DepartmentTypes = lazy(() => import('./pages/admin/department-types/page'));
const Depform = lazy(() => import('./pages/admin/departments/Depform'));
const ViewItem = lazy(() => import('./pages/admin/departments/Depview'));
// const TaskPage = lazy(() => import('./pages/admin/tasks/page.tsx'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
        <Suspense fallback={<>...</>}>
          <Navlayout />
        </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
            <Suspense fallback={<>...</>}>
              <Home />
            </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
            <Suspense fallback={<>...</>}>
              <About />
            </Suspense>
        ),
      },
      {
        path: 'login',
        element: (
            <Suspense fallback={<>...</>}>
              <Login />
            </Suspense>
        ),
      },
    ],
  },
  {
    path: 'admin',
    element: (
        <Suspense fallback={<>...</>}>
          <Shadcnlayout />
        </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
            <Suspense fallback={<>...</>}>
              <Dashboard />
            </Suspense>
        ),
      },
      {
        path: 'panel',
        element: (
            <Suspense fallback={<>...</>}>
              <Panel />
            </Suspense>
        ),
      },
        // {
        // path: 'department',
        // element: (
        //     <Suspense fallback={<>...</>}>
        //       <Department />
        //     </Suspense>
        // )},
        {
            path: 'department-types',
            element: (
                <Suspense fallback={<>...</>}>
                  <DepartmentTypes />
                </Suspense>
            ),
        },
        {
            path: 'departments',
            element: (
                <Suspense fallback={<>...</>}>
                  <Departments />
                </Suspense>
            ),
        },
        {
            path: 'departments/new',
            element: (
                <Suspense fallback={<>...</>}>
                    <Depform />
                </Suspense>
            ),
        },
        {
            path: 'departments/:id',
            element: (
                <Suspense fallback={<>...</>}>
                    <ViewItem record={null} />
                </Suspense>
            ),
        },
        {
             path: 'departments/:id/edit',
            element: (
                <Suspense fallback={<>...</>}>
                    <Depform />
                </Suspense>
            ),
        },
    ],
  },
]);

