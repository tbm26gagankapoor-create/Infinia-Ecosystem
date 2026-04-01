import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";

import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
} from "motion/react";
import { Link, useLocation } from "react-router-dom";
import React, {
  useState,
  useRef,
  createContext,
  useContext,
  useEffect,
} from "react";
import { X, Menu } from "lucide-react";

// Context to manage dock state
interface DockContextType {
  openDropdowns: Record<string, boolean>;
  hoveredLink: string | null;
  setHoveredLink: (href: string | null) => void;
  handleDropdownEnter: (id: string) => void;
  handleDropdownLeave: (id: string) => void;
  activePage?: string;
  isDark: boolean;
}

const DockContext = createContext<DockContextType | undefined>(undefined);

const useDock = () => {
  const context = useContext(DockContext);
  if (!context) {
    throw new Error("useDock must be used within a Dock component");
  }
  return context;
};

interface DockProps {
  children: React.ReactNode;
  closeDelay?: number;
  bottomOffset?: string;
  activePage?: string;
  className?: string;
}

export const Dock = ({
  children,
  closeDelay = 100,
  bottomOffset = "24px",
  activePage,
  className,
}: DockProps) => {
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {}
  );
  const closeTimeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout> | null>>({});
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleDropdownEnter = (id: string): void => {
    if (closeTimeoutsRef.current[id]) {
      clearTimeout(closeTimeoutsRef.current[id]!);
    }
    setOpenDropdowns((prev) => ({ ...prev, [id]: true }));
  };

  const handleDropdownLeave = (id: string): void => {
    closeTimeoutsRef.current[id] = setTimeout(() => {
      setOpenDropdowns((prev) => ({ ...prev, [id]: false }));
      setHoveredLink(null);
    }, closeDelay);
  };

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <LazyMotion features={domAnimation}>
      <DockContext.Provider
        value={{
          openDropdowns,
          hoveredLink,
          setHoveredLink,
          handleDropdownEnter,
          handleDropdownLeave,
          activePage,
          isDark,
        }}
      >
        <div className="w-full">
          {/* Desktop Dock */}
          <m.nav
            className="fixed bottom-[24px] left-0 w-full z-50 hidden md:block"
            style={{ bottom: bottomOffset }}
            aria-label="Main navigation"
          >
            <div className="px-4 flex justify-center">
              <m.div
                className={cn(
                  "relative flex flex-col items-center justify-center overflow-hidden backdrop-blur-md bg-white/90 dark:bg-black/50 border border-border p-[3px] rounded-[25px] shadow-lg",
                  className
                )}
                transition={{ duration: 0.2 }}
              >
                {/* Dropdown Contents */}
                {React.Children.map(children, (child) => {
                  if (
                    React.isValidElement(child) &&
                    (child.type as { displayName?: string }).displayName ===
                      "DockItem"
                  ) {
                    return React.cloneElement(
                      child as React.ReactElement<DockItemProps>,
                      { renderType: "content" }
                    );
                  }
                  return null;
                })}

                {/* Navigation Items */}
                <div className="flex items-center gap-[3px] relative z-10">
                  {React.Children.map(children, (child) => {
                    if (React.isValidElement(child)) {
                      return React.cloneElement(
                        child as React.ReactElement<
                          DockItemProps | DockIconProps | DockLinkProps
                        >,
                        { renderType: "trigger" }
                      );
                    }
                    return null;
                  })}
                </div>
              </m.div>
            </div>
          </m.nav>

          {/* Mobile Dock */}
          <div className="md:hidden fixed bottom-6 left-0 w-full z-50 flex justify-center pointer-events-none">
            <div className="pointer-events-auto">
              <AnimatePresence>
                {isMobileMenuOpen && (
                  <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-background z-40 flex flex-col pt-20 px-6 pb-32 overflow-y-auto"
                  >
                    <div className="flex flex-col gap-6">
                      {React.Children.map(children, (child) => {
                        if (!React.isValidElement(child)) return null;

                        // Handle DockLink
                        if ((child.type as { displayName?: string }).displayName === "DockLink") {
                          const props = child.props as DockLinkProps;
                          return (
                            <Link
                              to={props.href}
                              className="text-foreground text-2xl font-medium"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {props.label}
                            </Link>
                          );
                        }

                        // Handle DockIcon
                        if ((child.type as { displayName?: string }).displayName === "DockIcon") {
                          const props = child.props as DockIconProps;
                          return (
                            <Link
                              to={props.href}
                              className="text-foreground text-2xl font-medium flex items-center gap-3"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {props.icon}
                              <span>Home</span>
                            </Link>
                          );
                        }

                        // Handle DockItem (Sections with dropdowns)
                        if ((child.type as { displayName?: string }).displayName === "DockItem") {
                          const props = child.props as DockItemProps;
                          return (
                            <div className="flex flex-col gap-4">
                              <span className="text-muted-foreground text-lg">
                                {props.label}
                              </span>
                              <div className="flex flex-col gap-4 pl-4 border-l border-border">
                                {React.Children.map(
                                  props.children,
                                  (subChild) => {
                                    if (
                                      React.isValidElement(subChild) &&
                                      (subChild.type as { displayName?: string }).displayName ===
                                        "DockDropdownItem"
                                    ) {
                                      const subProps = subChild.props as DockDropdownItemProps;
                                      return (
                                        <Link
                                          to={subProps.href}
                                          className="text-foreground text-xl font-medium"
                                          onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                          {subProps.label}
                                        </Link>
                                      );
                                    }
                                    return null;
                                  }
                                )}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </m.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-full shadow-lg transition-all duration-300 relative z-50",
                  isMobileMenuOpen
                    ? "bg-transparent border border-foreground text-foreground"
                    : "bg-card text-foreground border border-border"
                )}
              >
                <span className="font-medium text-lg">Menu</span>
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </DockContext.Provider>
    </LazyMotion>
  );
};

interface DockItemProps {
  children: React.ReactNode;
  label: string;
  id?: string;
  renderType?: "content" | "trigger";
  className?: string;
}

export const DockItem = ({
  children,
  label,
  id,
  renderType,
  className,
}: DockItemProps) => {
  const {
    openDropdowns,
    handleDropdownEnter,
    handleDropdownLeave,
    isDark,
    activePage,
  } = useDock();
  const { pathname } = useLocation();

  const itemId = id || label.toLowerCase().replace(/\s+/g, "-");
  const isOpen = openDropdowns[itemId] || false;

  const isAnyChildActive = React.Children.toArray(children).some((child) => {
    if (
      React.isValidElement<DockDropdownItemProps>(child) &&
      (child.type as { displayName?: string }).displayName ===
        "DockDropdownItem" &&
      child.props.href
    ) {
      const currentPath = activePage !== undefined ? activePage : pathname;
      return currentPath === child.props.href;
    }
    return false;
  });

  if (renderType === "content") {
    return (
      <m.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          height: isOpen ? "auto" : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className={cn(
          "w-full overflow-hidden",
          isOpen ? "pointer-events-auto min-h-[60px]" : "pointer-events-none"
        )}
        onMouseEnter={() => handleDropdownEnter(itemId)}
        onMouseLeave={() => handleDropdownLeave(itemId)}
      >
        <div className="px-[15px] pt-[15px] pb-[20px] flex justify-between items-start w-full min-w-[300px]">
          <div className="gap-[12.5px] flex flex-col">{children}</div>
        </div>
      </m.div>
    );
  }

  return (
    <m.div
      className={cn(
        "transition-colors duration-200 text-[13px] leading-[10px] flex items-center gap-1 h-[38px] rounded-full cursor-pointer px-[14px]",
        isAnyChildActive
          ? "text-foreground font-medium"
          : "text-foreground",
        className
      )}
      onMouseEnter={() => handleDropdownEnter(itemId)}
      onMouseLeave={() => handleDropdownLeave(itemId)}
      animate={{
        backgroundColor:
          isOpen || isAnyChildActive
            ? isDark
              ? "#262626"
              : "#F0F0F0"
            : "transparent",
      }}
      whileHover={{
        backgroundColor: isDark ? "#262626" : "#F0F0F0",
      }}
      transition={{ duration: 0.2 }}
    >
      {label}
      <m.svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        className="text-foreground"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8 8.93934L4.53033 5.46967L3.46967 6.53033L6.58578 9.64645C7.36683 10.4275 8.63316 10.4275 9.41421 9.64645L12.5303 6.53033L11.4697 5.46967L8 8.93934Z"
          fill="currentColor"
        />
      </m.svg>
    </m.div>
  );
};
DockItem.displayName = "DockItem";

interface DockDropdownItemProps {
  href: string;
  label: string;
  image?: string;
  className?: string;
}

export const DockDropdownItem = ({
  href,
  label,
  className,
}: DockDropdownItemProps) => {
  const { hoveredLink, setHoveredLink, activePage } = useDock();
  const { pathname } = useLocation();

  const currentPath = activePage !== undefined ? activePage : pathname;
  const isMenuItemActive = currentPath === href;
  const isHovered = hoveredLink === href;

  return (
    <Link
      to={href}
      onMouseEnter={() => setHoveredLink(href)}
      className={cn(
        "block text-[13px] leading-[10px] transition-colors py-1",
        isMenuItemActive || isHovered
          ? "text-foreground font-medium"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {label}
    </Link>
  );
};
DockDropdownItem.displayName = "DockDropdownItem";

interface DockIconProps {
  icon: React.ReactNode;
  href: string;
  renderType?: "content" | "trigger";
  className?: string;
}

export const DockIcon = ({
  icon,
  href,
  renderType,
  className,
}: DockIconProps) => {
  const { isDark, activePage } = useDock();
  const { pathname } = useLocation();

  if (renderType === "content") return null;

  const currentPath = activePage !== undefined ? activePage : pathname;
  const isActive = currentPath === href;

  return (
    <Link to={href}>
      <m.div
        className={cn(
          "flex items-center justify-center w-[48px] h-[38px] rounded-full cursor-pointer",
          className
        )}
        animate={{
          backgroundColor: isActive
            ? isDark
              ? "#262626"
              : "#F0F0F0"
            : "transparent",
        }}
        whileHover={{
          backgroundColor: isDark ? "#262626" : "#F0F0F0",
        }}
        transition={{ duration: 0.2 }}
      >
        {icon}
      </m.div>
    </Link>
  );
};
DockIcon.displayName = "DockIcon";

interface DockLinkProps {
  label: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
  renderType?: "content" | "trigger";
  id?: string;
  className?: string;
}

export const DockLink = ({
  label,
  href,
  icon,
  external,
  renderType,
  className,
}: DockLinkProps) => {
  const { isDark, activePage } = useDock();
  const { pathname } = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  if (renderType === "content") return null;

  const currentPath = activePage !== undefined ? activePage : pathname;
  const isActive = currentPath === href;

  const linkContent = (
    <>
      {label}
      {icon && (
        <m.div
          initial={{ x: 0, y: 0 }}
          animate={{
            x: isHovered ? 2 : 0,
            y: isHovered ? -2 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </m.div>
      )}
    </>
  );

  const baseClassName = cn(
    "transition-colors duration-200 text-[13px] leading-[10px] flex items-center gap-1 h-[38px] rounded-full px-[14px]",
    isActive
      ? "text-foreground font-medium"
      : "text-foreground",
    className
  );

  if (external) {
    return (
      <m.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClassName}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{
          backgroundColor: isDark ? "#262626" : "#F0F0F0",
        }}
        transition={{ duration: 0.2 }}
      >
        {linkContent}
      </m.a>
    );
  }

  return (
    <m.div
      className="inline-block rounded-full"
      animate={{
        backgroundColor: isActive
          ? isDark
            ? "#262626"
            : "#F0F0F0"
          : "transparent",
      }}
      whileHover={{
        backgroundColor: isDark ? "#262626" : "#F0F0F0",
      }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={href} className={baseClassName}>
        {linkContent}
      </Link>
    </m.div>
  );
};
DockLink.displayName = "DockLink";

export default Dock;
