import {Navigate, NavLink, useNavigate, useLocation} from "react-router";
import { Outlet } from "react-router";
import { useTranslation } from "react-i18next";
import {} from '@heroicons/react/24/outline'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'

import { useState } from 'react'
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
} from '@headlessui/react'
import {
    Bars3Icon,
    BellIcon,
    CalendarIcon,
    // ChartPieIcon,
    Cog6ToothIcon,
    // DocumentDuplicateIcon,
    // FolderIcon,
    HomeIcon,
    UsersIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import Isloggedin from "@/components/Isloggedin.tsx";
import {getAuthToken, getUser, setAuthToken} from "@/services/authService.ts";
import {Toaster} from "@/components/ui/toaster.tsx";
import UserMenu from "@/components/UserMenu.tsx";


function LightSidebarWithHeader() {

    const location = useLocation();

    const navigate = useNavigate();

    const token = getAuthToken()
    if (!token) {
        return <Navigate to="/login" />;
    }


    const [sidebarOpen, setSidebarOpen] = useState(false)

    const handleNavLinkClick = () => {
        setSidebarOpen(false);
    };

    const { t } = useTranslation();
    const navigation = [
        { name: t("site.home"), href: '/', icon: HomeIcon, current: true },
        { name: t("site.admin"), href: '/admin', icon: CalendarIcon, current: false },
        { name: t("site.panel"), href: '/admin/panel', icon: UsersIcon, current: false },
        { name: t("department.departments"), href: '/admin/departments', icon: UsersIcon, current: false ,
            children: [
                { name: t("department.departments"), href: '/admin/departments' },
                { name: 'Human Resources', href: '/admin/panel' },
                { name: 'Customer Success', href: '/admin' },
              ],
        },
        // { name: 'About', href: '/about', icon: FolderIcon, current: false },
        // { name: 'Documents', href: '#', icon: DocumentDuplicateIcon, current: false },
        // { name: 'Reports', href: '#', icon: ChartPieIcon, current: false },
    ]



    const logout = async () => {
        localStorage.removeItem("user");
        setAuthToken("");
        navigate("/");
    }


    const teams = [
        { id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false },
        { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
        { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false },
    ]

    const userNavigation = [
        { name: "Your profile", href: "/admin" },
        { name: "Sign out", onClick: () => logout() },
    ];


    function classNames(...classes:string[]) {
        return classes.filter(Boolean).join(' ')
    }


    return (
        <>
            {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}

            <Isloggedin>
            <div>
                <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
                    />

                    <div className="fixed inset-0 flex">
                        <DialogPanel
                            transition
                            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
                        >
                            <TransitionChild>
                                <div
                                    className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                                    <button type="button" onClick={() => setSidebarOpen(false)}
                                            className="-m-2.5 p-2.5">
                                        <span className="sr-only">Close sidebar</span>
                                        <XMarkIcon aria-hidden="true" className="h-6 w-6 text-white"/>
                                    </button>
                                </div>
                            </TransitionChild>
                            {/* Sidebar component, swap this element with another sidebar if you like */}
                            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                                <div className="flex h-16 shrink-0 items-center">
                                    <img
                                        alt="Your Company"
                                        src="/mark.svg"
                                        className="h-8 w-auto"
                                    />
                                </div>
                                <nav className="flex flex-1 flex-col">
                                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                        <li>
                                            <ul role="list" className="-mx-2 space-y-1">
                                                {navigation.map((item) => (
                                                    <li key={item.name}>
                                                        <NavLink
                                                            to={item.href}
                                                            onClick={handleNavLinkClick}
                                                            className={classNames(
                                                                location.pathname === item.href
                                                                    ? 'bg-gray-50 text-indigo-600'
                                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                                                                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                                            )}
                                                        >
                                                            <item.icon
                                                                aria-hidden="true"
                                                                className={classNames(
                                                                    location.pathname === item.href ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                                                                    'h-6 w-6 shrink-0',
                                                                )}
                                                            />
                                                            {item.name}
                                                        </NavLink>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                        <li>
                                            <div className="text-xs font-semibold leading-6 text-gray-400">Your teams
                                            </div>
                                            <ul role="list" className="-mx-2 mt-2 space-y-1">
                                                {teams.map((team) => (
                                                    <li key={team.name}>
                                                        <NavLink
                                                            to={team.href}
                                                            className={classNames(
                                                                team.current
                                                                    ? 'bg-gray-50 text-indigo-600'
                                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                                                                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                                            )}
                                                        >
                              <span
                                  className={classNames(
                                      team.current
                                          ? 'border-indigo-600 text-indigo-600'
                                          : 'border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600',
                                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium',
                                  )}
                              >
                                {team.initial}
                              </span>
                                                            <span className="truncate">{team.name}</span>
                                                        </NavLink>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                        <li className="mt-auto">
                                            <NavLink
                                                to="#"
                                                className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                            >
                                                <Cog6ToothIcon
                                                    aria-hidden="true"
                                                    className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                                                />
                                                Settings
                                            </NavLink>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>

                {/* Static sidebar for desktop */}
                <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-44 lg:flex-col">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div
                        className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
                        <div className="flex h-16 shrink-0 items-center">
                            <img
                                alt="Your Company"
                                src="/mark.svg"
                                className="h-8 w-auto"
                            />
                        </div>
                        <nav className="flex flex-1 flex-col">
                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        {navigation.map((item) => (
                                            <li key={item.name}>


                    {!item.children ? (
                    <NavLink
                      to={item.href}
                      className={classNames(
                        item.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700',
                      )}
                    >
                      <item.icon aria-hidden="true" className="h-6 w-6 shrink-0 text-gray-400" />
                      {item.name}
                    </NavLink>
                  ) : (
                    <Disclosure as="div">
                      <DisclosureButton
                        className={classNames(
                          item.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                          'group flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm font-semibold leading-6 text-gray-700',
                        )}
                      >
                        <item.icon aria-hidden="true" className="h-6 w-6 shrink-0 text-gray-400" />
                        {item.name}
                        <ChevronRightIcon
                          aria-hidden="true"
                          className="ml-auto h-5 w-5 shrink-0 text-gray-400 group-data-[open]:rotate-90 group-data-[open]:text-gray-500"
                        />
                      </DisclosureButton>
                      <DisclosurePanel as="ul" className="mt-1 px-2">
                        {item.children.map((subItem) => (
                          <li key={subItem.name}>
                            {/* 44px */}
                            {/* <DisclosureButton
                              as="a"
                              href={subItem.href}
                              className={classNames(
                                subItem.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                                'block rounded-md py-2 pl-9 pr-2 text-sm leading-6 text-gray-700',
                              )}
                            >
                              {subItem.name}
                            </DisclosureButton> */}

                            <NavLink
                                to={subItem.href}
                                className={classNames(
                                    location.pathname === subItem.href
                                        ? 'bg-gray-50 text-indigo-600'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                                    'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                )}
                            >
                                <item.icon
                                    aria-hidden="true"
                                    className={classNames(
                                        location.pathname === subItem.href ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                                        'h-6 w-6 shrink-0',
                                    )}
                                />
                                {subItem.name}
                            </NavLink>





                            
                          </li>
                        ))}
                      </DisclosurePanel>
                    </Disclosure>
                  )}










                                                
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li>
                                    <div className="text-xs font-semibold leading-6 text-gray-400">Your teams</div>
                                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                                        {teams.map((team) => (
                                            <li key={team.name}>
                                                <NavLink
                                                    to={team.href}
                                                    className={classNames(
                                                        team.current
                                                            ? 'bg-gray-50 text-indigo-600'
                                                            : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                                    )}
                                                >
                          <span
                              className={classNames(
                                  team.current
                                      ? 'border-indigo-600 text-indigo-600'
                                      : 'border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600',
                                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium',
                              )}
                          >
                            {team.initial}
                          </span>
                                                    <span className="truncate">{team.name}</span>
                                                </NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li className="mt-auto">
                                    <NavLink
                                        to="#"
                                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                    >
                                        <Cog6ToothIcon
                                            aria-hidden="true"
                                            className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                                        />
                                        Settings
                                    </NavLink>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className="lg:pl-44">
                    <div
                        className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                        <button type="button" onClick={() => setSidebarOpen(true)}
                                className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
                            <span className="sr-only">Open sidebar</span>
                            <Bars3Icon aria-hidden="true" className="h-6 w-6"/>
                        </button>

                        {/* Separator */}
                        <div aria-hidden="true" className="h-6 w-px bg-gray-200 lg:hidden"/>

                        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                            <form action="#" method="GET" className="relative flex flex-1">
                                <label htmlFor="search-field" className="sr-only">
                                    Search
                                </label>
                                <MagnifyingGlassIcon
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                                />
                                <input
                                    id="search-field"
                                    name="search"
                                    type="search"
                                    placeholder="Search..."
                                    className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                />
                            </form>
                            <div className="flex items-center gap-x-4 lg:gap-x-6">
                                <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                                    <span className="sr-only">View notifications</span>
                                    <BellIcon aria-hidden="true" className="h-6 w-6"/>
                                </button>



                                <UserMenu></UserMenu>



                                {/* Separator */}
                                <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"/>

                                {/* Profile dropdown */}
                                <Menu as="div" className="relative">
                                    <MenuButton className="-m-1.5 flex items-center p-1.5">
                                        <span className="sr-only">Open user menu</span>
                                        <img
                                            alt=""
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            className="h-8 w-8 rounded-full bg-gray-50"
                                        />
                                        <span className="hidden lg:flex lg:items-center">
                                            <span aria-hidden="true" className="ml-4 text-sm font-semibold leading-6 text-gray-900">
                                                {getUser()?.info?.Email}
                                            </span>
                                          <ChevronDownIcon aria-hidden="true" className="ml-2 h-5 w-5 text-gray-400"/>
                                        </span>
                                    </MenuButton>
                                    <MenuItems
                                        transition
                                        className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                    >
                                        {userNavigation.map((item) => (
                                            <MenuItem key={item.name}>
                                                {item.onClick ? (
                                                    <button
                                                        onClick={item.onClick}
                                                        className="block w-full px-3 py-1 text-sm leading-6 text-gray-900 text-left hover:bg-gray-50"
                                                    >
                                                        {item.name}
                                                    </button>
                                                ) : (
                                                    <NavLink
                                                        to={item.href}
                                                        className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                                                    >
                                                        {item.name}
                                                    </NavLink>
                                                )}
                                            </MenuItem>
                                        ))}
                                    </MenuItems>
                                </Menu>



                            </div>
                        </div>
                    </div>

                    <main className="py-10">
                        <div className="px-4 sm:px-6 lg:px-8 ">
                            {/*<div className="rounded-xl border bg-card text-card-foreground shadow">*/}
                            <div className="">
                            <Outlet/>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            </Isloggedin>
            <Toaster />
            </>

            )
            }

            export default LightSidebarWithHeader