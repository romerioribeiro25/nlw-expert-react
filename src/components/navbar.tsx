import { useMemo } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Sun, MoonStar, Monitor, LucideIcon,  } from "lucide-react";
import { tv } from "tailwind-variants";
import { Theme, useTheme } from "../context/theme";
import logo from "../assets/logo-nlw-expert.svg";

type ThemeIcons = {
  [key in Theme]: LucideIcon
};
 
const themeIcons: ThemeIcons = {
  light: Sun,
  dark: MoonStar,
  system: Monitor,
};

interface IconProps {
  theme: Theme;
  className: string;
};

const navbarTv = tv ({
  slots: { 
    contentNavbar: "flex items-center justify-between",
    contentDropdown: 
      "bg-white dark:bg-slate-700 rounded-md text-sm font-semibold ring-1 ring-slate-900/10 shadow-lg w-36 overflow-hidden",
    buttonIconDropdown:
        "rounded-full hover:bg-slate-800/5 dark:hover:bg-slate-800/60 p-1.5 text-lime-600 dark:text-lime-400 hover:text-lime-800 dark:hover:text-lime-600 transition duration-300",
    itemDropdown:
      "py-2 px-3 flex items-center cursor-pointer text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 gap-3 focus-visible:bg-slate-100 dark:focus-visible:bg-slate-600 outline-none",
    itemIconDropdown: "size-5 text-slate-400",
  },
  variants: {
    isSelectedItemDropdown: {
      true: {
        itemDropdown: "text-lime-600 dark:text-lime-500 bg-slate-50 dark:bg-slate-500/20",
        itemIconDropdown: "text-lime-600 dark:text-lime-500",
      }
    }
  },
  compoundSlots: [
    {
      slots: ["contentDropdown", "buttonIconDropdown"],
      className: "focus-visible:ring-2 focus-visible:ring-lime-400 outline-none"
    }
  ]
});

const DynamicIcon: React.FC<IconProps> = ({ theme, className }) => {
  const Icon = useMemo(() => themeIcons[theme], [theme]);
  return <Icon className={className} />;
};

export function Navbar() {
  const { theme, setPrefersTheme } = useTheme();
  const themeOptions: Theme[] = ['light', 'dark', 'system'];
  const ThemeIcon = useMemo(() => (theme === 'light' ? themeIcons[theme]: themeIcons['dark']), [theme]);

  const { contentNavbar, contentDropdown, buttonIconDropdown, itemDropdown, itemIconDropdown } = navbarTv();

  return (
    <div className={contentNavbar()}>
      <img src={logo} alt="NLW Expert" />

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild className="">
          <button className={buttonIconDropdown()}>
            <ThemeIcon className="size-6" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content 
            className={contentDropdown()}
            sideOffset={10}
          >
            {themeOptions.map((themeOption, index) => (
              <DropdownMenu.Item 
                key={index}
                className={itemDropdown({ isSelectedItemDropdown: (themeOption === theme)})}
                onClick={() => setPrefersTheme(themeOption)} 
              >
                <DynamicIcon 
                  theme={themeOption} 
                  className={itemIconDropdown({ isSelectedItemDropdown: (themeOption === theme)})} 
                />
                {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  )
}