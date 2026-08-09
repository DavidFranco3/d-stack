import { useState, createContext, useContext, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

const DropDownContext = createContext();

export function Dropdown({ children }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, right: 0 });
  const triggerRef = useRef(null);

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
    const handleClickOutside = (event) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target)) {
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

export function DropdownTrigger({ children }) {
  const context = useContext(DropDownContext);
  if (!context) return null;

  return (
    <div onClick={context.toggleOpen} className="cursor-pointer">
      {children || (
        <button type="button" className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition focus:outline-none">
          <MoreVertical size={18} />
        </button>
      )}
    </div>
  );
}

export function DropdownContent({ children, align = 'right' }) {
  const context = useContext(DropDownContext);
  if (!context || !context.open) return null;

  const style = {
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
      className="w-44 rounded-2xl bg-[#12161f] border border-white/15 shadow-2xl py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      onClick={() => context.setOpen(false)}
    >
      {children}
    </div>
  );
}

export function DropdownItem({ children, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2 transition ${className}`}
    >
      {children}
    </button>
  );
}

Dropdown.Trigger = DropdownTrigger;
Dropdown.Content = DropdownContent;
Dropdown.Item = DropdownItem;

export default Dropdown;
