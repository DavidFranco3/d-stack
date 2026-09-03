import { useState, createContext, useContext, ReactNode, useRef, useEffect, CSSProperties } from 'react';
import { MoreVertical } from 'lucide-react';

interface DropdownContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
  coords: { top: number; left: number; right: number };
}

const DropDownContext = createContext<DropdownContextType | undefined>(undefined);

export function Dropdown({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, right: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom,
        left: rect.left,
        right: rect.right,
      });
    }
    setOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleScroll = () => {
      if (open) setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [open]);

  return (
    <DropDownContext.Provider value={{ open, setOpen, toggleOpen, coords }}>
      <div className="inline-block" ref={triggerRef}>
        {children}
      </div>
    </DropDownContext.Provider>
  );
}

export function DropdownTrigger({ children }: { children?: ReactNode }) {
  const context = useContext(DropDownContext);
  if (!context) return null;

  return (
    <div onClick={context.toggleOpen} className="cursor-pointer inline-flex">
      {children || (
        <button type="button" className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors focus:outline-none cursor-pointer">
          <MoreVertical size={16} />
        </button>
      )}
    </div>
  );
}

export function DropdownContent({ children, align = 'right' }: { children: ReactNode; align?: 'left' | 'right' }) {
  const context = useContext(DropDownContext);
  if (!context || !context.open) return null;

  const style: CSSProperties = {
    position: 'fixed',
    top: `${context.coords.top + 4}px`,
    zIndex: 99999,
  };

  if (align === 'right') {
    style.left = `${Math.max(10, context.coords.right - 176)}px`;
  } else {
    style.left = `${Math.max(10, context.coords.left)}px`;
  }

  return (
    <div
      style={style}
      className="w-44 rounded-lg bg-[#0e1117] border border-[#1c222d] shadow-2xl py-1 overflow-hidden font-sans"
      onClick={() => context.setOpen(false)}
    >
      {children}
    </div>
  );
}

export function DropdownItem({ children, onClick, className = '' }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-[#161a22] flex items-center gap-2 transition-colors cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}

Dropdown.Trigger = DropdownTrigger;
Dropdown.Content = DropdownContent;
Dropdown.Item = DropdownItem;

export default Dropdown;
