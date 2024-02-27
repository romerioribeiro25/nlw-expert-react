import { useMemo } from "react";
import { Theme, useTheme } from "../context/theme";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Sun, MoonStar, Monitor, LucideIcon,  } from "lucide-react";
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
}

const DynamicIcon: React.FC<IconProps> = ({ theme, className }) => {
  const Icon = useMemo(() => themeIcons[theme], [theme]);
  return <Icon className={className} />;
};

export function Navbar() {
  const { theme, setPrefersTheme } = useTheme();
  const themeOptions: Theme[] = ['light', 'dark', 'system'];
  const ThemeIcon = useMemo(() => (theme === 'light' ? themeIcons[theme]: themeIcons['dark']), [theme]);

  return (
    <div className="flex items-center justify-between">
      <img src={logo} alt="NLW Expert" />

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="rounded-full hover:bg-slate-800/5 dark:hover:bg-slate-800/60 p-1.5 text-lime-600 dark:text-lime-400 hover:text-lime-800 dark:hover:text-lime-600 transition duration-300">
            <ThemeIcon className="size-6" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content 
            className="bg-white rounded-md text-sm ring-1 ring-slate-900/10 shadow-lg w-36 overflow-hidden outline-none" 
            sideOffset={10}
            align="center"
          >
            {themeOptions.map((themeOption, index) => (
              <DropdownMenu.Item 
                key={index}
                className="py-2 px-3 flex items-center cursor-pointer hover:bg-slate-100 gap-2 text-slate-700 outline-none"
                onClick={() => setPrefersTheme(themeOption)}
              >
                <DynamicIcon theme={themeOption} className="size-5" />
                {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  )
}