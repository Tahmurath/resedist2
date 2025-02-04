import { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

const UserMenu = () => {
    const { i18n } = useTranslation();

    var savedLanguage = localStorage.getItem("language");
    if (!savedLanguage) {
        savedLanguage = 'en'
    }
    const [currentLanguage, setCurrentLanguage] = useState<string>(savedLanguage);

    // لیست زبان‌ها
    const languages = [
        { code: "en", name: "English" },
        { code: "fa", name: "فارسی" },
        { code: "de", name: "Deutsch" }, // اضافه شدن زبان سوم
    ];

    // خواندن زبان ذخیره‌شده از localStorage
    useEffect(() => {
        const savedLanguage = localStorage.getItem("language") || "en";
        setCurrentLanguage(savedLanguage);
        i18n.changeLanguage(savedLanguage);
    }, [i18n]);

    // تغییر زبان
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setCurrentLanguage(lng);
        localStorage.setItem("language", lng);
    };

    return (
        <div className="flex items-center space-x-4">
            {/* منوی زبان */}
            <Menu as="div" className="relative">
                <MenuButton className="flex items-center text-sm font-semibold text-gray-900">
                    {
                        languages.find((lang) => lang.code === currentLanguage)
                            ?.name
                    }
                    <ChevronDownIcon
                        aria-hidden="true"
                        className="ml-2 h-5 w-5 text-gray-400"
                    />
                </MenuButton>
                <MenuItems className="absolute right-0 z-10 mt-2.5 w-28 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    {languages.map((lang) => (
                        <MenuItem key={lang.code}>
                            <button
                                onClick={() => changeLanguage(lang.code)}
                                className={`block w-full px-3 py-1 text-sm leading-6 text-left ${
                                    currentLanguage === lang.code
                                        ? "font-bold"
                                        : ""
                                } hover:bg-gray-50`}
                            >
                                {lang.name}
                            </button>
                        </MenuItem>
                    ))}
                </MenuItems>
            </Menu>


        </div>
    );
};

export default UserMenu;
