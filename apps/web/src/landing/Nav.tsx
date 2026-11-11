import { SignInButton } from "./SignInButton";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Logo } from "../design/Logo";
import { NAV, PAGE_ORDER, navOwner, type NavItem } from "./nav-items";

/** The section crossing the middle of the window, or null while the hero is in view. */
function useSectionInView(enabled: boolean): string | null {
  const [inView, setInView] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) {
      setInView(null);
      return;
    }
    const watch = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setInView(entry.target.id);
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    for (const id of PAGE_ORDER) {
      const el = document.getElementById(id);
      if (el) watch.observe(el);
    }
    return () => {
      watch.disconnect();
    };
  }, [enabled]);
  return inView;
}

const Chevron = () => (
  <svg viewBox="0 0 12 12" aria-hidden="true">
    <path d="M3 4.5 6 7.5 9 4.5" />
  </svg>
);

/** One group: its own link, a button that opens its menu, and the menu. Hover opens it too. */
function Group({
  item,
  i,
  open,
  current,
  inView,
  onOpen,
  onGo,
}: {
  item: NavItem & { children: NonNullable<NavItem["children"]> };
  i: number;
  open: boolean;
  current: boolean;
  inView: string | null;
  onOpen: (open: boolean) => void;
  onGo: () => void;
}) {
  const menuId = `pp-lp-menu-${item.id}`;
  return (
    <div
      className="pp-lp-group"
      data-open={open}
      style={{ "--i": i } as CSSProperties}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") onOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") onOpen(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onOpen(false);
      }}
    >
      <a
        href={`#${item.id}`}
        className="pp-lp-navlink"
        aria-current={current ? "location" : undefined}
        onClick={onGo}
      >
        {item.label}
      </a>
      <button
        type="button"
        className="pp-lp-more"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`More in ${item.label}`}
        onClick={(event) => {
          // A pointer resting on the group has already opened it, so a click there keeps it
          // open; from the keyboard (no pointer, detail 0) the button toggles.
          onOpen(event.detail > 0 && window.matchMedia("(hover: hover)").matches ? true : !open);
        }}
      >
        <Chevron />
      </button>
      <ul id={menuId} className="pp-lp-menu">
        {item.children.map((child, n) => (
          <li key={child.label} style={{ "--n": n } as CSSProperties}>
            <a
              href={`#${child.id}`}
              aria-current={inView === child.id ? "location" : undefined}
              onClick={onGo}
            >
              <b>{child.label}</b>
              {child.note !== undefined && <small>{child.note}</small>}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The bar that floats over the page, shrinking once the hero has scrolled away. Its items follow
 * the page's order; two of them group several sections in a menu. The item holding the section
 * in view is marked as the current location. On phones it opens into a full height list.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const top = useRef<HTMLSpanElement>(null);
  const inView = useSectionInView(scrolled);
  const owner = navOwner(inView);

  useEffect(() => {
    const marker = top.current;
    if (!marker) return;
    const watch = new IntersectionObserver(([entry]) => {
      setScrolled(entry?.isIntersecting === false);
    });
    watch.observe(marker);
    return () => {
      watch.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open && menu === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      setMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [open, menu]);

  const go = () => {
    setOpen(false);
    setMenu(null);
  };

  return (
    <>
      <span ref={top} className="pp-lp-top" aria-hidden="true" />
      <header className="pp-lp-nav" data-scrolled={scrolled} data-open={open}>
        <Logo />
        <nav aria-label="Sections" id="pp-lp-sections">
          {NAV.map((item, i) =>
            item.children ? (
              <Group
                key={item.id}
                item={{ ...item, children: item.children }}
                i={i}
                open={menu === item.id}
                current={owner === item.id}
                inView={inView}
                onOpen={(next) => {
                  setMenu(next ? item.id : null);
                }}
                onGo={go}
              />
            ) : (
              <a
                key={item.id}
                href={item.href ?? `#${item.id}`}
                className="pp-lp-navlink"
                aria-current={owner === item.id ? "location" : undefined}
                onClick={go}
                style={{ "--i": i } as CSSProperties}
              >
                {item.label}
              </a>
            ),
          )}
        </nav>
        <SignInButton />
        <button
          type="button"
          className="pp-lp-toggle"
          aria-expanded={open}
          aria-controls="pp-lp-sections"
          aria-label={open ? "Close the menu" : "Open the menu"}
          onClick={() => {
            setOpen(!open);
          }}
        >
          <i />
          <i />
        </button>
      </header>
    </>
  );
}
